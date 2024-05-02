import { useContext, useEffect, useState } from "react";
import { getEmotions } from "../../../services/JournalService";
import { EmotionData } from "../../../lib/types/types";
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
  FaFaceSadTear,
  FaFaceTired,
  FaFaceMehBlank,
  FaFaceFrown,
  FaRegFaceFlushed,
  FaFaceLaugh,
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
  loneliness: <FaFaceSadTear className="w-8 h-8 text-pink-400" />,
  overwhelmed: <FaFaceFrownOpen className="w-8 h-8 text-brown-400" />,
  discouraged: <FaFaceGrimace className="w-8 h-8 text-brown-400" />,
  energized: <FaFaceLaughSquint className="w-8 h-8 text-sky-400" />,
  frustrated: <FaFaceTired className="w-8 h-8 text-brown-400" />,
  disappointed: <FaFaceMehBlank className="w-8 h-8 text-red-400" />,
  down: <FaFaceFrown className="w-8 h-8 text-yellow-400" />,
  stressed: <FaRegFaceFlushed className="w-8 h-8 text-pink-400" />,
  grateful: <FaFaceLaugh className="w-8 h-8 text-blue-400" />,
  content: <FaFaceGrinBeamSweat className="w-8 h-8 text-green-600" />,

  default: <FaFaceGrinBeamSweat className="w-8 h-8 text-orange-400" />,

  // Add mappings for other emotions
};

type EmotionGridProps = {
  selectedPeriod: number;
};
const excludedEmotions = ["n/a", "spirits", "anotherEmotionToExclude"];

function EmotionGrid({ selectedPeriod }: EmotionGridProps) {
  const [emotions, setEmotions] = useState<EmotionData[]>([]);

  const { authTokens } = useContext(AuthContext) ?? {};
  useEffect(() => {
    const fetchEmotions = async () => {
      if (authTokens?.access) {
        try {
          //const userId = 1;
          const userEmotions = await getEmotions(authTokens, selectedPeriod);

          const validEmotions = userEmotions.filter(
            (emotionData) =>
              !excludedEmotions.includes(emotionData.emotion.toLowerCase())
          );

          console.log(userEmotions); //this needs to be updated to get entries for the user
          setEmotions(validEmotions);
        } catch (error) {
          console.error("Error fetching emotions: ", error);
        }
      }
    };
    fetchEmotions();
  }, [selectedPeriod]);

  return (
    <div className="flex flex-1 bg-green-100 p-4 rounded-md border border-gray-200 shadow-lg flex-col h-full">
      <h1 className="text-center text-2xl font-semibold mb-6 text-gray-800">
        Common Emotions
      </h1>
      <p className="text-lg mb-4 text-gray-600">
        Here are the most common emotions that we found over the last{" "}
        {selectedPeriod} days
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
        {emotions.map(({ emotion, count }) => (
          <div
            key={emotion}
            className="flex flex-col items-center bg-white p-2 rounded-lg shadow hover:shadow-xl transition-shadow duration-300"
          >
            <div className="mb-1 text-2xl">
              {emotionIconMap[emotion] || emotionIconMap.default}
            </div>
            <span className="text-lg font-semibold text-gray-800">{count}</span>
            <span className="text-sm text-gray-700">{emotion}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmotionGrid;
