import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEmotions } from "../../../services/JournalService";
import { EmotionData } from "../../../lib/types/types";
import { HiOutlinePlusCircle } from "react-icons/hi";
function EmotionGrid() {
  const [emotions, setEmotions] = useState<EmotionData[]>([]);

  const userId = 1;
  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        //const userId = 1;
        const userEmotions = await getEmotions(userId);
        console.log(userEmotions); //this needs to be updated to get entries for the user
        setEmotions(userEmotions);
      } catch (error) {
        console.error("Error fetching emotions:", error);
      }
    };
    fetchEmotions();
  }, []);

  return (
    <div className="emotion-grid">
      <h1 className="text-xl ">Common Emotions</h1>
      <div className="emotion-icons-container">
        {emotions.map(({ emotion, count }) => (
          <div key={emotion} className="emotion-item">
            {/* <img
              src={emotionsIconMap[emotion] || emotionsIconMap.default}
              alt={emotion}
              className="emotion-icon"
            /> */}
            <HiOutlinePlusCircle className="emotion-icon" />
            <span className="emotion-count">{count}</span>
            <span className="emotion-label">{emotion}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmotionGrid;
