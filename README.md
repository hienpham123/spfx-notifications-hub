# SPFx Notifications Hub

A powerful library for toast, snackbar, confirm popup, and dialog notifications following Fluent UI standards for SPFx and React applications. Works seamlessly with both **Functional Components** and **Class Components**.

## ✅ Compatibility

- **React**: 16.8+ to 19.x (supports all modern React versions)
- **Node.js**: 12.0+ (compatible with older Node versions)
- **TypeScript**: 4.0+ (optional, for type definitions)

## ✨ Features

- 🎯 **Promise-based confirm()** - Confirmation with async/await
- 🔔 **notify.success()** - Success notifications
- ⚠️ **notify.warning()** - Warning notifications
- ❌ **notify.error()** - Error notifications
- ℹ️ **notify.info()** - Info notifications
- 🌐 **Global provider** - No prop drilling needed
- ⏱️ **Auto dismiss** - Automatically closes after specified duration with progress bar
- 📊 **Server logging** - Optional server logging
- 🎨 **Fluent UI v8** - Beautiful UI following Microsoft Fluent standards
- 📦 **Class Component Support** - Works with both functional and class components

## 📦 Installation

```bash
npm install spfx-notifications-hub
```

## 🚀 Quick Start

### 1. Setup Provider (Required)

Wrap your app with `NotificationsProvider`:

```tsx
import React from 'react';
import { NotificationsProvider } from 'spfx-notifications-hub';
import { initializeIcons } from '@fluentui/react';

// Initialize Fluent UI icons (Required)
initializeIcons();

// For Functional Component
function App() {
  return (
    <NotificationsProvider
      defaultDuration={5000}
      loggingConfig={{
        enabled: true,
        logLevel: 'all',
        onLog: async (notification) => {
          console.log('Notification:', notification);
        },
      }}
    >
      <YourApp />
    </NotificationsProvider>
  );
}

// For Class Component
class App extends React.Component {
  render() {
    return (
      <NotificationsProvider defaultDuration={5000}>
        <YourApp />
      </NotificationsProvider>
    );
  }
}
```

### 2. Import CSS (Required)

```tsx
// In your entry point (index.tsx or App.tsx)
import 'spfx-notifications-hub/styles';
// or
import 'spfx-notifications-hub/dist/index.css';
```

## 📖 Usage Examples

### Functional Components

#### Using Hooks (Recommended)

```tsx
import React from 'react';
import { useNotify, useConfirm, useDialog } from 'spfx-notifications-hub';
import { PrimaryButton } from '@fluentui/react';

function MyComponent() {
  const notify = useNotify();
  const confirm = useConfirm();
  const dialog = useDialog();

  const handleSuccess = () => {
    notify.success('Operation successful!', {
      title: 'Success',
      duration: 3000,
    });
  };

  const handleDelete = async () => {
    const result = await confirm({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this item?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (result) {
      notify.success('Item deleted!');
    }
  };

  const handleShowDialog = () => {
    const dialogId = dialog.show({
      title: 'My Dialog',
      content: <div>Dialog content here</div>,
      size: 'medium',
    });
  };

  return (
    <div>
      <PrimaryButton onClick={handleSuccess}>Success</PrimaryButton>
      <PrimaryButton onClick={handleDelete}>Delete</PrimaryButton>
      <PrimaryButton onClick={handleShowDialog}>Show Dialog</PrimaryButton>
    </div>
  );
}
```

#### Using Global API

```tsx
import React from 'react';
import { notify, confirm, dialog } from 'spfx-notifications-hub';
import { PrimaryButton } from '@fluentui/react';

function MyComponent() {
  const handleClick = () => {
    notify.success('Success!');
  };

  const handleConfirm = async () => {
    const result = await confirm({
      message: 'Are you sure?',
    });
    if (result) {
      notify.success('Confirmed!');
    }
  };

  return (
    <div>
      <PrimaryButton onClick={handleClick}>Click</PrimaryButton>
      <PrimaryButton onClick={handleConfirm}>Confirm</PrimaryButton>
    </div>
  );
}
```

### Class Components

#### Using Global API (Simplest) ⭐

**No HOC, no render props needed - just import and use!**

```tsx
import React from 'react';
import { notify, confirm, dialog } from 'spfx-notifications-hub';
import { PrimaryButton, DefaultButton } from '@fluentui/react';

class MyComponent extends React.Component {
  private dialogId: string | null = null;

  handleSuccess = () => {
    notify.success('Operation completed!', {
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

  handleShowDialog = () => {
    this.dialogId = dialog.show({
      title: 'My Dialog',
      content: (
        <div>
          <p>This is dialog content from class component!</p>
        </div>
      ),
      size: 'medium',
      footer: (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <DefaultButton
            onClick={() => {
              if (this.dialogId) {
                dialog.hide(this.dialogId);
                this.dialogId = null;
                notify.info('Dialog closed');
              }
            }}
          >
            Close
          </DefaultButton>
        </div>
      ),
    });
  };

  render() {
    return (
      <div>
        <PrimaryButton onClick={this.handleSuccess}>Success</PrimaryButton>
        <PrimaryButton onClick={this.handleWarning}>Warning</PrimaryButton>
        <PrimaryButton onClick={this.handleError}>Error</PrimaryButton>
        <PrimaryButton onClick={this.handleConfirm}>Confirm</PrimaryButton>
        <PrimaryButton onClick={this.handleShowDialog}>Show Dialog</PrimaryButton>
      </div>
    );
  }
}

export default MyComponent;
```

#### Using HOC (Higher Order Component)

**When you need better type safety:**

```tsx
import React from 'react';
import { withNotifications, WithNotificationsProps } from 'spfx-notifications-hub';
import { PrimaryButton } from '@fluentui/react';

interface MyComponentProps {
  title?: string;
}

class MyComponent extends React.Component<MyComponentProps & WithNotificationsProps> {
  private dialogId: string | null = null;

  handleSuccess = () => {
    this.props.notify.success('Success!');
  };

  handleDialog = () => {
    this.dialogId = this.props.dialog.show({
      title: 'Dialog',
      content: <p>Dialog content</p>,
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

export default withNotifications(MyComponent);
```

#### Using Render Props

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
                const result = await confirm({ message: 'Are you sure?' });
                if (result) notify.success('Confirmed!');
              }}
            >
              Confirm
            </PrimaryButton>
          </div>
        )}
      </NotificationsConsumer>
    );
  }
}

export default MyComponent;
```

## 📚 API Reference

### Global API (`notify`, `confirm`, `dialog`)

Works in both functional and class components:

```tsx
import { notify, confirm, dialog } from 'spfx-notifications-hub';

// Toast notifications
notify.success(message: string, options?: {
  title?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
});

notify.warning(message: string, options?);
notify.error(message: string, options?);
notify.info(message: string, options?);

// Confirm dialog
const result: Promise<boolean> = await confirm({
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
});

// Dialog
const dialogId: string = dialog.show({
  title?: string;
  content: React.ReactNode; // Required
  footer?: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  closeOnOutsideClick?: boolean; // Default: true
  closeOnEscape?: boolean; // Default: true
  modalType?: 'modal' | 'non-modal' | 'alert';
  backdrop?: 'none' | 'opaque' | 'transparent';
  className?: string;
});

dialog.hide(dialogId: string);
```

### Hooks API (Functional Components only)

```tsx
import { useNotify, useConfirm, useDialog } from 'spfx-notifications-hub';

function MyComponent() {
  const notify = useNotify();
  const confirm = useConfirm();
  const dialog = useDialog();
  
  // Use notify.success(), confirm(), dialog.show(), etc.
}
```

### HOC API (Class Components)

```tsx
import { withNotifications, WithNotificationsProps } from 'spfx-notifications-hub';

interface MyProps extends WithNotificationsProps {
  // Your custom props
}

class MyComponent extends React.Component<MyProps> {
  // Access via this.props.notify, this.props.confirm, this.props.dialog
}

export default withNotifications(MyComponent);
```

## 🎨 Toast Features

### Auto-dismiss with Progress Bar

Toasts automatically dismiss after the specified duration with a visual progress bar:

```tsx
notify.success('This will auto-dismiss in 5 seconds', {
  duration: 5000, // Auto-dismiss after 5 seconds
});
```

### Action Button

Add an action button to toasts:

```tsx
notify.success('Item deleted', {
  action: {
    label: 'Undo',
    onClick: () => {
      // Undo logic
    },
  },
});
```

### Pause on Hover

Progress bar automatically pauses when you hover over the toast.

## 💬 Dialog Examples

### Basic Dialog

```tsx
const dialogId = dialog.show({
  title: 'My Dialog',
  content: <div>Content here</div>,
  size: 'medium',
});
```

### Dialog with Footer

```tsx
const dialogId = dialog.show({
  title: 'Confirm Action',
  content: <p>Are you sure?</p>,
  footer: (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
      <DefaultButton onClick={() => dialog.hide(dialogId)}>Cancel</DefaultButton>
      <PrimaryButton onClick={() => {
        // Save logic
        dialog.hide(dialogId);
      }}>Save</PrimaryButton>
    </div>
  ),
});
```

### Blocking Dialog

```tsx
const dialogId = dialog.show({
  title: 'Blocking Dialog',
  content: <p>Must use close button</p>,
  closeOnOutsideClick: false, // Cannot close by clicking outside
  footer: <PrimaryButton onClick={() => dialog.hide(dialogId)}>Close</PrimaryButton>,
});
```

### Form in Dialog (Class Component Example)

```tsx
class UserForm extends React.Component {
  state = { name: '', email: '' };
  private dialogId: string | null = null;

  handleOpenForm = () => {
    this.dialogId = dialog.show({
      title: 'Add New User',
      content: (
        <div style={{ padding: '16px 0' }}>
          <TextField
            label="Name"
            value={this.state.name}
            onChange={(e, newValue) => this.setState({ name: newValue || '' })}
          />
          <TextField
            label="Email"
            value={this.state.email}
            onChange={(e, newValue) => this.setState({ email: newValue || '' })}
          />
        </div>
      ),
      size: 'medium',
      footer: (
        <PrimaryButton
          onClick={() => {
            if (this.dialogId) {
              // Save logic
              dialog.hide(this.dialogId);
              this.dialogId = null;
              notify.success('User saved!');
            }
          }}
        >
          Save
        </PrimaryButton>
      ),
    });
  };

  render() {
    return <PrimaryButton onClick={this.handleOpenForm}>Add User</PrimaryButton>;
  }
}
```

## 🔧 NotificationsProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultDuration` | `number` | `5000` | Auto dismiss duration (ms), `0` = no auto dismiss |
| `loggingConfig` | `LoggingConfig` | - | Optional logging configuration |

### LoggingConfig

```tsx
{
  enabled?: boolean;
  endpoint?: string; // API endpoint for logging
  logLevel?: 'error' | 'warning' | 'info' | 'all';
  onLog?: (notification: Notification) => void | Promise<void>;
}
```

## 🎨 Styling

The library uses Fluent UI v8 and can be customized through CSS variables:

```css
--colorNeutralBackground1
--colorNeutralForeground1
--colorBrandForeground1
```

All class names are prefixed with `hh-` to avoid conflicts:
- `.hh-notifications-toast`
- `.hh-notifications-toast-container`
- `.hh-dialog-*`

## 📝 Comparison: Functional vs Class Components

| Feature | Functional Component | Class Component |
|---------|---------------------|-----------------|
| **Hooks** | ✅ `useNotify()`, `useConfirm()`, `useDialog()` | ❌ Not available |
| **Global API** | ✅ `notify`, `confirm`, `dialog` | ✅ `notify`, `confirm`, `dialog` |
| **HOC** | ❌ Not needed | ✅ `withNotifications()` |
| **Render Props** | ❌ Not needed | ✅ `NotificationsConsumer` |
| **Type Safety** | ✅ Full TypeScript support | ✅ Full TypeScript support |

**Recommendation:**
- **Functional Components**: Use hooks (`useNotify`, `useConfirm`, `useDialog`)
- **Class Components**: Use global API (`notify`, `confirm`, `dialog`)

## 🏗️ Build as Library

To build as a library for other projects:

```bash
npm run build
```

Output will be in the `dist/` directory.

## 📄 License

MIT

## 📚 Additional Documentation

- [Class Component Usage Guide](./CLASS_COMPONENT_USAGE.md) - Detailed guide for class components
- [Dialog in Class Components](./DIALOG_IN_CLASS_COMPONENT.md) - Dialog usage examples for class components
