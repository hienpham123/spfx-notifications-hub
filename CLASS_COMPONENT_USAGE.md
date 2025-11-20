# Sử dụng SPFx Notifications Hub trong Class Components

Hướng dẫn chi tiết cách sử dụng SPFx Notifications Hub trong project sử dụng Class Components.

## 1. Cài đặt

```bash
npm install spfx-notifications-hub
```

## 2. Setup Provider (Bắt buộc)

Wrap toàn bộ app với `NotificationsProvider` ở component gốc nhất:

```tsx
import React from 'react';
import { NotificationsProvider } from 'spfx-notifications-hub';
import 'spfx-notifications-hub/styles';

class App extends React.Component {
  render() {
    return (
      <NotificationsProvider
        defaultDuration={5000}
        loggingConfig={{
          enabled: true,
          logLevel: 'all',
          onLog: async (notification) => {
            // Optional: Log to server
            console.log('[Notification]', notification);
          },
        }}
      >
        {/* Your app components */}
        <YourMainComponent />
      </NotificationsProvider>
    );
  }
}

export default App;
```

## 3. Cách sử dụng trong Class Components

### Cách 1: Sử dụng Global API (Đơn giản nhất) ⭐

**Không cần HOC, không cần render props, chỉ cần import và dùng!**

```tsx
import React from 'react';
import { notify, confirm } from 'spfx-notifications-hub';

class MyComponent extends React.Component {
  handleSuccess = () => {
    notify.success('Operation completed successfully!', {
      title: 'Success',
      duration: 3000,
    });
  };

  handleWarning = () => {
    notify.warning('Please check your input', {
      title: 'Warning',
    });
  };

  handleError = () => {
    notify.error('Something went wrong!', {
      title: 'Error',
    });
  };

  handleInfo = () => {
    notify.info('This is an information message', {
      title: 'Info',
    });
  };

  handleConfirm = async () => {
    const result = await confirm({
      title: 'Confirm Action',
      message: 'Are you sure you want to delete this item?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (result) {
      notify.success('Item deleted successfully!');
    } else {
      notify.info('Action cancelled');
    }
  };

  render() {
    return (
      <div className="stack gap-8">
        <button onClick={this.handleSuccess}>Success</button>
        <button onClick={this.handleWarning}>Warning</button>
        <button onClick={this.handleError}>Error</button>
        <button onClick={this.handleInfo}>Info</button>
        <button onClick={this.handleConfirm}>Confirm</button>
      </div>
    );
  }
}

export default MyComponent;
```

### Cách 2: Sử dụng HOC (Higher Order Component)

**Khi bạn muốn truy cập `dialog` API hoặc cần type safety tốt hơn:**

```tsx
import React from 'react';
import { withNotifications, WithNotificationsProps } from 'spfx-notifications-hub';
import { PrimaryButton } from '@fluentui/react';

interface MyComponentProps extends WithNotificationsProps {
  // Your custom props
  title?: string;
}

class MyComponent extends React.Component<MyComponentProps> {
  handleSuccess = () => {
    this.props.notify.success('Success!');
  };

  handleDialog = () => {
    const dialogId = this.props.dialog.show({
      title: 'Custom Dialog',
      content: (
        <div>
          <p>This is a custom dialog from class component</p>
        </div>
      ),
      size: 'medium',
      footer: (
        <PrimaryButton
          onClick={() => {
            this.props.dialog.hide(dialogId);
            this.props.notify.info('Dialog closed');
          }}
        >
          Close
        </PrimaryButton>
      ),
    });
  };

  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <PrimaryButton onClick={this.handleSuccess}>Success</PrimaryButton>
        <PrimaryButton onClick={this.handleDialog}>Show Dialog</PrimaryButton>
      </div>
    );
  }
}

// Wrap component với HOC
export default withNotifications(MyComponent);
```

### Cách 3: Sử dụng Render Props

**Khi bạn muốn linh hoạt hơn:**

```tsx
import React from 'react';
import { NotificationsConsumer } from 'spfx-notifications-hub';
import { PrimaryButton } from '@fluentui/react';

class MyComponent extends React.Component {
  render() {
    return (
      <NotificationsConsumer>
        {({ notify, confirm, dialog }) => (
          <div>
            <PrimaryButton onClick={() => notify.success('Hello!')}>
              Success
            </PrimaryButton>
            <PrimaryButton
              onClick={async () => {
                const result = await confirm({
                  message: 'Are you sure?',
                });
                if (result) {
                  notify.success('Confirmed!');
                }
              }}
            >
              Confirm
            </PrimaryButton>
            <PrimaryButton
              onClick={() => {
                const id = dialog.show({
                  title: 'Dialog',
                  content: <p>Dialog content</p>,
                });
                setTimeout(() => dialog.hide(id), 3000);
              }}
            >
              Show Dialog
            </PrimaryButton>
          </div>
        )}
      </NotificationsConsumer>
    );
  }
}

export default MyComponent;
```

## 4. Import CSS (Bắt buộc)

Đảm bảo import CSS vào entry point của app:

```tsx
// index.tsx hoặc App.tsx
import 'spfx-notifications-hub/styles';
```

Hoặc nếu dùng CSS modules:

```tsx
import 'spfx-notifications-hub/dist/index.css';
```

## 5. Ví dụ đầy đủ

```tsx
import React from 'react';
import { NotificationsProvider } from 'spfx-notifications-hub';
import { notify, confirm } from 'spfx-notifications-hub';
import { initializeIcons } from '@fluentui/react';
import { PrimaryButton, DefaultButton } from '@fluentui/react';

// Initialize icons
initializeIcons();

// Component sử dụng Global API
class TodoList extends React.Component {
  state = {
    todos: [] as string[],
  };

  handleAdd = () => {
    this.setState({ todos: [...this.state.todos, 'New todo'] });
    notify.success('Todo added successfully!');
  };

  handleDelete = async (index: number) => {
    const result = await confirm({
      title: 'Delete Todo',
      message: 'Are you sure you want to delete this todo?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (result) {
      const newTodos = [...this.state.todos];
      newTodos.splice(index, 1);
      this.setState({ todos: newTodos });
      notify.success('Todo deleted!', {
        action: {
          label: 'Undo',
          onClick: () => {
            this.setState({ todos: this.state.todos });
            notify.info('Undone');
          },
        },
      });
    }
  };

  render() {
    return (
      <div>
        <PrimaryButton onClick={this.handleAdd}>Add Todo</PrimaryButton>
        {this.state.todos.map((todo, index) => (
          <div key={index}>
            <span>{todo}</span>
            <DefaultButton onClick={() => this.handleDelete(index)}>
              Delete
            </DefaultButton>
          </div>
        ))}
      </div>
    );
  }
}

// App component
class App extends React.Component {
  render() {
    return (
      <NotificationsProvider defaultDuration={5000}>
        <TodoList />
      </NotificationsProvider>
    );
  }
}

export default App;
```

## 6. API Reference

### Global API (`notify`, `confirm`)

```tsx
import { notify, confirm } from 'spfx-notifications-hub';

// Toast notifications
notify.success(message: string, options?: { title?: string; duration?: number; action?: { label: string; onClick: () => void } });
notify.warning(message: string, options?: { title?: string; duration?: number; action?: { label: string; onClick: () => void } });
notify.error(message: string, options?: { title?: string; duration?: number; action?: { label: string; onClick: () => void } });
notify.info(message: string, options?: { title?: string; duration?: number; action?: { label: string; onClick: () => void } });

// Confirm dialog
const result: Promise<boolean> = await confirm({
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
});
```

### HOC API (`withNotifications`)

```tsx
import { withNotifications, WithNotificationsProps } from 'spfx-notifications-hub';

// Props được inject vào component:
interface WithNotificationsProps {
  notify: {
    success: (message: string, options?) => void;
    warning: (message: string, options?) => void;
    error: (message: string, options?) => void;
    info: (message: string, options?) => void;
  };
  confirm: (options) => Promise<boolean>;
  dialog: {
    show: (options) => string; // Returns dialog ID
    hide: (id: string) => void;
  };
}
```

## 7. Lưu ý quan trọng

1. **Bắt buộc có `NotificationsProvider`**: Phải wrap app với `NotificationsProvider`
2. **Initialize Icons**: Phải gọi `initializeIcons()` từ `@fluentui/react`
3. **Import CSS**: Phải import CSS của library
4. **Fluent UI v8**: Library sử dụng `@fluentui/react` (v8), không phải v9

## 8. Troubleshooting

### Toast không hiển thị?
- Kiểm tra đã wrap app với `NotificationsProvider` chưa
- Kiểm tra đã import CSS chưa
- Kiểm tra đã gọi `initializeIcons()` chưa

### TypeScript errors?
- Đảm bảo đã import đúng types: `import { WithNotificationsProps } from 'spfx-notifications-hub'`
- Kiểm tra `tsconfig.json` có `"skipLibCheck": true` không

### Dialog không hiển thị?
- Đảm bảo đã wrap app với `NotificationsProvider`
- Kiểm tra `dialog.show()` trả về ID và dùng ID đó để `dialog.hide()`

