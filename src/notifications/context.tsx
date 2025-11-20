import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Notification, ConfirmOptions, DialogOptions, LoggingConfig } from './types';
import { ConfirmDialog } from './components/ConfirmDialog';
import { DialogComponent } from './components/Dialog';
import { ToastContainer } from './components/ToastContainer';
import { logNotification } from './utils/logging';

// Global context setter (to avoid circular dependency)
let globalNotificationsContext: NotificationsContextValue | null = null;
export const setGlobalNotificationsContext = (context: NotificationsContextValue | null) => {
  globalNotificationsContext = context;
};
export const getGlobalNotificationsContext = () => globalNotificationsContext;

export interface NotificationsContextValue {
  notifications: Notification[];
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  dialog: {
    show: (options: DialogOptions) => string;
    hide: (id: string) => void;
  };
  loggingConfig?: LoggingConfig;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

interface NotificationsProviderProps {
  children: ReactNode;
  loggingConfig?: LoggingConfig;
  defaultDuration?: number;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({
  children,
  loggingConfig,
  defaultDuration = 5000,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);
  const [dialogs, setDialogs] = useState<Map<string, DialogOptions>>(new Map());

  const showNotification = useCallback(
    (notification: Omit<Notification, 'id'>) => {
      const id = `notification-${Date.now()}-${Math.random()}`;
      const newNotification: Notification = {
        ...notification,
        id,
        duration: notification.duration ?? defaultDuration,
      };

      setNotifications((prev) => [...prev, newNotification]);

      // Auto dismiss
      if (newNotification.duration && newNotification.duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, newNotification.duration);
      }

      // Logging
      if (loggingConfig?.enabled) {
        logNotification(newNotification, loggingConfig);
      }
    },
    [defaultDuration, loggingConfig]
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const confirm = useCallback(
    (options: ConfirmOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setConfirmState({
          isOpen: true,
          options,
          resolve,
        });
      });
    },
    []
  );

  const handleConfirmClose = useCallback((result: boolean) => {
    if (confirmState) {
      confirmState.resolve(result);
      setConfirmState(null);
    }
  }, [confirmState]);

  const showDialog = useCallback((options: DialogOptions): string => {
    const id = `dialog-${Date.now()}-${Math.random()}`;
    setDialogs((prev) => new Map(prev).set(id, options));
    return id;
  }, []);

  const hideDialog = useCallback((id: string) => {
    setDialogs((prev) => {
      const newMap = new Map(prev);
      const dialog = newMap.get(id);
      if (dialog?.onDismiss) {
        dialog.onDismiss();
      }
      newMap.delete(id);
      return newMap;
    });
  }, []);

  const value: NotificationsContextValue = {
    notifications,
    showNotification,
    removeNotification,
    confirm,
    dialog: {
      show: showDialog,
      hide: hideDialog,
    },
    loggingConfig,
  };

  // Set global context for notify API
  useEffect(() => {
    setGlobalNotificationsContext(value);
    return () => {
      setGlobalNotificationsContext(null);
    };
  }, [value]);

  return (
    <NotificationsContext.Provider value={value}>
      {children}
      <ToastContainer 
        notifications={notifications} 
        onRemove={removeNotification}
        defaultDuration={defaultDuration}
      />
      {confirmState && (
        <ConfirmDialog
          isOpen={confirmState.isOpen}
          options={confirmState.options}
          onConfirm={() => handleConfirmClose(true)}
          onCancel={() => handleConfirmClose(false)}
        />
      )}
      {Array.from(dialogs.entries()).map(([id, options]: [string, DialogOptions]) => (
        <DialogComponent
          key={id}
          isOpen={true}
          options={options}
          onDismiss={() => hideDialog(id)}
          dialogId={id}
        />
      ))}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = (): NotificationsContextValue => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationsProvider');
  }
  return context;
};

