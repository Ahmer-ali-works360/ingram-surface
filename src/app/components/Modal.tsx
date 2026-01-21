"use client";

import React from "react";

type ModalProps = {
  open: boolean;
  title: string;
  message: string;
  primaryLabel: string;
  onClose: () => void;
  onPrimary: () => void;
};

export default function Modal({
  open,
  title,
  message,
  primaryLabel,
  onClose,
  onPrimary,
}: ModalProps) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />

      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-11/12 max-w-md p-6">
          <h2 className="text-lg font-semibold mb-2">{title}</h2>
          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300"
            >
              Close
            </button>

            <button
              onClick={onPrimary}
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              {primaryLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
