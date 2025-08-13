import type { ReactNode, ReactElement } from 'react';
import Modal from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  message: ReactNode;
  confirmLabel: ReactNode;
  cancelLabel: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel
}: ConfirmDialogProps): ReactElement {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <div>{message}</div>
      <div className="c-modal-actions">
        <button type="button" className="c-btn-secondary" onClick={onCancel}>
          {cancelLabel}
        </button>
        <button type="button" className="c-btn-primary" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
