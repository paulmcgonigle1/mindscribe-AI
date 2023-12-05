import React, { useState, useEffect } from "react";
import { JournalEntry } from "../../../../lib/types/types";
import {
  getEntriesByUser,
  getRecentEntries,
} from "../../../../services/JournalService";

// Helper function to filter entries by date
function filterEntriesByDate(entries: JournalEntry[], days: number) {
  const filteredEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.timestamp);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return entryDate >= cutoffDate;
  });
  return filteredEntries;
}

// Helper function to calculate average mood
function calculateAverageMood(entries: JournalEntry[]) {
  const moodSum = entries.reduce((acc, entry) => acc + entry.moodRating, 0);
  return moodSum / entries.length || 0; // Avoid division by zero
}

function MoodChart() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(7); // Default to last 7 days
  const [averageMood, setAverageMood] = useState<number>(0);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        //const userId = 1;
        const userEntries = await getRecentEntries(); //this needs to be updated to get entries for the user
        setEntries(userEntries);
      } catch (error) {
        console.error("Error fetching recent entries:", error);
      }
    };
    fetchEntries();
    console.log(entries);
  }, []);

  useEffect(() => {
    const filteredEntries = filterEntriesByDate(entries, selectedPeriod);
    const average = calculateAverageMood(filteredEntries);
    setAverageMood(average);
  }, [entries, selectedPeriod]);

  return (
    <div className="bg-white shadow rounded-lg p-4 flex-1">
      <h1 className="text-xl mb-4">Mood Over Time</h1>
      <div>
        <label htmlFor="timePeriod">Select Period: </label>
        <select
          id="timePeriod"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(Number(e.target.value))}
        >
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={365}>Last Year</option>
        </select>
      </div>
      <div className="mt-4">
        <h2 className="text-lg">
          Average Mood Rating: {averageMood.toFixed(2)}
        </h2>
        {/* Here you can add your chart visualization */}
      </div>
    </div>
  );
}

export default MoodChart;
