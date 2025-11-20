import React from 'react';
import { useDialog } from '../notifications/hooks';
import { notify } from './notify-api';
import './TodoApp.css';

interface DemoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const DemoButton: React.FC<DemoButtonProps> = ({ variant = 'primary', className = '', children, ...rest }) => (
  <button
    type="button"
    className={`hh-demo-button ${variant === 'primary' ? 'hh-demo-button-primary' : 'hh-demo-button-secondary'} ${className}`.trim()}
    {...rest}
  >
    {children}
  </button>
);

/**
 * Examples of using Dialog with different Fluent UI properties
 */
export const DialogExamples: React.FC = () => {
  const dialog = useDialog();

  // Example 1: Basic dialog
  const handleBasicDialog = () => {
    dialog.show({
      title: 'Basic Dialog',
      content: <p>This is a basic dialog.</p>,
      size: 'medium',
    });
  };

  // Example 2: Dialog with custom backdrop
  const handleBackdropDialog = () => {
    dialog.show({
      title: 'Dialog with Opaque Backdrop',
      content: <p>This dialog has an opaque backdrop.</p>,
      backdrop: 'opaque',
      size: 'medium',
    });
  };

  // Example 3: Non-modal dialog (allows interaction with background)
  const handleNonModalDialog = () => {
    dialog.show({
      title: 'Non-Modal Dialog',
      content: <p>This is a non-modal dialog. You can interact with the background.</p>,
      modalType: 'non-modal',
      closeOnOutsideClick: true, // Allow closing by clicking outside
      size: 'medium',
    });
  };

  // Example 4: Alert dialog
  const handleAlertDialog = () => {
    dialog.show({
      title: 'Alert Dialog',
      content: <p>This is an alert-style dialog with large header.</p>,
      modalType: 'alert',
      size: 'small',
    });
  };

  // Example 5: Dialog with custom styling
  const handleStyledDialog = () => {
    dialog.show({
      title: 'Styled Dialog',
      content: <p>This dialog has custom styling.</p>,
      className: 'custom-dialog',
      size: 'medium',
    });
  };

  // Example 6: Dialog that doesn't close on outside click
  const handleBlockingDialog = () => {
    const dialogId = dialog.show({
      title: 'Blocking Dialog',
      content: <p>This dialog cannot be closed by clicking outside. Use the close button.</p>,
      closeOnOutsideClick: false,
      closeOnEscape: true,
      size: 'medium',
      footer: (
        <button
          type="button"
          className="hh-button hh-button-secondary"
          onClick={() => {
            dialog.hide(dialogId);
            notify.info('Dialog closed by button');
          }}
        >
          Close
        </button>
      ),
    });
  };

  // Example 7: Small dialog
  const handleSmallDialog = () => {
    dialog.show({
      title: 'Small Dialog',
      content: <p>This is a small dialog (400px width).</p>,
      size: 'small',
    });
  };

  // Example 8: Large dialog with all options
  const handleFullFeaturedDialog = () => {
    const dialogId = dialog.show({
      title: 'Full Featured Dialog',
      content: (
        <div>
          <p>This dialog demonstrates all available options:</p>
          <ul>
            <li>Custom size: large (800px)</li>
            <li>Modal type: modal (blocking)</li>
            <li>Custom backdrop: opaque</li>
            <li>Custom className</li>
          </ul>
        </div>
      ),
      size: 'large',
      modalType: 'modal',
      backdrop: 'opaque',
      className: 'full-featured-dialog',
      closeOnOutsideClick: true,
      footer: (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="hh-button hh-button-secondary"
            onClick={() => {
              dialog.hide(dialogId);
              notify.info('Dialog closed');
            }}
          >
            Close
          </button>
        </div>
      ),
    });
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h2>Dialog Examples with Fluent UI Properties</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <DemoButton onClick={handleBasicDialog}>Basic Dialog</DemoButton>
        <DemoButton onClick={handleBackdropDialog}>Opaque Backdrop</DemoButton>
        <DemoButton onClick={handleNonModalDialog}>Non-Modal Dialog</DemoButton>
        <DemoButton onClick={handleAlertDialog}>Alert Dialog</DemoButton>
        <DemoButton onClick={handleStyledDialog}>Styled Dialog</DemoButton>
        <DemoButton onClick={handleBlockingDialog}>Blocking Dialog</DemoButton>
        <DemoButton onClick={handleSmallDialog}>Small Dialog</DemoButton>
        <DemoButton onClick={handleFullFeaturedDialog}>Full Featured</DemoButton>
      </div>
    </div>
  );
};

