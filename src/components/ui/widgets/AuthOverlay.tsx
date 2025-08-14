import type { ReactElement } from 'react';

/**
 * Props for {@link AuthOverlay} component.
 * @property active - Whether the overlay should be visible.
 */
interface AuthOverlayProps {
  active: boolean;
}

/**
 * Full‑screen overlay with a centered spinner used during authentication
 * flows (login, register, etc.). It fades in when `active` is true to
 * indicate a pending redirect and prevents further interaction.
 */
export default function AuthOverlay({ active }: AuthOverlayProps): ReactElement {
  return (
    <div aria-hidden={!active} className={`c-auth-overlay${active ? ' is-active' : ''}`}>
      {/* Reuse generic spinner for consistency across the UI */}
      <div className="c-spinner" />
    </div>
  );
}
