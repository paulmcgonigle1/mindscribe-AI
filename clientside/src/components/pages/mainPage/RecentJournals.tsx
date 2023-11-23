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
    <div className="flex flex-col max-h-96 overflow-auto">
      <h2 className="text-lg font-bold mb-2">Recent Journal Entries</h2>
      <div className="space-y-4">
        {recentEntries.map((entry) => {
          const date = new Date(entry.timestamp);
          return (
            <div key={entry.entryID} className="p-2 border rounded shadow-sm">
              <h3 className="font-semibold">{date.toLocaleDateString()}</h3>
              <p>{entry.content.substring(0, 100)}...</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentJournals;
