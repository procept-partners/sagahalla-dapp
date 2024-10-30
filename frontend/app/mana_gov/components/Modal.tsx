// components/Modal.tsx
import React from 'react';


interface ModalProps {
  closeModal: () => void;
  message: string; // Accept a message prop
}

const Modal = ({ closeModal, message }: ModalProps) => {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-purple-custom border-orange-custom w-full max-w-md rounded-lg border-2 p-6 shadow-lg">
          <p className="text-center text-white">{message}</p> {/* Display the message directly */}
          <div className="mt-4 flex justify-center">
            <button
              className="bg-orange-custom hover:bg-orange-hover rounded-lg px-4 py-2 text-white"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>

  );
};

export default Modal;
