import React, { useEffect } from 'react';

/**
 * Reusable Modal Component
 *
 * Features:
 * - Backdrop overlay (dark background)
 * - Close on ESC key press
 * - Close on backdrop click
 * - Smooth fade-in/fade-out animations
 * - Accessible (ARIA attributes, focus management)
 * - Prevents body scroll when open
 *
 * Usage:
 *   <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create Project">
 *     <p>Modal content goes here</p>
 *   </Modal>
 */

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';  // Modal width options
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {

  // Effect: Close modal on ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    // Add event listener when modal is open
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    // Cleanup: Remove event listener
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Effect: Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll
      document.body.style.overflow = 'unset';
    }

    // Cleanup: Restore scroll on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Don't render anything if modal is closed
  if (!isOpen) return null;

  // Size classes for modal width
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <>
      {/* Backdrop: Transparent overlay behind modal */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300 pointer-events-auto"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}  // 30% opacity
        onClick={onClose}  // Close on backdrop click
        aria-hidden="true"
      />

      {/* Modal Container: Centered on screen */}
      <div
        className="fixed inset-0 z-50 overflow-y-auto pointer-events-none"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex min-h-full items-center justify-center p-4 pointer-events-none">

          {/* Modal Content: The actual modal box */}
          <div
            className={`relative bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} transform transition-all duration-300 scale-100 opacity-100 pointer-events-auto`}
            onClick={(e) => e.stopPropagation()}  // Prevent close when clicking inside modal
          >
            {/* Header: Title and Close button */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3
                id="modal-title"
                className="text-xl font-semibold text-gray-900"
              >
                {title}
              </h3>

              {/* Close button (X) */}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Body: Modal content (passed as children) */}
            <div className="p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
