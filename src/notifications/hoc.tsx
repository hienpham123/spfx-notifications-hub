import React, { ComponentType } from 'react';
import { NotificationsContextValue, useNotifications } from './context';

/**
 * HOC (Higher Order Component) to inject notifications into class components
 * 
 * @example
 * ```tsx
 * class MyComponent extends React.Component<Props & WithNotificationsProps> {
 *   handleClick = () => {
 *     this.props.notify.success('Task completed!');
 *   }
 * 
 *   render() {
 *     return <button onClick={this.handleClick}>Click me</button>;
 *   }
 * }
 * 
 * export default withNotifications(MyComponent);
 * ```
 */
export interface WithNotificationsProps {
  notify: {
    success: (message: string, options?: { title?: string; duration?: number; action?: { label: string; onClick: () => void } }) => void;
    warning: (message: string, options?: { title?: string; duration?: number; action?: { label: string; onClick: () => void } }) => void;
    error: (message: string, options?: { title?: string; duration?: number; action?: { label: string; onClick: () => void } }) => void;
    info: (message: string, options?: { title?: string; duration?: number; action?: { label: string; onClick: () => void } }) => void;
  };
  confirm: (options: { title?: string; message: string; confirmText?: string; cancelText?: string }) => Promise<boolean>;
  dialog: {
    show: (options: { title?: string; content: React.ReactNode; footer?: React.ReactNode; size?: 'small' | 'medium' | 'large' | 'fullscreen' }) => string;
    hide: (id: string) => void;
  };
}

export function withNotifications<P extends object>(
  Component: ComponentType<P & WithNotificationsProps>
): ComponentType<P> {
  const WrappedComponent = (props: P) => {
    const context = useNotifications();
    
    const notify = {
      success: (message: string, options?: { title?: string; duration?: number; action?: { label: string; onClick: () => void } }) => {
        context.showNotification({
          type: 'success',
          message,
          ...options,
        });
      },
      warning: (message: string, options?: { title?: string; duration?: number; action?: { label: string; onClick: () => void } }) => {
        context.showNotification({
          type: 'warning',
          message,
          ...options,
        });
      },
      error: (message: string, options?: { title?: string; duration?: number; action?: { label: string; onClick: () => void } }) => {
        context.showNotification({
          type: 'error',
          message,
          ...options,
        });
      },
      info: (message: string, options?: { title?: string; duration?: number; action?: { label: string; onClick: () => void } }) => {
        context.showNotification({
          type: 'info',
          message,
          ...options,
        });
      },
    };

    return (
      <Component
        {...props}
        notify={notify}
        confirm={context.confirm}
        dialog={context.dialog}
      />
    );
  };

  WrappedComponent.displayName = `withNotifications(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}

/**
 * Render Props component for class components
 * 
 * @example
 * ```tsx
 * class MyComponent extends React.Component {
 *   render() {
 *     return (
 *       <NotificationsConsumer>
 *         {({ notify, confirm, dialog }) => (
 *           <button onClick={() => notify.success('Hello!')}>
 *             Click me
 *           </button>
 *         )}
 *       </NotificationsConsumer>
 *     );
 *   }
 * }
 * ```
 */
interface NotificationsConsumerProps {
  children: (value: WithNotificationsProps) => React.ReactNode;
}

export const NotificationsConsumer: React.FC<NotificationsConsumerProps> = ({ children }) => {
  const context = useNotifications();
  
  const notify = {
    success: (message: string, options?: { title?: string; duration?: number; action?: { label: string; onClick: () => void } }) => {
      context.showNotification({
        type: 'success',
        message,
        ...options,
      });
    },
    warning: (message: string, options?: { title?: string; duration?: number; action?: { label: string; onClick: () => void } }) => {
      context.showNotification({
        type: 'warning',
        message,
        ...options,
      });
    },
    error: (message: string, options?: { title?: string; duration?: number; action?: { label: string; onClick: () => void } }) => {
      context.showNotification({
        type: 'error',
        message,
        ...options,
      });
    },
    info: (message: string, options?: { title?: string; duration?: number; action?: { label: string; onClick: () => void } }) => {
      context.showNotification({
        type: 'info',
        message,
        ...options,
      });
    },
  };

  return <>{children({ notify, confirm: context.confirm, dialog: context.dialog })}</>;
};

