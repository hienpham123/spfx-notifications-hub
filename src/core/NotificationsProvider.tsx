import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import {
  Notification,
  ConfirmOptions,
  DialogOptions,
  LoggingConfig,
  ToastPlacementConfig,
  ToastPlacementInput,
  ResolvedToastPlacement,
  ToastPlacementTarget,
} from './types';
import { ConfirmDialog } from '../components/ConfirmDialog/ConfirmDialog';
import { DialogComponent } from '../components/Dialog/Dialog';
import { ToastContainer } from '../components/ToastContainer/ToastContainer';
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
  toastPlacement: ResolvedToastPlacement;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

interface NotificationsProviderProps {
  children: ReactNode;
  loggingConfig?: LoggingConfig;
  defaultDuration?: number;
  toastPlacement?: ToastPlacementConfig | ToastPlacementInput;
}

const DEFAULT_TOAST_PLACEMENT: ToastPlacementTarget = { position: 'top-right' };

const isPlacementConfig = (
  value?: ToastPlacementConfig | ToastPlacementInput
): value is ToastPlacementConfig => {
  return !!value && typeof value === 'object' && 'default' in value;
};

const normalizePlacementTarget = (input?: ToastPlacementInput): ToastPlacementTarget => {
  if (!input) {
    return DEFAULT_TOAST_PLACEMENT;
  }
  if (typeof input === 'string') {
    return { position: input };
  }
  return {
    position: input.position,
    container: input.container,
  };
};

const resolveToastPlacement = (
  config?: ToastPlacementConfig | ToastPlacementInput,
  width: number = typeof window !== 'undefined' ? window.innerWidth : Number.POSITIVE_INFINITY
): ResolvedToastPlacement => {
  if (isPlacementConfig(config)) {
    const sortedRules = [...(config.responsive ?? [])].sort((a, b) => a.maxWidth - b.maxWidth);
    const rule = sortedRules.find((r) => width <= r.maxWidth);
    const target = normalizePlacementTarget(rule ? rule.target : config.default);
    return { ...target, isInline: Boolean(target.container) };
  }

  const target = normalizePlacementTarget(config);
  return { ...target, isInline: Boolean(target.container) };
};

const hasResponsivePlacement = (config?: ToastPlacementConfig | ToastPlacementInput) => {
  return isPlacementConfig(config) && Array.isArray(config.responsive) && config.responsive.length > 0;
};

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({
  children,
  loggingConfig,
  defaultDuration = 5000,
  toastPlacement,
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

  const computePlacement = useCallback(() => resolveToastPlacement(toastPlacement), [toastPlacement]);

  const [currentPlacement, setCurrentPlacement] = useState<ResolvedToastPlacement>(() => computePlacement());

  useEffect(() => {
    setCurrentPlacement(computePlacement());
  }, [computePlacement]);

  useEffect(() => {
    if (typeof window === 'undefined' || !hasResponsivePlacement(toastPlacement)) {
      return;
    }
    const handleResize = () => {
      setCurrentPlacement(computePlacement());
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [computePlacement, toastPlacement]);

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
    toastPlacement: currentPlacement,
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
        placement={currentPlacement}
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

