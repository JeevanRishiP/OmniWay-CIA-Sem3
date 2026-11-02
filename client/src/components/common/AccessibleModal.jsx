import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export function AccessibleModal({
  isOpen,
  onClose,
  title,
  description,
  titleId = 'modal-title',
  descriptionId = 'modal-desc',
  triggerRef,
  children
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Save previous active element if not provided via triggerRef
    const activeElementBeforeOpen = triggerRef?.current || document.activeElement;

    // Find all focusable elements inside the modal
    const getFocusableElements = () => {
      if (!modalRef.current) return [];
      return modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
    };

    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // Keydown handler for Trap & Escape
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusables = getFocusableElements();
        if (focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Prevent body scrolling while modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      if (activeElementBeforeOpen && typeof activeElementBeforeOpen.focus === 'function') {
        activeElementBeforeOpen.focus();
      }
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 sm:p-8 z-10 border border-slate-200 transform transition-all focus-visible:ring-4 focus-visible:ring-blue-600 focus-visible:outline-none"
      >
        <div className="flex items-start justify-between pb-4 border-b border-slate-200 mb-6">
          <div>
            <h2 id={titleId} className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="text-sm text-slate-700 mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 -mt-2 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors focus-visible:ring-4 focus-visible:ring-blue-600 focus-visible:outline-none"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}

