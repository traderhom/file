import React from "react";

interface ModalConfirmProps {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded shadow-lg p-6 min-w-[300px]">
        {title && <h2 className="text-lg font-bold mb-2">{title}</h2>}
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onCancel}>Annuler</button>
          <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={onConfirm}>Confirmer</button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirm;
