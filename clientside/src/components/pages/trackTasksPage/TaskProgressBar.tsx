interface TaskProgressBarProps {
  percentage: number;
}

const TaskProgressBar: React.FC<TaskProgressBarProps> = ({ percentage }) => {
  // Ensure percentage is not out of bounds
  const validPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
      <div
        className={`bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full`}
        style={{ width: `${validPercentage}%` }}
      >
        {validPercentage}%
      </div>
    </div>
  );
};

export default TaskProgressBar;
