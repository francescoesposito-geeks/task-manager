import { ReactNode } from "react";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export default function Modal({
  onClose,
  children,
  className = ""
}: ModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`bg-card rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 flex flex-col gap-3 overflow-hidden ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
