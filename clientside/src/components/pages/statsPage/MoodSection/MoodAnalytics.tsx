import React, { useEffect, useState } from "react";
import { JournalEntry } from "../../../../lib/types/types";
import { getRecentEntries } from "../../../../services/JournalService";
import MoodStats from "./MoodStats";
import MoodChartBar from "./MoodChartBar";

function MoodAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState<number>(7); // Default to last 7 days
  const [entries, setEntries] = useState<JournalEntry[]>([]);

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
  }, [selectedPeriod]);

  const handlePeriodChange = (newPeriod: number) => {
    setSelectedPeriod(newPeriod);
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 flex-1">
      <MoodStats
        entries={entries}
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
      />
      <MoodChartBar entries={entries} />
    </div>
  );
}

export default MoodAnalytics;
