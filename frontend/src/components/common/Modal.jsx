import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-xl',
  footer,
  dialogClassName = ''
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">

      {/* Backdrop */}
      <div
        className="fixed top-0 left-0 w-screen h-screen bg-[#3E5C54]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">

        {/* OUTER MODAL BOX */}
        <div
          className={`relative w-full ${maxWidth} min-h-[70vh] ${dialogClassName} transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all border border-[#E0E0E0] my-8`}
          onClick={(e) => e.stopPropagation()}
        >

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0] bg-[#EEF2F0]">
            <h3 className="text-base font-semibold text-[#3E5C54]">
              {title}
            </h3>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-1 text-[#6C757D] hover:bg-[#E0E0E0] hover:text-[#3E5C54] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* CONTENT BOX */}
          <div className="px-6 py-5 max-h-[calc(100vh-200px)] overflow-y-auto">
            {children}
          </div>

          {/* Footer if provided */}
          {footer && (
            <div className="flex items-center justify-end gap-3 px-6 py-3.5 border-t border-[#E0E0E0] bg-[#EEF2F0]">
              {footer}
            </div>
          )}

        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;