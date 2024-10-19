// components/Modal.tsx
import React from 'react';

interface ModalProps {
  closeModal: () => void;
  children: React.ReactNode;
}

const Modal = ({ closeModal, children }: ModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-purple-custom p-6 shadow-lg w-full max-w-md rounded-lg border-2 border-orange-custom">
        {children}
        <div className="flex justify-center mt-4">
          <button
            className="px-4 py-2 bg-orange-custom text-white rounded-lg hover:bg-orange-hover"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
