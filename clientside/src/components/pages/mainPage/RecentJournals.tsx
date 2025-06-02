import React, { useEffect } from "react";
import { JournalEntry } from "../../../lib/types/types";
import { useState } from "react";
import { getJournals } from "../../../services/JournalService";
import { useAuth } from "../../../context/AuthContext";

import axios from "axios";

const RecentJournals: React.FC = () => {
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const { token, logout } = useAuth();

  useEffect(() => {
    const fetchRecentEntries = async () => {
      if (token) {
        try {
          const journals = await getJournals({ access: token });
          // console.log("Received journals:", journals);
          setJournals(journals);
        } catch (error) {
          //this will log you out if you are unauthorized
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            console.log("Unauthorized -- logging you out");
            logout();
          } else {
            console.error("Failed to fetch recent entries:", error);
          }
        }
      } else {
        console.log("Auth context or tokens are undefined/null");
      }
    };
    fetchRecentEntries();
  }, [token, logout]);
  return (
    <div className="flex flex-col max-h-96 overflow-auto">
      <h2 className="text-lg font-bold mb-2">Journal Entries</h2>
      <div className="space-y-4">
        {journals.map((entry) => {
          //this goes through a for loop and sets each to a div of a journal
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
