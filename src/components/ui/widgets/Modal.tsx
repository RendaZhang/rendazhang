import { useState, useEffect, type ReactNode, type ReactElement, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps): ReactElement | null {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className="c-modal" role="dialog" aria-modal="true" onClick={handleOverlayClick}>
      <div className="c-modal-content bg-surface rounded-8">{children}</div>
    </div>,
    document.body
  );
}
