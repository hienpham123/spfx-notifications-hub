import React from 'react';
import { Notification } from '../types';
import { Toast } from './Toast';
import './ToastContainer.css';

interface ToastContainerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
  defaultDuration?: number;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  notifications,
  onRemove,
  defaultDuration,
}) => {
  return (
    <div className="hh-notifications-toast-container">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onDismiss={() => onRemove(notification.id)}
          defaultDuration={defaultDuration}
        />
      ))}
    </div>
  );
};

