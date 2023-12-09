import React, { useEffect, useState } from "react";

import DashboardStatsGrid from "./DashboardStatsGrid";
import TransactionChart from "./MoodSection/MoodChartBar";
import BuyerProfileChart from "./MoodPieChart";
import RecentOrders from "./EmotionGrid";
import PopularProducts from "./PopularProducts";
import StreakChart from "./StreakChart";
import MoodChart from "./MoodSection/MoodStats";
import MoodChartBar from "./MoodSection/MoodChartBar";
import MoodStats from "./MoodSection/MoodStats";
import MoodAnalytics from "./MoodSection/MoodAnalytics";
import { getRecentEntries } from "../../../services/JournalService";
import { JournalEntry } from "../../../lib/types/types";
import MoodPieChart from "./MoodPieChart";
import EmotionGrid from "./EmotionGrid";
import ThemesGrid from "./ThemesGrid";
export default function StatsDashboard() {
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
    <div className="flex flex-col gap-4 m-5">
      <StreakChart />
      <div className="flex flex-row gap-4 w-full">
        <div className="flex flex-grow min-w-0">
          <MoodAnalytics
            entries={entries}
            selectedPeriod={selectedPeriod}
            onPeriodChange={handlePeriodChange}
          />
        </div>
        <div className="flex flex-grow min-w-0">
          <MoodPieChart
            entries={entries}
            selectedPeriod={selectedPeriod}
            onPeriodChange={handlePeriodChange}
          />
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full">
        <div className="flex flex-grow min-w-0">
          <EmotionGrid selectedPeriod={selectedPeriod} />
        </div>
        <div className="flex flex-grow min-w-0">
          <ThemesGrid selectedPeriod={selectedPeriod} />
        </div>
      </div>
    </div>
  );
}
