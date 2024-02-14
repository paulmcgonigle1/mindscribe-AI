import React, { useContext, useEffect, useState } from "react";
import { JournalEntry } from "../../../lib/types/types";
import { getJournals } from "../../../services/JournalService";
import AuthContext from "../../../context/AuthContext";

function StreakChart() {
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const authContext = useContext(AuthContext);

  const [streak, setStreak] = useState(0);
  const [daysStatus, setDaysStatus] = useState<boolean[]>(
    new Array(7).fill(false)
  ); //createing array for last 7 days

  //useEffect to fetch the recent entries
  useEffect(() => {
    const fetchRecentEntries = async () => {
      if (authContext && authContext.authTokens) {
        try {
          const journals = await getJournals(authContext.authTokens);
          console.log("Received journals:", journals);
          setJournals(journals);
        } catch (error) {
          console.error("Failed to fetch recent entries:", error);
        }
      } else {
        console.log("Auth context or tokens are undefined/null");
      }
    };
    fetchRecentEntries();
  }, []);
  //useEffect to update the streak and daysStatus
  useEffect(() => {
    const last7Days = getLast7Days();
    const entriesStatus = mapEntriesToDays(journals, last7Days);
    setDaysStatus(entriesStatus);
    setStreak(calculateStreak(journals));
  }, [journals]);

  //helper function to calculate streak
  const calculateStreak = (entries: JournalEntry[]): number => {
    if (entries.length === 0) return 0;

    // Sort entries by timestamp in descending order
    const sortedEntries = [...entries].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); //normalize the date
    //loop through the sorted entries
    for (let entry of sortedEntries) {
      const entryDate = new Date(entry.timestamp);

      //normalize the date
      entryDate.setHours(0, 0, 0, 0);

      //check if entry date matches the current date for the streak
      if (entryDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    console.log("Streak:", streak);
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
    <div className="  bg-white p-4 rounded-lg max-h-[300px] border border-gray-200">
      <h1 className="text-black text-xl mb-2">Days in a Row : {streak}</h1>
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
              <span className="text-black mt-1">{formatDay(day)}</span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center items-center mt-2">
        <div className="flex items-center">
          <span className="text-black">Longest Streak(needsUpdated):</span>
          <span className="text-black-400 ml-2">{streak}</span>
        </div>
      </div>
    </div>
  );
}

export default StreakChart;
