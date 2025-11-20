import React, { useEffect, useState } from 'react';
import { Notification } from '../types';
import { Icon } from '@fluentui/react';
import './Toast.css';

interface ToastProps {
  notification: Notification;
  onDismiss: () => void;
  defaultDuration?: number;
}

const iconMap = {
  success: 'Completed',
  warning: 'Warning',
  error: 'ErrorBadge',
  info: 'Info',
};

const colorMap = {
  success: '#107c10',
  warning: '#ffaa44',
  error: '#d13438',
  info: '#0078d4',
};

export const Toast: React.FC<ToastProps> = ({ notification, onDismiss, defaultDuration = 5000 }) => {
  const iconName = iconMap[notification.type];
  const color = colorMap[notification.type];
  const duration = notification.duration ?? defaultDuration;
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (duration > 0 && !isPaused) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, isPaused, onDismiss]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <div 
      className="hh-notifications-toast" 
      style={{ borderLeftColor: color }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="hh-notifications-toast-content">
        {iconName && (
          <div className="hh-notifications-toast-icon" style={{ color }}>
            <Icon iconName={iconName} />
          </div>
        )}
        <div className="hh-notifications-toast-body">
          {notification.title && (
            <div className="hh-notifications-toast-title">{notification.title}</div>
          )}
          <div className="hh-notifications-toast-message">{notification.message}</div>
          {notification.action && (
            <div className="hh-notifications-toast-action">
              <button
                onClick={() => {
                  notification.action?.onClick();
                  onDismiss();
                }}
                className="hh-notifications-toast-action-button"
              >
                {notification.action.label}
              </button>
            </div>
          )}
        </div>
        <button
          onClick={onDismiss}
          className="hh-notifications-toast-dismiss"
          aria-label="Dismiss"
        >
          <Icon iconName="Cancel" />
        </button>
      </div>
      {duration > 0 && (
        <div className="hh-notifications-toast-progress-container">
          <div 
            className={`hh-notifications-toast-progress ${isPaused ? 'hh-paused' : ''}`}
            style={{ 
              backgroundColor: color,
              animationDuration: `${duration}ms`
            }}
          />
        </div>
      )}
    </div>
  );
};

