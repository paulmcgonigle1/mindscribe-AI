import {
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { JournalEntry, MoodChartData } from "../../../../lib/types/types";
import { filterEntriesByPeriod } from "../../../../lib/utils/filter-by-period";

interface MoodStatsProps {
  entries: JournalEntry[];
  selectedPeriod: number;
  onPeriodChange: (newPeriod: number) => void;
}
function MoodLineChart({ entries, selectedPeriod }: MoodStatsProps) {
  const transformMoodData = (moodData: JournalEntry[]): MoodChartData[] => {
    const filteredEntries = filterEntriesByPeriod(moodData, selectedPeriod);

    return filteredEntries.map((entry) => ({
      date: new Date(entry.timestamp).toLocaleDateString(),
      moodRating: entry.moodRating,
    }));
  };

  const data = transformMoodData(entries);

  return (
    <div
      className="flex flex-col bg-white p-4 rounded-sm border border-gray-200 "
      style={{ height: "22rem" }}
    >
      <strong className="text-gray-700 font-medium">Mood</strong>
      <div className="mt-3 flex-1 text-xs ">
        <ResponsiveContainer width="99%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="moodRating"
              stroke="#82ca9d"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default MoodLineChart;
