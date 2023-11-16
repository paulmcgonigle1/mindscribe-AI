import React, { useEffect } from "react";
import { JournalEntry } from "../../../lib/types/types";
import { useState } from "react";
import { getRecentEntries } from "../../../services/JournalService";

const RecentJournals: React.FC = () => {
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const fetchRecentEntries = async () => {
      try {
        const entries = await getRecentEntries();
        console.log("Received entries:", entries);
        setRecentEntries(entries);
      } catch (error) {
        console.error("Failed to fetch recent entries:", error);
      }
    };
    fetchRecentEntries();
  }, []);
  return (
    <div>
      <h2>Recent Journal Entries</h2>
      {recentEntries.map((entry) => {
        const date = new Date(entry.timestamp);
        return (
          <div key={entry.entryID}>
            <h3>{date.toLocaleDateString()}</h3>
            <p>{entry.content.substring(0, 100)}...</p>
          </div>
        );
      })}
    </div>
  );
};

export default RecentJournals;
