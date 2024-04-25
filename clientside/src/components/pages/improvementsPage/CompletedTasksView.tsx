import { useState } from "react";
import { Task } from "../../../lib/types/types";
import Load from "../../../assets/mindscribe2/svg/load.svg";

interface CompletedTasksProps {
  tasks: Task[];
}

const CompletedTasksView = ({ tasks }: CompletedTasksProps) => {
  // Function to format the date to a readable string
  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat("default", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  // Generate a string for today's date in the same format as uniqueDates
  const todaysDate = formatDate(new Date());

  const todaysTasksCount = tasks.filter(
    (task) => formatDate(task.created_at) === todaysDate
  ).length;
  // State for the selected date initialized to today's date
  //const [selectedDate, setSelectedDate] = useState<string>(todaysDate);

  const [expandedTaskID, SetExpandedTaskId] = useState<number | null>(null);

  const selectedDate = formatDate(new Date());
  // Filter tasks based on the selected date
  const filteredTasks = tasks.filter(
    (task) => formatDate(task.created_at) === selectedDate
  );

  // Sort tasks by date
  const sortedTasks = filteredTasks.sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateB - dateA;
  });

  //handle expanding the tasks completed information
  const handleToggleDetails = (taskId: number) => {
    SetExpandedTaskId((prevTaskId) => (prevTaskId === taskId ? null : taskId));
  };
  return (
    <div
      className="shadow rounded-lg mx-auto p-4"
      style={{ backgroundColor: "#f9a827" }}
    >
      {" "}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold">
          Completed Tasks Today ({todaysTasksCount})
        </h3>
        {/* Selector as before */}
      </div>
      <ul>
        {sortedTasks.map((task, index) => (
          <li key={task.taskId} className="border-b  last:border-b-0">
            <div
              className={`flex justify-between items-center p-3 hover:bg-green-100 rounded-md cursor-pointer ${
                expandedTaskID === task.taskId ? "bg-green-200" : ""
              }`}
              onClick={() => handleToggleDetails(task.taskId)}
            >
              <span className="text-lg font-medium">
                {index + 1}. {task.content}
              </span>
              <button className="text-lg text-blue-500 hover:text-blue-700">
                Details
              </button>
            </div>
            {expandedTaskID === task.taskId && (
              <div className="p-3 text-md">
                <p className="font-semibold mb-2">
                  <strong>Explanation </strong> {task.explanation}
                </p>
                <p className=" mt-3">
                  How did doing this task make you feel, did it help you with
                  your mental health?
                </p>
                <textarea
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Write a comment..."
                ></textarea>

                <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Submit Comment
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      {selectedDate && sortedTasks.length === 0 && (
        <>
          <p className="text-sm">No tasks completed on this date yet.</p>
          <div className="hidden md:block">
            {/* Replace with your image path */}
            <img
              src={Load}
              alt="Descriptive Alt Text"
              className="h-[25vh] m-auto mt-6"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CompletedTasksView;
