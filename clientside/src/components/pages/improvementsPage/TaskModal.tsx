import { Task } from "../../../lib/types/types";

interface TaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}
function TaskModal({ task, isOpen, onClose }: TaskModalProps) {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded shadow max-w-lg w-full">
        <button onClick={onClose} className="float-right font-bold">
          X
        </button>
        <h2 className="text-xl font-bold mb-4">{task.content}</h2>
        <p>{task.explanation}</p>
        {/* Add buttons or other interactive elements here */}
      </div>
    </div>
  );
}

export default TaskModal;
