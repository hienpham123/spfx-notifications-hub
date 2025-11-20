export { NotificationsProvider, useNotifications, setGlobalNotificationsContext } from './core/NotificationsProvider';
export { useNotify, useConfirm, useDialog } from './core/hooks';
export { withNotifications, NotificationsConsumer } from './core/hoc';
export type { WithNotificationsProps } from './core/hoc';
export type {
  Notification,
  NotificationType,
  ConfirmOptions,
  DialogOptions,
  LoggingConfig,
} from './core/types';

import { getGlobalNotificationsContext } from './core/NotificationsProvider';
import { ConfirmOptions } from './core/types';

// Global API for use outside React components
export const notify = {
  success: (message: string, options?: { title?: string; duration?: number; action?: { label: string; onClick: () => void } }) => {
    const context = getGlobalNotificationsContext();
    if (context) {
      context.showNotification({
        type: 'success',
        message,
        ...options,
      });
    } else {
      console.warn('NotificationsProvider not found. Make sure to wrap your app with NotificationsProvider.');
    }
  },
  warning: (message: string, options?: { title?: string; duration?: number; action?: { label: string; onClick: () => void } }) => {
    const context = getGlobalNotificationsContext();
    if (context) {
      context.showNotification({
        type: 'warning',
        message,
        ...options,
      });
    } else {
      console.warn('NotificationsProvider not found. Make sure to wrap your app with NotificationsProvider.');
    }
  },
  error: (message: string, options?: { title?: string; duration?: number; action?: { label: string; onClick: () => void } }) => {
    const context = getGlobalNotificationsContext();
    if (context) {
      context.showNotification({
        type: 'error',
        message,
        ...options,
      });
    } else {
      console.warn('NotificationsProvider not found. Make sure to wrap your app with NotificationsProvider.');
    }
  },
  info: (message: string, options?: { title?: string; duration?: number; action?: { label: string; onClick: () => void } }) => {
    const context = getGlobalNotificationsContext();
    if (context) {
      context.showNotification({
        type: 'info',
        message,
        ...options,
      });
    } else {
      console.warn('NotificationsProvider not found. Make sure to wrap your app with NotificationsProvider.');
    }
  },
};

export const confirm = (options: ConfirmOptions): Promise<boolean> => {
  const context = getGlobalNotificationsContext();
  if (context) {
    return context.confirm(options);
  } else {
    console.warn('NotificationsProvider not found. Make sure to wrap your app with NotificationsProvider.');
    return Promise.resolve(false);
  }
};

// Global Dialog API for use outside React components
import { DialogOptions } from './core/types';

export const dialog = {
  show: (options: DialogOptions): string => {
    const context = getGlobalNotificationsContext();
    if (context) {
      return context.dialog.show(options);
    } else {
      console.warn('NotificationsProvider not found. Make sure to wrap your app with NotificationsProvider.');
      return '';
    }
  },
  hide: (id: string): void => {
    const context = getGlobalNotificationsContext();
    if (context) {
      context.dialog.hide(id);
    } else {
      console.warn('NotificationsProvider not found. Make sure to wrap your app with NotificationsProvider.');
    }
  },
};

// Import styles
import './styles.css';

