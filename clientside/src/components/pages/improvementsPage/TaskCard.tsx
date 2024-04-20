import { useState } from "react";
import { Task } from "../../../lib/types/types";

interface TaskCardProps {
  task: Task;
  onReadMore: (task: Task) => void;
  onSave: (taskId: number) => void;
  onUnsave: (taskId: number) => void;
}

function TaskCard({ task, onReadMore, onSave, onUnsave }: TaskCardProps) {
  const [isSaved, setIsSaved] = useState(task.inProgress);

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
    <div className="max-w-sm p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow">
      <h5 className="text-lg sm:text-xl text-left font-semibold tracking-tight text-gray-900">
        {task.content}
      </h5>

      {/* This paragraph will be hidden on small screens */}
      <p className="hidden md:block font-normal text-gray-700">
        {task.explanation.substring(0, 100)}...
      </p>
      {/* This button will be hidden on small screens */}
      <button
        onClick={() => onReadMore(task)}
        className="mt-4 ml-4 hidden sm:inline-flex items-center px-3 py-2  font-medium text-center text-white bg-warm-orange-dark rounded-lg hover:bg-blue-800 "
      >
        Read more
        {/* SVG arrow icon here */}
      </button>
      {/* SAVE BUTTON*/}
      <button
        onClick={handleSaveToggle}
        className={`... ${
          isSaved ? "bg-unsave-task" : "bg-rich-green"
        } mt-4 ml-4  items-center px-3 py-2 text-md font-medium text-center text-white rounded`}
      >
        {isSaved ? "Unsave Task" : "Save Task"}
      </button>
    </div>
  );
}

export default TaskCard;
