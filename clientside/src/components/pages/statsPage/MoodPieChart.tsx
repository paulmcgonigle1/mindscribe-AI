import { ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { JournalEntry } from "../../../lib/types/types";
import { filterEntriesByPeriod } from "../../../lib/utils/filter-by-period";
import { moodRatingColors } from "../../../lib/constants/colors";

interface MoodPieChartProps {
  entries: JournalEntry[];
  selectedPeriod: number;
  onPeriodChange: (newPeriod: number) => void;
}

// Helper function to transform entries into mood rating data for the PieChart
const transformMoodDataToPieData = (
  entries: JournalEntry[],
  selectedPeriod: number
) => {
  const filteredEntries = filterEntriesByPeriod(entries, selectedPeriod);

  const moodRatingCounts = filteredEntries.reduce((acc, entry) => {
    const moodRating = entry.moodRating;
    if (moodRating in acc) {
      acc[moodRating] += 1;
    } else {
      acc[moodRating] = 1;
    }
    return acc;
  }, {} as { [key: number]: number });

  const allMoodRatings = Array.from({ length: 5 }, (_, index) => index + 1);

  return allMoodRatings.map((moodRating) => ({
    name: moodRating.toString(),
    value: moodRatingCounts[moodRating] || 0,
  }));
};

const RADIAN = Math.PI / 180;
interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

function renderCustomizedLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: CustomLabelProps) {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.01) {
    return null;
  }

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}% `}
    </text>
  );
}

const MoodPieChart: React.FC<MoodPieChartProps> = ({
  entries,
  selectedPeriod,
}) => {
  const moodColors = Object.values(moodRatingColors);

  const data = transformMoodDataToPieData(entries, selectedPeriod);

  return (
    <div className="flex flex-1 bg-white p-4 rounded-md border border-gray-200  flex-col shadow-md ">
      <h1 className=" text-center text-2xl font-semibold mb-4">Mood Profile</h1>
      <div className="text-lg text-gray-500 text-center">
        Here is your mood chart of the last {selectedPeriod} days
      </div>

      <div className="w-full mt-3 flex-1 text-xs">
        <ResponsiveContainer width="99%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={140}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={moodColors[index % moodColors.length]}
                />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MoodPieChart;
