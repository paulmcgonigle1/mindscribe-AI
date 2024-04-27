import Load from "../../../assets/mindscribe2/svg/warning.svg";

interface ModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmationModal({ onConfirm, onCancel }: ModalProps) {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg">
        <div className="flex flex-col items-center justify-center mb-4">
          <p className="text-lg font-semibold">
            Are you sure you want to remove all data?
          </p>
          <img
            src={Load}
            alt="Confirmation Image"
            className="h-[20%] max-w-[30%] mr-2"
          />{" "}
        </div>
        <p className="text-sm text-center text-gray-600 mb-4">
          This action cannot be undone. All of your data will be permanently
          deleted.
        </p>
        <div className="flex justify-center">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded mr-4 shadow-xl"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-xl"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
