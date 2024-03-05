import React, { useState } from "react";
import { Task } from "../../../lib/types/types";

interface TaskCardProps {
  task: Task;
  onReadMore: (task: Task) => void;
  onSave: (taskId: number) => void;
}

function TaskCard({ task, onReadMore, onSave }: TaskCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  // Function to handle save click
  const handleSave = async () => {
    try {
      // Await the onSave operation to complete, which is passed down from parent
      await onSave(task.taskId);
      // Only set to saved if onSave succeeds without throwing an error
      setIsSaved(true);
    } catch (error) {
      console.error("Failed to save task:", error);
      // Handle error case here, maybe notify the user that save failed
    }
  };

  return (
    <div className="max-w-sm p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow">
      <h5 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
        {task.content}
      </h5>
      {/* This paragraph will be hidden on small screens */}
      <p className="hidden md:block font-normal text-gray-700">
        {task.explanation.substring(0, 150)}...
      </p>
      {/* This button will be hidden on small screens */}
      <button
        onClick={() => onReadMore(task)}
        className="hidden sm:inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
      >
        Read more
        {/* SVG arrow icon here */}
      </button>
      <button
        onClick={handleSave}
        className={`mt-4 sm:mt-0 sm:ml-4 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white ${
          isSaved ? "bg-gray-400" : "bg-green-700"
        } rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300`}
        disabled={isSaved}
      >
        {isSaved ? "Saved" : "Save Task"}
      </button>
    </div>
  );
}

export default TaskCard;
