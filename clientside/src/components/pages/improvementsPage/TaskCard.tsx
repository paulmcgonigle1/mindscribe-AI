import { useState } from "react";
import { Task } from "../../../lib/types/types";

interface TaskCardProps {
  task: Task;
  onSave: (taskId: number) => void;
  onUnsave: (taskId: number) => void;
}

function TaskCard({ task, onSave, onUnsave }: TaskCardProps) {
  const [isSaved, setIsSaved] = useState(task.inProgress);

  const [expanded, setExpanded] = useState(false);

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };
  // Function to handle save click
  const handleSaveToggle = async () => {
    try {
      if (isSaved) {
        //if the task is currently saved, then call the unsave
        await onUnsave(task.taskId);
      } else {
        await onSave(task.taskId);
      }

      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Failed to toggle save state :", error);
      // maybe notify the user that save failed
    }
  };

  return (
    <div
      className="max-w-sm p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow-lg"
      // style={{ backgroundColor: "#f9a827" }}
    >
      <h5 className="text-lg sm:text-xl text-left font-semibold tracking-tight text-black">
        {task.content}
      </h5>

      {/* This paragraph will be hidden on small screens */}
      {!expanded && (
        <p className="text-gray-600">{task.explanation.substring(0, 100)}</p>
      )}
      {expanded && <p className="text-gray-600">{task.explanation}</p>}
      {/* This button will be hidden on small screens */}
      <button
        onClick={toggleExpansion}
        className="mt-4 ml-4 hidden sm:inline-flex items-center px-3 py-2 font-medium text-center text-white bg-warm-orange-dark rounded-lg hover:bg-orange-600 transition-colors duration-300 ease-in-out"
      >
        Read more
        {/* SVG arrow icon here */}
      </button>
      {/* SAVE BUTTON*/}
      <button
        onClick={handleSaveToggle}
        className={`mt-4 ml-4 items-center px-3 py-2 text-md font-medium text-center text-white rounded transition-colors duration-300 ease-in-out ${
          isSaved
            ? "bg-unsave-task hover:bg-red-600"
            : "bg-rich-green hover:bg-green-600"
        }`}
      >
        {isSaved ? "Unsave Task" : "Save Task"}
      </button>
    </div>
  );
}

export default TaskCard;
