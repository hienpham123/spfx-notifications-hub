import { useNotifications } from './NotificationsProvider';

export const useNotify = () => {
  const { showNotification } = useNotifications();

  return {
    success: (message: string, options?: { title?: string; duration?: number; action?: { label: string; onClick: () => void } }) => {
      showNotification({
        type: 'success',
        message,
        ...options,
      });
    },
    warning: (message: string, options?: { title?: string; duration?: number; action?: { label: string; onClick: () => void } }) => {
      showNotification({
        type: 'warning',
        message,
        ...options,
      });
    },
    error: (message: string, options?: { title?: string; duration?: number; action?: { label: string; onClick: () => void } }) => {
      showNotification({
        type: 'error',
        message,
        ...options,
      });
    },
    info: (message: string, options?: { title?: string; duration?: number; action?: { label: string; onClick: () => void } }) => {
      showNotification({
        type: 'info',
        message,
        ...options,
      });
    },
  };
};

export const useConfirm = () => {
  const { confirm } = useNotifications();
  return confirm;
};

export const useDialog = () => {
  const { dialog } = useNotifications();
  return dialog;
};

