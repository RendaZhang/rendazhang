import { useEffect, useState, type ReactNode } from 'react';

interface ControlHintProps {
  children: ReactNode;
  label: string;
  className?: string;
  side?: 'below' | 'above' | 'left';
  disabled?: boolean;
}

export default function ControlHint({
  children,
  label,
  className = '',
  side = 'below',
  disabled = false
}: ControlHintProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const open = !disabled && !dismissed && (hovered || focused);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDismissed(true);
    };
    document.addEventListener('keydown', dismiss);
    return () => document.removeEventListener('keydown', dismiss);
  }, [open]);

  return (
    <span
      className={`c-control-hint ${className}`.trim()}
      data-hint-side={side}
      data-hint-open={open ? '' : undefined}
      onPointerEnter={(event) => {
        if (event.pointerType === 'touch') return;
        setHovered(true);
        setDismissed(false);
      }}
      onPointerLeave={() => setHovered(false)}
      onFocus={(event) => {
        if (!event.target.matches(':focus-visible')) return;
        setFocused(true);
        setDismissed(false);
      }}
      onBlur={() => setFocused(false)}
    >
      {children}
      {/* The button already exposes this label to assistive technology. */}
      <span className="c-control-hint-bubble" aria-hidden="true">
        {label}
      </span>
    </span>
  );
}
