import React, { useState, useEffect } from "react";
import { getAnalysisData } from "../../../../services/JournalService";
import MyTable from "./MyTable";
import { MyAnalysisData } from "../../../../lib/types/types";
import { Column } from "react-table";

interface AnalysisData {
  emotion_mood_correlation: { [key: string]: any };
  theme_mood_correlation: { [key: string]: any };
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!analysisData) {
    return <div>No data available</div>;
  }

  // Convert the emotion_mood_correlation data into an array of objects
  const emotionMoodCorrelationData = Object.keys(
    analysisData.emotion_mood_correlation
  ).map((key) => ({
    emotion: key,
    ...analysisData.emotion_mood_correlation[key],
  }));
  // Convert the theme_mood_correlation data into an array of objects
  const themeMoodCorrelationData: MyAnalysisData[] = Object.keys(
    analysisData.theme_mood_correlation
  ).map((key) => ({
    name: key,
    value: analysisData.theme_mood_correlation[key],
  }));
  // Define columns for the tables
  const columns: Column<MyAnalysisData>[] = [
    {
      Header: "Mood Rating",
      accessor: "name", // Change "emotion" to "name"
    },
    ...(Object.keys(emotionMoodCorrelationData[0])
      .filter((key) => key !== "name") // Exclude the "name" key
      .map((key) => ({
        Header: key,
        accessor: key,
      })) as Column<MyAnalysisData>[]), // Cast the mapped array to the correct type
    // Add more columns as needed
  ];

  return (
    <div>
      <h2>Emotion and Mood Correlation</h2>
      <MyTable columns={columns} data={emotionMoodCorrelationData} />

      <h2>Key Theme Analysis</h2>
      {/* <MyTable columns={columns} data={themeMoodCorrelationData} /> */}

      {/* Render your theme_mood_correlation data here as a table or chart */}
    </div>
  );
};

export default AnalysisDisplay;
