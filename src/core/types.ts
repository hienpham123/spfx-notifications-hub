export type NotificationType = 'success' | 'warning' | 'error' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonAppearance?: 'primary' | 'secondary' | 'outline' | 'subtle' | 'transparent';
  cancelButtonAppearance?: 'primary' | 'secondary' | 'outline' | 'subtle' | 'transparent';
}

import { ReactNode } from 'react';

export interface DialogOptions {
  // Basic props
  title?: string;
  content: ReactNode;
  footer?: ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  onDismiss?: () => void;
  
  // Fluent UI Dialog props
  modalType?: 'modal' | 'non-modal' | 'alert';
  backdrop?: 'none' | 'opaque' | 'transparent';
  trapFocus?: boolean;
  inertTrapFocus?: boolean;
  
  // DialogSurface props
  className?: string;
  style?: React.CSSProperties;
  
  // Additional customization
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
}

export interface LoggingConfig {
  enabled?: boolean;
  endpoint?: string;
  logLevel?: 'error' | 'warning' | 'info' | 'all';
  onLog?: (notification: Notification) => void | Promise<void>;
}

export type ToastViewportPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'bottom-center';

export type ToastContainerRef = HTMLElement | null | (() => HTMLElement | null) | string;

export interface ToastPlacementTarget {
  position: ToastViewportPosition;
  container?: ToastContainerRef;
}

export type ToastPlacementInput = ToastPlacementTarget | ToastViewportPosition;

export interface ToastPlacementRule {
  maxWidth: number;
  target: ToastPlacementInput;
}

export interface ToastPlacementConfig {
  default: ToastPlacementInput;
  responsive?: ToastPlacementRule[];
}

export interface ResolvedToastPlacement extends ToastPlacementTarget {
  position: ToastViewportPosition;
  container?: ToastContainerRef;
  isInline: boolean;
}

