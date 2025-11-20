import React from 'react';
import { useNotify } from '../core/hooks';
import { ToastViewportPosition } from '../core/types';

interface PlacementControlsProps {
  position: ToastViewportPosition;
  onPositionChange: (position: ToastViewportPosition) => void;
  responsiveEnabled: boolean;
  onResponsiveToggle: (value: boolean) => void;
  inlineEnabled: boolean;
  onInlineToggle: (value: boolean) => void;
}

const positions: ToastViewportPosition[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
];

export const PlacementControls: React.FC<PlacementControlsProps> = ({
  position,
  onPositionChange,
  responsiveEnabled,
  onResponsiveToggle,
  inlineEnabled,
  onInlineToggle,
}) => {
  const notify = useNotify();

  const triggerPreview = () => {
    notify.info('This toast uses the current placement setting.', {
      title: 'Placement preview',
      duration: 2500,
    });
  };

  return (
    <div className="hh-placement-panel">
      <div className="hh-placement-header">
        <div>
          <p className="hh-placement-kicker">Demo playground</p>
          <h2 className="hh-placement-title">Toast placement & responsiveness</h2>
        </div>
        <button className="hh-placement-preview" onClick={triggerPreview}>
          Trigger preview toast
        </button>
      </div>

      <div className="hh-placement-grid">
        <div className="hh-placement-block">
          <p className="hh-placement-label">Position</p>
          <div className="hh-placement-options">
            {positions.map((pos) => (
              <button
                key={pos}
                type="button"
                className={`hh-placement-chip ${position === pos ? 'is-active' : ''}`}
                onClick={() => onPositionChange(pos)}
              >
                {pos.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="hh-placement-block">
          <p className="hh-placement-label">Responsive rules</p>
          <label className="hh-placement-toggle">
            <input
              type="checkbox"
              checked={responsiveEnabled}
              onChange={(event) => onResponsiveToggle(event.target.checked)}
              disabled={inlineEnabled}
            />
            <span>
              Match breakpoints (≤ 1024px → bottom-right, ≤ 640px → bottom-center). Disabled while using inline
              container.
            </span>
          </label>
        </div>

        <div className="hh-placement-block">
          <p className="hh-placement-label">Inline container</p>
          <label className="hh-placement-toggle">
            <input
              type="checkbox"
              checked={inlineEnabled}
              onChange={(event) => onInlineToggle(event.target.checked)}
            />
            <span>Render toasts inside the inline box below (great for cards, modals, or panels).</span>
          </label>
        </div>
      </div>
    </div>
  );
};

