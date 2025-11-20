import { Notification, LoggingConfig } from '../types';

export async function logNotification(
  notification: Notification,
  config: LoggingConfig
): Promise<void> {
  if (!config.enabled) return;

  const shouldLog =
    config.logLevel === 'all' ||
    (config.logLevel === 'error' && notification.type === 'error') ||
    (config.logLevel === 'warning' && ['error', 'warning'].indexOf(notification.type) !== -1) ||
    (config.logLevel === 'info' && ['error', 'warning', 'info'].indexOf(notification.type) !== -1);

  if (!shouldLog) return;

  // Custom logging function
  if (config.onLog) {
    try {
      await config.onLog(notification);
    } catch (error) {
      console.error('Error in custom logging function:', error);
    }
  }

  // Server endpoint logging
  if (config.endpoint) {
    try {
      await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: notification.type,
          message: notification.message,
          title: notification.title,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error logging to server:', error);
    }
  }
}

