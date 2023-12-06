import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  getEntriesByUser,
  getRecentEntries,
} from "../../../../services/JournalService";
import { JournalEntry, MoodChartData } from "../../../../lib/types/types";

function MoodChartBar({ entries }: { entries: JournalEntry[] }) {
  const transformMoodData = (moodData: JournalEntry[]): MoodChartData[] => {
    return moodData.map((entry) => ({
      date: new Date(entry.timestamp).toLocaleDateString(),
      moodRating: entry.moodRating,
    }));
  };
  const data = transformMoodData(entries);

  type MoodRatingColours = {
    [key: number]: string;
  };
  const moodRatingColours: MoodRatingColours = {
    //colors from red to green to display mood ratings
    1: "#FF6347", // Tomato for rating 1
    2: "#FFA500", // Orange for rating 2
    3: "#FFD700", // Gold for rating 3
    4: "#90EE90", // LightGreen for rating 4
    5: "#32CD32", // LimeGreen for rating 5
  };

  return (
    <div className="h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
      <strong className="text-gray-7090 font-medium">Mood Ratings</strong>
      <div className="w-full mt-3 flex-1 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
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
            <Bar dataKey="moodRating" fill="#0ea5e9">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={moodRatingColours[entry.moodRating]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default MoodChartBar;
