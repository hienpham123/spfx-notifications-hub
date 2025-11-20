import React, { useMemo, useRef, useState } from 'react';
import { NotificationsProvider } from '../core/NotificationsProvider';
import { ToastViewportPosition, ToastPlacementConfig, ToastPlacementInput } from '../core/types';
import '../styles.css';
import { TodoApp } from './TodoApp';
import { PlacementControls } from './PlacementControls';

export const App: React.FC = () => {
  const [position, setPosition] = useState<ToastViewportPosition>('top-right');
  const [responsiveEnabled, setResponsiveEnabled] = useState(true);
  const [inlineEnabled, setInlineEnabled] = useState(false);
  const inlineContainerRef = useRef<HTMLDivElement>(null);

  const placementConfig = useMemo<ToastPlacementConfig | ToastPlacementInput>(() => {
    if (inlineEnabled) {
      return {
        position,
        container: () => inlineContainerRef.current,
      };
    }

    if (responsiveEnabled) {
      return {
        default: position,
        responsive: [
          { maxWidth: 1024, target: position },
          { maxWidth: 640, target: 'bottom-center' },
        ],
      };
    }

    return position;
  }, [inlineEnabled, position, responsiveEnabled]);

  const handleInlineToggle = (value: boolean) => {
    setInlineEnabled(value);
    if (value) {
      setResponsiveEnabled(false);
    }
  };

  return (
    <NotificationsProvider
      toastPlacement={placementConfig}
      defaultDuration={5000}
      loggingConfig={{
        enabled: true,
        logLevel: 'all',
        onLog: async (notification) => {
          console.log('[Notification Log]', {
            type: notification.type,
            message: notification.message,
            title: notification.title,
            timestamp: new Date().toISOString(),
          });
        },
      }}
    >
      <div className="hh-demo-shell">
        <PlacementControls
          position={position}
          onPositionChange={setPosition}
          responsiveEnabled={responsiveEnabled}
          onResponsiveToggle={setResponsiveEnabled}
          inlineEnabled={inlineEnabled}
          onInlineToggle={handleInlineToggle}
        />

        <div
          ref={inlineContainerRef}
          className={`hh-inline-target ${inlineEnabled ? 'is-active' : ''}`}
        >
          <h3>Inline toast container</h3>
          <p>
            When “Inline container” is enabled, this dashed area becomes the host for toast notifications. Perfect for
            cards, side panels, or any scoped UI.
          </p>
          {!inlineEnabled && (
            <p className="hh-inline-note">
              Tip: Enable the inline container switch above to render toasts inside this box.
            </p>
          )}
        </div>

        <TodoApp />
      </div>
    </NotificationsProvider>
  );
};

