import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Notification, ResolvedToastPlacement, ToastContainerRef } from '../../core/types';
import { Toast } from '../Toast/Toast';
import './ToastContainer.css';

interface ToastContainerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
  defaultDuration?: number;
  placement: ResolvedToastPlacement;
}

const resolveContainerElement = (ref?: ToastContainerRef): HTMLElement | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!ref) {
    return null;
  }

  if (typeof ref === 'string') {
    return document.querySelector(ref);
  }

  if (typeof ref === 'function') {
    try {
      return ref() ?? null;
    } catch {
      return null;
    }
  }

  if (ref instanceof HTMLElement) {
    return ref;
  }

  return null;
};

export const ToastContainer: React.FC<ToastContainerProps> = ({
  notifications,
  onRemove,
  defaultDuration,
  placement,
}) => {
  const fallbackTarget = typeof document !== 'undefined' ? document.body : null;

  const resolvedTarget = useMemo(() => {
    const containerEl = resolveContainerElement(placement.container);
    return containerEl ?? fallbackTarget;
  }, [placement, fallbackTarget]);

  if (!resolvedTarget) {
    return null;
  }

  const isInline =
    Boolean(placement.isInline && placement.container && resolvedTarget !== fallbackTarget);

  const classes = [
    'hh-notifications-toast-container',
    `hh-toast-pos-${placement.position}`,
    isInline ? 'hh-notifications-toast-container-inline' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <div className={classes}>
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

  return createPortal(content, resolvedTarget);
};

