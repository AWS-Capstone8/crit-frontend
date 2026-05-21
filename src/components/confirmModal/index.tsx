import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmModalProps {
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

const ConfirmModal = ({
  message,
  confirmLabel = '확인',
  onConfirm,
  secondaryLabel,
  onSecondary,
}: ConfirmModalProps) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={onConfirm}
    >
      <div
        className="flex flex-col items-center w-120 px-8 py-8 bg-white rounded-xl border-2 border-solid border-[#8257B4] shadow-[0_4px_20px_rgba(130,87,180,0.2)] animate-modal-in"
        onClick={e => e.stopPropagation()}
      >
        <p className="text-[#717171] typo-body1-medium text-center whitespace-pre-line">
          {message}
        </p>
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            type="button"
            onClick={onConfirm}
            className="flex py-2.5 px-5 justify-center items-center rounded-lg bg-[#7C5CFF] active:bg-[#6344DD] typo-body1-medium text-white cursor-pointer"
          >
            {confirmLabel}
          </button>
          {secondaryLabel && onSecondary && (
            <button
              type="button"
              onClick={onSecondary}
              className="flex py-2.5 px-5 justify-center items-center rounded-lg border-2 border-[#7C5CFF] bg-transparent text-[#7C5CFF] active:bg-[#7C5CFF]/10 typo-body1-medium cursor-pointer"
            >
              {secondaryLabel}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ConfirmModal;
