# Dialog Properties Reference

This document describes all available properties for the Dialog component in SPFx Notifications Hub.

## DialogOptions Interface

```typescript
interface DialogOptions {
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
```

## Property Details

### Basic Properties

#### `title?: string`
The title displayed at the top of the dialog.

#### `content: ReactNode`
The main content of the dialog. Can be any React node.

#### `footer?: ReactNode`
Optional footer content, typically containing action buttons.

#### `size?: 'small' | 'medium' | 'large' | 'fullscreen'`
Dialog size preset:
- `small`: 400px width
- `medium`: 600px width (default)
- `large`: 800px width
- `fullscreen`: 100vw x 100vh

#### `onDismiss?: () => void`
Callback function called when the dialog is dismissed.

### Fluent UI Dialog Properties

#### `modalType?: 'modal' | 'non-modal' | 'alert'`
Controls the dialog's modal behavior:
- `modal`: Standard modal dialog (default) - blocks interaction with background
- `non-modal`: Allows interaction with background elements
- `alert`: Alert-style dialog

#### `backdrop?: 'none' | 'opaque' | 'transparent'`
Backdrop appearance:
- `none`: No backdrop
- `opaque`: Opaque backdrop (default)
- `transparent`: Transparent backdrop

#### `trapFocus?: boolean`
Whether to trap focus within the dialog. Default: `true` for modal dialogs.

#### `inertTrapFocus?: boolean`
Whether to use inert trap focus. Default: `false`.

### Styling Properties

#### `className?: string`
Additional CSS class names to apply to the DialogSurface.

#### `style?: React.CSSProperties`
Inline styles to apply to the DialogSurface.

### Behavior Properties

#### `closeOnEscape?: boolean`
Whether the dialog closes when Escape key is pressed. Default: `true`.

#### `closeOnOutsideClick?: boolean`
Whether the dialog closes when clicking outside. Default: `true`.

## Usage Examples

### Example 1: Basic Dialog

```tsx
const dialogId = dialog.show({
  title: 'Confirm Action',
  content: <p>Are you sure you want to proceed?</p>,
  size: 'small',
});
```

### Example 2: Non-Modal Dialog

```tsx
const dialogId = dialog.show({
  title: 'Information',
  content: <p>You can still interact with the page behind this dialog.</p>,
  modalType: 'non-modal',
  size: 'medium',
});
```

### Example 3: Custom Styled Dialog

```tsx
const dialogId = dialog.show({
  title: 'Custom Dialog',
  content: <div>Custom content</div>,
  className: 'my-custom-dialog',
  style: {
    maxWidth: '500px',
    borderRadius: '8px',
  },
  size: 'medium',
});
```

### Example 4: Blocking Dialog

```tsx
const dialogId = dialog.show({
  title: 'Important',
  content: <p>You must use the close button to dismiss this dialog.</p>,
  closeOnOutsideClick: false,
  closeOnEscape: false,
  footer: (
    <Button onClick={() => dialog.hide(dialogId)}>
      Close
    </Button>
  ),
});
```

### Example 5: Alert Dialog

```tsx
const dialogId = dialog.show({
  title: 'Alert',
  content: <p>This is an alert-style dialog.</p>,
  modalType: 'alert',
  size: 'small',
});
```

### Example 6: Dialog with Transparent Backdrop

```tsx
const dialogId = dialog.show({
  title: 'Overlay Dialog',
  content: <p>This dialog has a transparent backdrop.</p>,
  backdrop: 'transparent',
  size: 'medium',
});
```

### Example 7: Full Featured Dialog

```tsx
const dialogId = dialog.show({
  title: 'Full Featured Dialog',
  content: (
    <div>
      <p>This dialog uses all available options:</p>
      <ul>
        <li>Large size</li>
        <li>Modal type</li>
        <li>Opaque backdrop</li>
        <li>Focus trap enabled</li>
        <li>Custom styling</li>
      </ul>
    </div>
  ),
  size: 'large',
  modalType: 'modal',
  backdrop: 'opaque',
  trapFocus: true,
  className: 'full-featured-dialog',
  style: { padding: '20px' },
  closeOnEscape: true,
  closeOnOutsideClick: true,
  footer: (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
      <Button onClick={() => dialog.hide(dialogId)}>Close</Button>
    </div>
  ),
});
```

## Notes

- All Fluent UI Dialog and DialogSurface props are supported through the `DialogOptions` interface
- The `size` property provides convenient presets, but you can override with custom `style` or `className`
- `modalType` affects accessibility and user interaction behavior
- `backdrop` controls the visual appearance of the overlay behind the dialog
- Focus management is handled automatically for modal dialogs

