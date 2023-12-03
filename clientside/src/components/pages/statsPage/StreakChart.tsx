import React, { useEffect, useState } from "react";
import { JournalEntry } from "../../../lib/types/types";
import { getRecentEntries } from "../../../services/JournalService";

function StreakChart() {
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);
  const [streak, setStreak] = useState(0);
  const [daysStatus, setDaysStatus] = useState<boolean[]>(
    new Array(7).fill(false)
  ); //createing array for last 7 days

  //useEffect to fetch the recent entries
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const entries = await getRecentEntries();
        setRecentEntries(entries);
      } catch (error) {
        console.error("Error fetching recent entries:", error);
      }
    };
    fetchEntries();
  }, []);
  //useEffect to update the streak and daysStatus
  useEffect(() => {
    const last7Days = getLast7Days();
    const entriesStatus = mapEntriesToDays(recentEntries, last7Days);
    setDaysStatus(entriesStatus);
    setStreak(calculateStreak(recentEntries));
  }, [recentEntries]);

  //helper function to calculate streak
  const calculateStreak = (entries: JournalEntry[]): number => {
    if (entries.length === 0) return 0;
    let streak = 0;
    let currentDate = new Date();

    for (let entry of entries) {
      const entryDate = new Date(entry.timestamp);
      if (entryDate.toDateString() === currentDate.toDateString()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  //helper function to get last 7 days
  const getLast7Days = (): Date[] => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);
      dates.push(date);
    }
    console.log("Last 7 days:", dates);
    return dates;
  };

  //helper function to map entries to days
  const mapEntriesToDays = (
    entries: JournalEntry[],
    days: Date[]
  ): boolean[] => {
    return days.map((day) =>
      entries.some((entry) => {
        // Create a new Date object for the entry's timestamp
        const entryDate = new Date(entry.timestamp);
        // Normalize both dates by setting the time to midnight and comparising
        entryDate.setHours(0, 0, 0, 0);
        day.setHours(0, 0, 0, 0);
        return entryDate.getTime() === day.getTime();
      })
    );
  };
  //helper function to format the date to a weekday
  const formatDay = (date: Date): string => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };
  //inside the streakchart components return statement
  return (
    <div className="bg-black p-4 rounded-lg">
      <h1 className="text-white text-xl mb-4">Days in a Row : {streak}</h1>
      <div className="flex justify-between items-center">
        {daysStatus.map((entryExists, index) => {
          const day = getLast7Days()[index];
          return (
            <div
              key={index}
              className={`flex flex-col items-center ${
                entryExists ? "text-green-500" : "text-red-500"
              }`}
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border ${
                  entryExists ? "border-green-500" : "border-red-500"
                }`}
              >
                {entryExists ? "+" : "-"}
              </div>
              <span className="text-white mt-1">{formatDay(day)}</span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center items-center mt-4">
        <div className="flex items-center">
          <span className="text-white">Longest Chain:</span>
          <span className="text-yellow-400 ml-2">{streak}</span>
        </div>
      </div>
    </div>
  );
}

export default StreakChart;
