import React from 'react';
import { ConfirmOptions } from '../types';
import './Dialog.css';
import { SvgIcon } from './SvgIcon';

interface ConfirmDialogProps {
  isOpen: boolean;
  options: ConfirmOptions;
  onConfirm: () => void;
  onCancel: () => void;
}

const buttonAppearanceMap = {
  primary: 'hh-button-primary',
  secondary: 'hh-button-secondary',
  outline: 'hh-button-outline',
  subtle: 'hh-button-subtle',
  transparent: 'hh-button-transparent',
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  options,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) {
    return null;
  }

  const confirmAppearance =
    buttonAppearanceMap[options.confirmButtonAppearance || 'primary'] || buttonAppearanceMap.primary;
  const cancelAppearance =
    buttonAppearanceMap[options.cancelButtonAppearance || 'secondary'] || buttonAppearanceMap.secondary;

  return (
    <div className="hh-dialog-overlay" role="presentation">
      <div
        className="hh-dialog hh-dialog-confirm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hh-confirm-dialog-title"
        aria-describedby="hh-confirm-dialog-message"
      >
        <div className="hh-dialog-header">
          <div id="hh-confirm-dialog-title">{options.title || 'Confirm'}</div>
          <button className="hh-dialog-close" onClick={onCancel} aria-label="Close dialog">
            <SvgIcon name="close" size={16} />
          </button>
        </div>
        <div className="hh-dialog-body">
          <p id="hh-confirm-dialog-message">{options.message}</p>
        </div>
        <div className="hh-dialog-footer">
          <button className={`hh-button ${confirmAppearance}`} onClick={onConfirm}>
            {options.confirmText || 'Confirm'}
          </button>
          <button className={`hh-button ${cancelAppearance}`} onClick={onCancel}>
            {options.cancelText || 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};
