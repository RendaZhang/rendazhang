import { type ReactElement } from 'react';

interface IconProps {
  size?: number;
}

export function SunIcon({ size = 20 }: IconProps): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 18a6 6 0 110-12 6 6 0 010 12z" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="2" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22" />
        <line x1="4" y1="12" x2="2" y2="12" />
        <line x1="22" y1="12" x2="20" y2="12" />
        <line x1="5.64" y1="5.64" x2="4.22" y2="4.22" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="5.64" y1="18.36" x2="4.22" y2="19.78" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </g>
    </svg>
  );
}

export function MoonIcon({ size = 20 }: IconProps): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor" />
    </svg>
  );
}

export default function ThemeIcon({ size = 20 }: IconProps): ReactElement {
  return (
    <>
      <span className="is-theme-light" aria-hidden="true">
        <SunIcon size={size} />
      </span>
      <span className="is-theme-dark" aria-hidden="true">
        <MoonIcon size={size} />
      </span>
    </>
  );
}
