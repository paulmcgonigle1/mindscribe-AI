import React from "react";
import { ImprovementData, Task } from "../../../lib/types/types";

interface CompletedTasksProps {
  tasks: Task[]; // Define the type based on your actual type definitions
}
const CompletedTasksView = ({ tasks }: CompletedTasksProps) => {
  return (
    <div className="bg-light-blue-100 p-5 rounded-lg my-4">
      <h3 className="text-xl font-semibold mb-2 text-center">
        Completed Tasks
      </h3>
      <ul className="list-disc pl-5">
        {tasks.map((task, index) => (
          <li key={task.taskId || index} className="text-md mb-1">
            {task.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompletedTasksView;
