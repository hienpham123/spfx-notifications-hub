import React, { useEffect } from 'react';
import { DialogOptions } from '../types';
import './Dialog.css';
import { SvgIcon } from './SvgIcon';

interface DialogProps {
  isOpen: boolean;
  options: DialogOptions;
  onDismiss: () => void;
  dialogId?: string;
}

const sizeClassMap: Record<NonNullable<DialogOptions['size']>, string> = {
  small: 'hh-dialog-small',
  medium: 'hh-dialog-medium',
  large: 'hh-dialog-large',
  fullscreen: 'hh-dialog-fullscreen',
};

export const DialogComponent: React.FC<DialogProps> = ({ isOpen, options, onDismiss }) => {
  const {
    title,
    content,
    footer,
    size = 'medium',
    backdrop = 'opaque',
    modalType = 'modal',
    closeOnEscape = true,
    closeOnOutsideClick = true,
    className,
    style,
  } = options;

  useEffect(() => {
    if (!isOpen || !closeOnEscape) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeOnEscape, onDismiss]);

  if (!isOpen) {
    return null;
  }

  const overlayClasses = [
    'hh-dialog-overlay',
    backdrop === 'transparent' ? 'hh-dialog-overlay-transparent' : '',
    backdrop === 'none' ? 'hh-dialog-overlay-none' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const dialogClasses = [
    'hh-dialog',
    sizeClassMap[size],
    modalType === 'alert' ? 'hh-dialog-alert' : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleOverlayClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (!closeOnOutsideClick) {
      event.stopPropagation();
      return;
    }

    if (event.target === event.currentTarget) {
      onDismiss();
    }
  };

  return (
    <div
      className={overlayClasses}
      role="presentation"
      onClick={handleOverlayClick}
      aria-hidden={modalType === 'non-modal'}
    >
      <div
        className={dialogClasses}
        role="dialog"
        aria-modal={modalType !== 'non-modal'}
        aria-labelledby={title ? 'hh-dialog-title' : undefined}
        style={style}
      >
        <div className="hh-dialog-header">
          {title && (
            <div id="hh-dialog-title" className="hh-dialog-title">
              {title}
            </div>
          )}
          <button className="hh-dialog-close" onClick={onDismiss} aria-label="Close dialog">
            <SvgIcon name="close" size={16} />
          </button>
        </div>
        <div className="hh-dialog-body">{content}</div>
        {footer && <div className="hh-dialog-footer">{footer}</div>}
      </div>
    </div>
  );
};
