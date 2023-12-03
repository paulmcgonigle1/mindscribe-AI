import React, { useEffect, useState } from "react";
import { JournalEntry } from "../../../lib/types/types";
import { getRecentEntries } from "../../../services/JournalService";

function StreakChart() {
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);
  const [streak, setStreak] = useState(0);
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const entries = await getRecentEntries();
        setRecentEntries(entries);
        setStreak(calculateStreak(entries));
      } catch (error) {
        console.error("Error fetching recent entries:", error);
      }
    };
    fetchEntries();
  }, []);

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
  return (
    <div>
      <h1 className="text-xl">Streak: {streak} days</h1>
      {/* Additional UI elements for displaying streak */}
    </div>
  );
}

export default StreakChart;
