import React, { useState, useEffect } from "react";
import { getAnalysisData } from "../../../../services/JournalService";
import MyTable from "./MyTable";

import EmotionChart from "./MyChart";

// Assuming you have these interfaces for your data
interface EmotionCorrelation {
  emotion: string;
  mood_ratings: { [moodRating: string]: number };
  average_mood_rating: number;
  total_occurrences: number;
}

interface ThemeCorrelation {
  theme: string;
  mood_ratings: { [moodRating: string]: number };
  // ... any other properties you might have
}

interface AnalysisData {
  emotion_mood_correlation: EmotionCorrelation[];
  theme_mood_correlation: ThemeCorrelation[];
}

const AnalysisDisplay: React.FC = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const userId = 1;

  useEffect(() => {
    // Fetch the analysis data from the backend
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getAnalysisData(userId); // Update with your actual endpoint
        if (!data) {
          throw new Error("Network response was not ok");
        }
        setAnalysisData(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [userId]);
  // Check if we have data and if so, prepare it for the chart and table
  const preparedChartData = analysisData?.emotion_mood_correlation.map(
    (item) => ({
      emotion: item.emotion,
      total_occurrences: item.total_occurrences,
    })
  );

  const preparedTableData = analysisData?.emotion_mood_correlation; // Or whatever structure MyTable expects

  // Assuming MyTable is similar to react-table, define your columns
  const preparedColumns = React.useMemo(
    () => [
      {
        Header: "Emotion",
        accessor: "emotion", // accessor is the "key" in the data
      },
      {
        Header: "Total Occurrences",
        accessor: "total_occurrences",
      },
      // Add more columns based on the structure of your data
    ],
    []
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!analysisData) {
    return <div>No data available</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Analysis</h1>
      <EmotionChart data={preparedChartData || []} />
      <MyTable data={preparedTableData || []} columns={preparedColumns} />
    </div>
  );
};

export default AnalysisDisplay;
