import React, { useState } from "react";
import { Task } from "../../../lib/types/types";

interface TaskCardProps {
  task: Task;
  onReadMore: (task: Task) => void;
  onSave: (taskId: number) => void;
}
function TaskCard({ task, onReadMore, onSave }: TaskCardProps) {
  return (
    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
        {task.content}
      </h5>
      {/* Shortened content or any other information you want to show before 'Read More' */}
      <p className="mb-3 font-normal text-gray-700">
        {task.explanation.substring(0, 150)}...
      </p>
      <button
        onClick={() => onReadMore(task)}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
      >
        Read more
        {/* SVG arrow icon here */}
      </button>

      <button
        onClick={() => onSave(task.taskId)}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
      >
        Save Task
        {/* SVG arrow icon here */}
      </button>
    </div>
  );
}

export default TaskCard;
