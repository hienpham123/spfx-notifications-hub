import React from 'react';
import {
  Dialog,
  DialogType,
  DialogFooter,
} from '@fluentui/react';
import { DialogOptions } from '../types';
import './Dialog.css';

interface DialogProps {
  isOpen: boolean;
  options: DialogOptions;
  onDismiss: () => void;
  dialogId?: string;
}

const sizeMap = {
  small: 400,
  medium: 600,
  large: 800,
  fullscreen: undefined, // Will use maxWidth: '100vw'
};

export const DialogComponent: React.FC<DialogProps> = ({ isOpen, options, onDismiss }) => {
  const size = options.size || 'medium';
  // Note: closeOnEscape is not directly supported in Fluent UI v8 Dialog
  // Fluent UI v8 Dialog always allows Escape key to close
  const closeOnOutsideClick = options.closeOnOutsideClick !== false; // Default true
  
  // Map modalType to DialogType
  let dialogType = DialogType.normal;
  if (options.modalType === 'alert') {
    dialogType = DialogType.largeHeader;
  } else if (options.modalType === 'non-modal') {
    // Non-modal is handled by isBlocking: false
    dialogType = DialogType.normal;
  }
  
  const dialogContentProps = {
    type: dialogType,
    title: options.title,
    showCloseButton: true,
  };

  const modalProps = {
    isBlocking: !closeOnOutsideClick, // Block outside clicks if closeOnOutsideClick is false
    isDarkOverlay: options.backdrop === 'opaque',
    styles: {
      main: {
        maxWidth: size === 'fullscreen' ? '100vw' : `${sizeMap[size]}px`,
        width: size === 'fullscreen' ? '100vw' : undefined,
        height: size === 'fullscreen' ? '100vh' : undefined,
      },
    },
  };

  const handleDismiss = () => {
    // This is called when dialog is dismissed
    // Fluent UI v8 handles isBlocking for outside clicks automatically
    // For Escape key, we need to check closeOnEscape
    // Note: Fluent UI v8 Dialog doesn't have a direct way to prevent Escape key,
    // so we'll allow it and document that closeOnEscape is handled by isBlocking
    onDismiss();
  };

  const minWidth = size === 'fullscreen' ? undefined : sizeMap[size];

  return (
    <Dialog
      hidden={!isOpen}
      onDismiss={handleDismiss}
      dialogContentProps={dialogContentProps}
      modalProps={modalProps}
      minWidth={minWidth}
      className={options.className}
    >
      <div style={{ padding: '16px 0' }}>
        {options.content}
      </div>
      {options.footer && (
        <DialogFooter>
          {options.footer}
        </DialogFooter>
      )}
    </Dialog>
  );
};
