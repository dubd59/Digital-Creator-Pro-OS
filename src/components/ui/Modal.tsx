import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity\" onClick={onClose}></div>
        <div className="relative bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full">
          {children}
        </div>
      </div>
    </div>
  );
};