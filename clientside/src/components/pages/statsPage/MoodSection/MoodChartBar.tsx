import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

import { JournalEntry, MoodChartData } from "../../../../lib/types/types";
import { filterEntriesByPeriod } from "../../../../lib/utils/filter-by-period";
import { moodRatingColors } from "../../../../lib/constants/moodColors";

interface MoodStatsProps {
  entries: JournalEntry[];
  selectedPeriod: number;
  onPeriodChange: (newPeriod: number) => void;
}
function MoodLineChart({
  entries,
  selectedPeriod,
  onPeriodChange,
}: MoodStatsProps) {
  const transformMoodData = (moodData: JournalEntry[]): MoodChartData[] => {
    const filteredEntries = filterEntriesByPeriod(moodData, selectedPeriod);

    return filteredEntries.map((entry) => ({
      date: new Date(entry.timestamp).toLocaleDateString(),
      moodRating: entry.moodRating,
    }));
  };

  const data = transformMoodData(entries);
  const moodRatingColors = [
    "#FFD700",
    "#FF8C00",
    "#FF4500",
    "#FF0000",
    "#B22222",
  ]; // Define your mood rating colors

  return (
    <div className="h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
      <strong className="text-gray-7090 font-medium">Mood</strong>
      <div className="w-full mt-3 flex-1 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
            <XAxis dataKey={"date"} />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Legend />
            <Line
              dataKey="moodRating"
              fill="#82ca9d"
              type={"monotone"}
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={moodRatingColors[entry.moodRating]}
                />
              ))}
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default MoodLineChart;
