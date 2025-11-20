# Sử dụng Dialog trong Class Component

Hướng dẫn cách sử dụng Dialog trực tiếp trong Class Component mà không cần HOC hay Render Props.

## Cách 1: Sử dụng Global API (Đơn giản nhất) ⭐

**Chỉ cần import `dialog` và dùng trực tiếp!**

```tsx
import React from 'react';
import { dialog, notify } from 'spfx-notifications-hub';
import { PrimaryButton, DefaultButton } from '@fluentui/react';

class MyComponent extends React.Component {
  // Lưu dialog ID để có thể đóng sau
  private dialogId: string | null = null;

  handleShowDialog = () => {
    // Mở dialog và lưu ID
    this.dialogId = dialog.show({
      title: 'My Dialog',
      content: (
        <div>
          <p>This is dialog content from class component!</p>
          <p>You can put any React component here.</p>
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
          <PrimaryButton
            onClick={() => {
              if (this.dialogId) {
                dialog.hide(this.dialogId);
                this.dialogId = null;
                notify.success('Action completed!');
              }
            }}
          >
            Save
          </PrimaryButton>
        </div>
      ),
    });
  };

  handleShowBlockingDialog = () => {
    this.dialogId = dialog.show({
      title: 'Blocking Dialog',
      content: <p>This dialog cannot be closed by clicking outside.</p>,
      closeOnOutsideClick: false,
      size: 'medium',
      footer: (
        <PrimaryButton
          onClick={() => {
            if (this.dialogId) {
              dialog.hide(this.dialogId);
              this.dialogId = null;
            }
          }}
        >
          Close
        </PrimaryButton>
      ),
    });
  };

  handleShowLargeDialog = () => {
    this.dialogId = dialog.show({
      title: 'Large Dialog',
      content: (
        <div>
          <p>This is a large dialog (800px width)</p>
          <p>Perfect for forms or detailed content.</p>
        </div>
      ),
      size: 'large',
    });
  };

  render() {
    return (
      <div>
        <PrimaryButton onClick={this.handleShowDialog}>
          Show Dialog
        </PrimaryButton>
        <PrimaryButton onClick={this.handleShowBlockingDialog}>
          Show Blocking Dialog
        </PrimaryButton>
        <PrimaryButton onClick={this.handleShowLargeDialog}>
          Show Large Dialog
        </PrimaryButton>
      </div>
    );
  }
}

export default MyComponent;
```

## Cách 2: Sử dụng HOC (Khi cần type safety)

```tsx
import React from 'react';
import { withNotifications, WithNotificationsProps } from 'spfx-notifications-hub';
import { PrimaryButton } from '@fluentui/react';

interface MyComponentProps extends WithNotificationsProps {
  title?: string;
}

class MyComponent extends React.Component<MyComponentProps> {
  private dialogId: string | null = null;

  handleShowDialog = () => {
    this.dialogId = this.props.dialog.show({
      title: 'Dialog from HOC',
      content: <p>Dialog content</p>,
      size: 'medium',
    });
  };

  handleCloseDialog = () => {
    if (this.dialogId) {
      this.props.dialog.hide(this.dialogId);
      this.dialogId = null;
    }
  };

  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <PrimaryButton onClick={this.handleShowDialog}>
          Show Dialog
        </PrimaryButton>
        <PrimaryButton onClick={this.handleCloseDialog}>
          Close Dialog
        </PrimaryButton>
      </div>
    );
  }
}

export default withNotifications(MyComponent);
```

## Cách 3: Sử dụng Render Props

```tsx
import React from 'react';
import { NotificationsConsumer } from 'spfx-notifications-hub';
import { PrimaryButton } from '@fluentui/react';

class MyComponent extends React.Component {
  render() {
    return (
      <NotificationsConsumer>
        {({ dialog, notify }) => {
          let dialogId: string | null = null;

          return (
            <div>
              <PrimaryButton
                onClick={() => {
                  dialogId = dialog.show({
                    title: 'Dialog',
                    content: <p>Dialog content</p>,
                    footer: (
                      <PrimaryButton
                        onClick={() => {
                          if (dialogId) {
                            dialog.hide(dialogId);
                            notify.info('Dialog closed');
                          }
                        }}
                      >
                        Close
                      </PrimaryButton>
                    ),
                  });
                }}
              >
                Show Dialog
              </PrimaryButton>
            </div>
          );
        }}
      </NotificationsConsumer>
    );
  }
}

export default MyComponent;
```

## Ví dụ đầy đủ với Form trong Dialog

```tsx
import React from 'react';
import { dialog, notify, confirm } from 'spfx-notifications-hub';
import { PrimaryButton, TextField } from '@fluentui/react';

interface FormData {
  name: string;
  email: string;
}

class UserForm extends React.Component {
  state: FormData = {
    name: '',
    email: '',
  };

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
            styles={{ root: { marginBottom: '16px' } }}
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
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <DefaultButton
            onClick={() => {
              if (this.dialogId) {
                dialog.hide(this.dialogId);
                this.dialogId = null;
                this.setState({ name: '', email: '' });
              }
            }}
          >
            Cancel
          </DefaultButton>
          <PrimaryButton
            onClick={async () => {
              if (!this.state.name || !this.state.email) {
                notify.warning('Please fill in all fields');
                return;
              }

              const result = await confirm({
                title: 'Confirm',
                message: `Create user "${this.state.name}"?`,
              });

              if (result) {
                // Save logic here
                notify.success('User created successfully!');
                if (this.dialogId) {
                  dialog.hide(this.dialogId);
                  this.dialogId = null;
                  this.setState({ name: '', email: '' });
                }
              }
            }}
          >
            Save
          </PrimaryButton>
        </div>
      ),
    });
  };

  render() {
    return (
      <div>
        <PrimaryButton onClick={this.handleOpenForm}>
          Add New User
        </PrimaryButton>
      </div>
    );
  }
}

export default UserForm;
```

## API Reference

### dialog.show()

```tsx
const dialogId: string = dialog.show({
  // Required
  content: React.ReactNode,
  
  // Optional
  title?: string;
  footer?: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  onDismiss?: () => void;
  
  // Fluent UI props
  modalType?: 'modal' | 'non-modal' | 'alert';
  backdrop?: 'none' | 'opaque' | 'transparent';
  
  // Behavior
  closeOnOutsideClick?: boolean; // Default: true
  closeOnEscape?: boolean; // Default: true
  
  // Styling
  className?: string;
});
```

### dialog.hide()

```tsx
dialog.hide(dialogId: string): void;
```

## Lưu ý quan trọng

1. **Lưu Dialog ID**: Luôn lưu `dialogId` để có thể đóng dialog sau
2. **Cleanup**: Đặt `dialogId = null` sau khi đóng để tránh memory leak
3. **Provider Required**: Vẫn cần `NotificationsProvider` ở component cha
4. **Auto-close**: Dialog sẽ tự đóng khi click outside hoặc nhấn Escape (trừ khi set `closeOnOutsideClick: false`)

## So sánh các cách

| Cách | Ưu điểm | Nhược điểm |
|------|---------|------------|
| **Global API** | Đơn giản, không cần HOC | Không có type safety tốt |
| **HOC** | Type safety tốt, IntelliSense | Cần wrap component |
| **Render Props** | Linh hoạt | Code hơi dài |

**Khuyến nghị**: Dùng **Global API** cho hầu hết trường hợp, chỉ dùng HOC khi cần type safety tốt.

