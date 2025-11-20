import React from 'react';
import { initializeIcons } from '@fluentui/react';
import { NotificationsProvider } from '../notifications/context';
import { TodoApp } from './TodoApp';

// Initialize Fluent UI icons
initializeIcons();

export const App: React.FC = () => {
  return (
    <NotificationsProvider
      defaultDuration={5000}
      loggingConfig={{
        enabled: true,
        logLevel: 'all',
        onLog: async (notification) => {
          // Demo: Log to console (can be replaced with API call)
          console.log('[Notification Log]', {
            type: notification.type,
            message: notification.message,
            title: notification.title,
            timestamp: new Date().toISOString(),
          });
        },
      }}
    >
      <TodoApp />
    </NotificationsProvider>
  );
};

