import React, { useState, useEffect } from "react";
import { getInsightbyDay } from "../../../services/JournalService";
import { Insight } from "../../../lib/types/types";

const Summary = () => {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    const formattedDate = `${selectedDay.getFullYear()}-${
      selectedDay.getMonth() + 1
    }-${selectedDay.getDate()}`;
    fetchInsights(formattedDate);
  }, [selectedDay]);

  const fetchInsights = async (date: string) => {
    try {
      const userId = 1;
      const insightsData = await getInsightbyDay(date, userId);
      setInsights(insightsData);
    } catch (error) {
      console.error("Error fetching insights:", error);
    }
  };

  const changeDay = (amount: number) => {
    setSelectedDay((prevDay) => {
      const newDate = new Date(prevDay);
      newDate.setDate(newDate.getDate() + amount);
      return newDate;
    });
  };

  return (
    <div className="flex flex-col max-h-60 items-center justify-center space-y-4 mb-8 ">
      <div className="flex space-x-2">
        <button
          onClick={() => changeDay(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Previous
        </button>
        <span className="text-xl font-bold">{selectedDay.toDateString()}</span>
        <button
          onClick={() => changeDay(1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
      <div className="w-full max-w-2xl max-h-64 overflow-auto bg-white rounded shadow-md p-4 border border-gray-300">
        {insights.length > 0 ? (
          insights.map((insight: Insight, index: number) => (
            <div key={index} className="border-b last:border-b-0 py-2">
              <p className="text-sm text-gray-800">
                <strong>Moods:</strong> {insight.moods || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Sentiment:</strong> {insight.sentiment || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Keywords:</strong> {insight.keywords || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Themes:</strong> {insight.key_themes || "N/A"}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            No insights available for this day
          </div>
        )}
      </div>
    </div>
  );
};

export default Summary;
