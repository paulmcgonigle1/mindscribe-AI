type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode; // Adding children prop
  className?: string; // Optional className for additional styling
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-40 flex justify-center items-center p-4">
      <div className={`bg-white rounded shadow-lg p-5 ${className}`}>
        <div className="mb-4">{children}</div>
        <button
          onClick={onClose}
          className="py-2 px-4 bg-gray-200 rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
