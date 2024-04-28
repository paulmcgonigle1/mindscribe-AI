import { useContext } from "react";
import { ImprovementData, Task } from "../../../lib/types/types";
import TaskCard from "./TaskCard";
import { saveTask } from "../../../services/JournalService";
import AuthContext from "../../../context/AuthContext";
import Load from "../../../assets/mindscribe2/svg/post.svg";
import { useNavigate } from "react-router-dom";

interface ImprovementsMessageProps {
  improvementData: ImprovementData; // Define the type based on your actual type definitions
}
function ActionableTasksView({ improvementData }: ImprovementsMessageProps) {
  const navigate = useNavigate();

  const { authTokens } = useContext(AuthContext) ?? {};

  //this is savin task (adding to InProgress)
  const handleSaveTask = async (taskId: number, state: boolean) => {
    if (authTokens?.access) {
      const response = await saveTask(authTokens, taskId, state);
      console.log(response);
    }
  };
  const handleNav = () => {
    navigate("/"); // Fetch message when button is clicked
  };
  if (!improvementData.tasks.length) {
    return (
      <div className="flex flex-col items-center justify-center bg-white p-5 rounded-lg my-4 w-full">
        <h2 className="text-2xl font-semibold mb-6">
          Recommendedations for today
        </h2>
        <img src={Load} alt="Writer" className="mb-4 max-h-72" />
        <p className="text-center text-lg">
          No recommendations available yet. Please try journaling for today
          first.
        </p>
        <button
          className=" items-center shadow-lg w-fit hover:bg-orange-100 rounded text-black p-2 mt-3"
          onClick={handleNav}
        >
          Add Entry
        </button>
      </div>
    );
  }

  return (
    <div className=" bg-white p-5 rounded-lg my-4">
      <div className=" border-rich-green text-black text-center ">
        <h3 className="text-2xl font-semibold mb-10">
          Recommendedations for today
        </h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-4">
        {improvementData.tasks.map((task, index) => (
          <TaskCard
            key={task.taskId || index}
            task={task}
            onSave={() => handleSaveTask(task.taskId, true)} // Pass taskId to handleSaveTask
            onUnsave={() => handleSaveTask(task.taskId, false)} // Assuming you have a handleUnsaveTask function
          />
        ))}
      </div>
    </div>
  );
}

export default ActionableTasksView;
