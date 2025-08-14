import { ICON_SIZES } from '../../../constants';
import type { ReactElement } from 'react';

/**
 * Props for the {@link LoggedInIcon} component.
 * `size` maps to the icon's pixel dimensions.
 */
interface LoggedInIconProps {
  size?: number;
}

/**
 * Renders a user silhouette with a check mark to indicate
 * that the viewer is authenticated.
 */
export default function LoggedInIcon({
  size = ICON_SIZES.DEFAULT
}: LoggedInIconProps): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Head and shoulders outline */}
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
      {/* Check mark indicating logged-in status */}
      <polyline points="16 11 18 13 22 9" />
    </svg>
  );
}
