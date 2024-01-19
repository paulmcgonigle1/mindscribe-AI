import React, { useState } from "react";
import { ImprovementData, Task } from "../../../lib/types/types";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";

interface ImprovementsMessageProps {
  improvementData: ImprovementData; // Define the type based on your actual type definitions
}
function ActionableTasksView({ improvementData }: ImprovementsMessageProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  //handles clicking on read more button
  const handleReadMore = (task: Task) => {
    setSelectedTask(task);
  };
  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  return (
    <div className="flex flex-wrap gap-4">
      {improvementData.tasks.map((task) => (
        <TaskCard key={task.taskId} task={task} onReadMore={handleReadMore} />
      ))}
      <TaskModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default ActionableTasksView;
