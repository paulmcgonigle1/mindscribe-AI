import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEmotions } from "../../../services/JournalService";
import { EmotionData } from "../../../lib/types/types";
import { HiOutlinePlusCircle } from "react-icons/hi";
import {
  FaFaceGrinBeam,
  FaFaceGrimace,
  FaFaceMeh /* other icons */,
  FaFaceFlushed,
  FaFaceGrinBeamSweat,
  FaFaceRollingEyes,
  FaFaceGrinTongue,
  FaFaceFrownOpen,
  FaFaceLaughSquint,
} from "react-icons/fa6";
import AuthContext from "../../../context/AuthContext";

type EmotionIconMapType = {
  [key: string]: JSX.Element;
};

const emotionIconMap: EmotionIconMapType = {
  happy: <FaFaceGrinBeam className="w-8 h-8 text-yellow-400" />,
  fear: <FaFaceMeh className="w-8 h-8 text-red-400" />,
  pressure: <FaFaceFlushed className="w-8 h-8 text-blue-400" />,
  longing: <FaFaceGrinTongue className="w-8 h-8 text-blue-400" />,
  worry: <FaFaceRollingEyes className="w-8 h-8 text-green-400" />,
  guilt: <FaFaceFrownOpen className="w-8 h-8 text-purple-400" />,
  panic: <FaFaceGrimace className="w-8 h-8 text-purple-400" />,
  excited: <FaFaceLaughSquint className="w-8 h-8 text-sky-400" />,
  default: <FaFaceGrinBeamSweat className="w-8 h-8 text-orange-400" />,
  // Add mappings for other emotions
};

type EmotionGridProps = {
  selectedPeriod: number;
};

function EmotionGrid({ selectedPeriod }: EmotionGridProps) {
  const [emotions, setEmotions] = useState<EmotionData[]>([]);

  const { authTokens } = useContext(AuthContext) ?? {};
  useEffect(() => {
    const fetchEmotions = async () => {
      if (authTokens?.access) {
        try {
          //const userId = 1;
          const userEmotions = await getEmotions(authTokens, selectedPeriod);
          console.log(userEmotions); //this needs to be updated to get entries for the user
          setEmotions(userEmotions);
        } catch (error) {
          console.error("Error fetching emotions: ", error);
        }
      }
    };
    fetchEmotions();
  }, [selectedPeriod]);

  return (
    <div className="flex flex-1 bg-white p-4 rounded-sm border border-gray-200  flex-col ">
      <h1 className="text-xl mb-4 ">Common Emotions</h1>
      <div className="emotion-icons-container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {emotions.map(({ emotion, count }) => (
          <div
            key={emotion}
            className="emotion-item flex flex-col items-center bg-gray-100 p-3 rounded-md shadow"
          >
            <div className={`icon-container ${emotion}-icon`}>
              {emotionIconMap[emotion] || emotionIconMap.default}
            </div>
            <span className="emotion-count text-lg font-semibold">
              {count}{" "}
            </span>
            <span className="emotion-label text-sm text-gray-700">
              {emotion}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmotionGrid;
