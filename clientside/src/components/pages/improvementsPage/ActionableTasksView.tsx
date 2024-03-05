import React, { useContext, useState } from "react";
import { ImprovementData, Task } from "../../../lib/types/types";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import { saveTask } from "../../../services/JournalService";
import AuthContext from "../../../context/AuthContext";
interface ImprovementsMessageProps {
  improvementData: ImprovementData; // Define the type based on your actual type definitions
}
function ActionableTasksView({ improvementData }: ImprovementsMessageProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { authTokens } = useContext(AuthContext) ?? {};

  //handles clicking on read more button
  const handleReadMore = (task: Task) => {
    setSelectedTask(task);
  };
  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  //this is savin task (adding to InProgress)
  const handleSaveTask = async (taskId: number) => {
    if (authTokens?.access) {
      const response = await saveTask(authTokens, taskId);
      console.log(response);
    }
  };

  return (
    <div className="flex flex-wrap gap-4">
      {improvementData.tasks.map((task, index) => (
        <TaskCard
          key={task.taskId || index}
          task={task}
          onReadMore={handleReadMore}
          onSave={() => handleSaveTask(task.taskId)} // Pass taskId to handleSaveTask
        />
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
