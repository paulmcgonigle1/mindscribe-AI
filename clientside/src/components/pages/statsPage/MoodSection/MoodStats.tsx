import { JournalEntry } from "../../../../lib/types/types";

// Helper function to calculate average mood
function calculateAverageMood(entries: JournalEntry[]) {
  const moodSum = entries.reduce((acc, entry) => acc + entry.moodRating, 0);
  return moodSum / entries.length || 0; // Avoid division by zero
}

interface MoodStatsProps {
  entries: JournalEntry[];
  selectedPeriod: number;
  onPeriodChange: (newPeriod: number) => void;
}

function MoodStats({
  entries,
  selectedPeriod,
  onPeriodChange,
}: MoodStatsProps) {
  const averageMood = calculateAverageMood(entries);

  return (
    <div className="flex-1 mb-2">
      <h1 className="text-xl ">Mood Over Time</h1>
      <div>
        <label htmlFor="timePeriod">Select Period: </label>
        <select
          id="timePeriod"
          value={selectedPeriod}
          onChange={(e) => onPeriodChange(Number(e.target.value))}
        >
          <option value={1}>Last 1 Days</option>
          <option value={2}>Last 2 Days</option>
          <option value={3}>Last 3 Days</option>
          <option value={4}>Last 4 Days</option>
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={365}>Last Year</option>
        </select>
      </div>
      <div className="">
        <h2 className="text-sm text-fuchsia-500">
          Average Mood Rating: {averageMood.toFixed(2)}
        </h2>
        {/* Here you can add your chart visualization */}
      </div>
    </div>
  );
}

export default MoodStats;
