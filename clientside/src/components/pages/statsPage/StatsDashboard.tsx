import { useContext, useEffect, useState } from "react";

import MoodAnalytics from "./MoodSection/MoodAnalytics";
import { getJournals } from "../../../services/JournalService";
import { JournalEntry } from "../../../lib/types/types";
import MoodPieChart from "./MoodPieChart";
import EmotionGrid from "./EmotionGrid";
import ThemesGrid from "./ThemesGrid";
import AuthContext from "../../../context/AuthContext";

export default function StatsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<number>(7); // Default to last 7 days
  const [journals, setJournals] = useState<JournalEntry[]>([]);

  const authContext = useContext(AuthContext);

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

  const handlePeriodChange = (newPeriod: number) => {
    setSelectedPeriod(newPeriod);
  };

  return (
    <div className="flex flex-col gap-4 m-5">
      <div className="flex flex-wrap -mx-4 w-full">
        <div className="w-full xl:w-2/3 px-4 flex min-w-0">
          <MoodAnalytics
            entries={journals}
            selectedPeriod={selectedPeriod}
            onPeriodChange={handlePeriodChange}
          />
        </div>
        <div className="w-full xl:w-1/3 px-4 flex min-w-0">
          <MoodPieChart
            entries={journals}
            selectedPeriod={selectedPeriod}
            onPeriodChange={handlePeriodChange}
          />
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full">
        <div className="flex flex-grow ">
          <EmotionGrid selectedPeriod={selectedPeriod} />
        </div>
        <div className="flex flex-grow ">
          <ThemesGrid selectedPeriod={selectedPeriod} />
        </div>
      </div>
    </div>
  );
}
