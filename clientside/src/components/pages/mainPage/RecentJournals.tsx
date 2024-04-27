import React, { useEffect } from "react";
import { JournalEntry } from "../../../lib/types/types";
import { useState, useContext } from "react";
import { getJournals } from "../../../services/JournalService";
import AuthContext from "../../../context/AuthContext";

import axios from "axios";

const RecentJournals: React.FC = () => {
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const { authTokens, logoutUser } = useContext(AuthContext) ?? {};

  useEffect(() => {
    const fetchRecentEntries = async () => {
      if (authTokens) {
        try {
          const journals = await getJournals(authTokens);
          // console.log("Received journals:", journals);
          setJournals(journals);
        } catch (error) {
          //this will log you out if you are unauthorized
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            console.log("Unauthorized -- logging you out");
            if (logoutUser) {
              logoutUser();
            }
          } else {
            console.error("Failed to fetch recent entries:", error);
          }
        }
      } else {
        console.log("Auth context or tokens are undefined/null");
      }
    };
    fetchRecentEntries();
  }, []);
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
