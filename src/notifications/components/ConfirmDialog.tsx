import React from 'react';
import {
  Dialog,
  DialogType,
  DialogFooter,
  PrimaryButton,
  DefaultButton,
} from '@fluentui/react';
import { ConfirmOptions } from '../types';

interface ConfirmDialogProps {
  isOpen: boolean;
  options: ConfirmOptions;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  options,
  onConfirm,
  onCancel,
}) => {
  const dialogContentProps = {
    type: DialogType.normal,
    title: options.title || 'Confirm',
    subText: options.message,
  };

  return (
    <Dialog
      hidden={!isOpen}
      onDismiss={onCancel}
      dialogContentProps={dialogContentProps}
      modalProps={{
        isBlocking: true,
      }}
    >
      <DialogFooter>
        <DefaultButton
          onClick={onCancel}
          text={options.cancelText || 'Cancel'}
        />
        <PrimaryButton
          onClick={onConfirm}
          text={options.confirmText || 'Confirm'}
        />
      </DialogFooter>
    </Dialog>
  );
};
