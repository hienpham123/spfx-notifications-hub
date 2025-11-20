import React from 'react';
import { PrimaryButton } from '@fluentui/react';
import { withNotifications, WithNotificationsProps, NotificationsConsumer } from '../notifications/hoc';
import { notify, confirm, dialog } from './notify-api';

// Example 1: Using HOC (Higher Order Component)
interface MyComponentHOCProps {
  title: string;
}

class MyComponentWithHOC extends React.Component<MyComponentHOCProps & WithNotificationsProps> {
  handleSuccess = () => {
    this.props.notify.success('Operation completed successfully!', { title: 'Success' });
  };

  handleWarning = () => {
    this.props.notify.warning('Please check your input', { title: 'Warning' });
  };

  handleError = () => {
    this.props.notify.error('Something went wrong!', { title: 'Error' });
  };

  handleConfirm = async () => {
    const result = await this.props.confirm({
      title: 'Confirm Action',
      message: 'Are you sure you want to proceed?',
      confirmText: 'Yes',
      cancelText: 'No',
    });

    if (result) {
      this.props.notify.success('You confirmed!');
    } else {
      this.props.notify.info('You cancelled');
    }
  };

  handleDialog = () => {
    const dialogId = this.props.dialog.show({
      title: 'Dialog from Class Component',
      content: <p>This dialog was opened from a class component using HOC.</p>,
      size: 'medium',
    });

    setTimeout(() => {
      this.props.dialog.hide(dialogId);
    }, 3000);
  };

  render() {
    return (
      <div style={{ padding: '20px', border: '1px solid #e1dfdd', borderRadius: '4px', marginBottom: '20px' }}>
        <h3>{this.props.title}</h3>
        <p>This is a class component using HOC (Higher Order Component)</p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
          <PrimaryButton onClick={this.handleSuccess}>Success Toast</PrimaryButton>
          <PrimaryButton onClick={this.handleWarning}>Warning Toast</PrimaryButton>
          <PrimaryButton onClick={this.handleError}>Error Toast</PrimaryButton>
          <PrimaryButton onClick={this.handleConfirm}>Confirm Dialog</PrimaryButton>
          <PrimaryButton onClick={this.handleDialog}>Show Dialog</PrimaryButton>
        </div>
      </div>
    );
  }
}

// Export component wrapped with HOC
export const MyComponentHOC = withNotifications(MyComponentWithHOC);

// Example 2: Using Render Props (NotificationsConsumer)
export class MyComponentWithRenderProps extends React.Component {
  render() {
    return (
      <NotificationsConsumer>
        {({ notify, confirm, dialog }) => (
          <div style={{ padding: '20px', border: '1px solid #e1dfdd', borderRadius: '4px', marginBottom: '20px' }}>
            <h3>Class Component with Render Props</h3>
            <p>This is a class component using Render Props pattern</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
              <PrimaryButton onClick={() => notify.success('Success from render props!')}>
                Success Toast
              </PrimaryButton>
              <PrimaryButton onClick={() => notify.warning('Warning from render props!')}>
                Warning Toast
              </PrimaryButton>
              <PrimaryButton
                onClick={async () => {
                  const result = await confirm({
                    title: 'Confirm',
                    message: 'Are you sure?',
                  });
                  if (result) {
                    notify.success('Confirmed!');
                  }
                }}
              >
                Confirm Dialog
              </PrimaryButton>
              <PrimaryButton
                onClick={() => {
                  const id = dialog.show({
                    title: 'Dialog',
                    content: <p>Dialog from render props</p>,
                  });
                  setTimeout(() => dialog.hide(id), 3000);
                }}
              >
                Show Dialog
              </PrimaryButton>
            </div>
          </div>
        )}
      </NotificationsConsumer>
    );
  }
}

// Example 3: Using Global API (no context needed, but requires NotificationsProvider in parent)
export class MyComponentWithGlobalAPI extends React.Component {
  private dialogId: string | null = null;

  handleSuccess = () => {
    notify.success('Success using global API!', { title: 'Global API' });
  };

  handleConfirm = async () => {
    const result = await confirm({
      title: 'Confirm',
      message: 'Using global API',
    });
    if (result) {
      notify.success('Confirmed!');
    }
  };

  handleShowDialog = () => {
    this.dialogId = dialog.show({
      title: 'Dialog from Global API',
      content: (
        <div>
          <p>This dialog is opened using the global API!</p>
          <p>You can use dialog.show() and dialog.hide() directly in class components.</p>
        </div>
      ),
      size: 'medium',
      footer: (
        <PrimaryButton
          onClick={() => {
            if (this.dialogId) {
              dialog.hide(this.dialogId);
              this.dialogId = null;
              notify.info('Dialog closed');
            }
          }}
        >
          Close
        </PrimaryButton>
      ),
    });
  };

  render() {
    return (
      <div style={{ padding: '20px', border: '1px solid #e1dfdd', borderRadius: '4px' }}>
        <h3>Class Component with Global API</h3>
        <p>This component uses the global API (notify, confirm, dialog) - no HOC or render props needed!</p>
        <p style={{ color: '#605e5c', fontSize: '12px' }}>
          Note: Still requires NotificationsProvider in parent component tree
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
          <PrimaryButton onClick={this.handleSuccess}>Success Toast</PrimaryButton>
          <PrimaryButton onClick={this.handleConfirm}>Confirm Dialog</PrimaryButton>
          <PrimaryButton onClick={this.handleShowDialog}>Show Dialog</PrimaryButton>
        </div>
      </div>
    );
  }
}

