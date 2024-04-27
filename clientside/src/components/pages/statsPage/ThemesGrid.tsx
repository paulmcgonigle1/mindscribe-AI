import { useContext, useEffect, useState } from "react";

import { getThemes } from "../../../services/JournalService";
import { ThemeData } from "../../../lib/types/types";
import {
  FaFaceGrinBeamSweat,
  FaGraduationCap,
  FaBed,
  FaHandshake,
  FaClipboard,
  FaPeace,
  FaHeartCircleBolt,
  FaStar,
  FaFire,
  FaHouse,
  FaRocketchat,
  FaFaceSadTear,
  FaBook,
  FaDumbbell,
  FaTree,
  FaListCheck,
  FaComments,
} from "react-icons/fa6";
import AuthContext from "../../../context/AuthContext";

type themeIconMapType = {
  [key: string]: JSX.Element;
};
//this is the ones ive set and a default one for now
const themeIconMap: themeIconMapType = {
  college: <FaGraduationCap className="w-8 h-8 text-yellow-400" />,
  friendship: <FaHandshake className="w-8 h-8 text-red-400" />,
  room: <FaBed className="w-8 h-8 text-green-400" />,
  responsibility: <FaClipboard className="w-8 h-8 text-blue-400" />,
  yoga: <FaPeace className="w-8 h-8 text-blue-400" />,
  teamwork: <FaHeartCircleBolt className="w-8 h-8 text-green-400" />,
  contributing: <FaStar className="w-8 h-8 text-purple-400" />,
  learning: <FaBook className="w-8 h-8 text-purple-400" />,
  perseverance: <FaDumbbell className="w-8 h-8 text-purple-400" />,
  unity: <FaFire className="w-8 h-8 text-sky-400" />,
  house: <FaHouse className="w-8 h-8 text-orange-400" />,
  chatbot: <FaRocketchat className="w-8 h-8 text-sky-400" />,
  nature: <FaTree className="w-8 h-8 text-green-400" />,
  improvement: <FaListCheck className="w-8 h-8 text-blue-400" />,
  loneliness: <FaFaceSadTear className="w-8 h-8 text-pink-400" />,
  communication: <FaComments className="w-8 h-8 text-yellow-400" />,
  default: <FaFaceGrinBeamSweat className="w-8 h-8 text-orange-400" />,

  // Add mappings for other themes
};

type ThemeGridProps = {
  selectedPeriod: number;
};
const excludedThemes = ["n/a", "spirits", "anotherEmotionToExclude"];

function ThemesGrid({ selectedPeriod }: ThemeGridProps) {
  const [themes, setThemes] = useState<ThemeData[]>([]);
  const { authTokens } = useContext(AuthContext) ?? {};

  useEffect(() => {
    const fetchThemes = async () => {
      if (authTokens?.access) {
        try {
          //const userId = 1;
          const userThemes = await getThemes(authTokens, selectedPeriod);
          const validThemes = userThemes.filter(
            (themeData) =>
              !excludedThemes.includes(themeData.theme.toLowerCase())
          );
          console.log(userThemes); //this needs to be updated to get entries for the user
          setThemes(validThemes);
        } catch (error) {
          console.error("Error fetching themes:", error);
        }
      }
    };
    fetchThemes();
  }, [selectedPeriod]);

  //this just displays the common themes as emojis in a nice layout.
  return (
    <div
      className="p-4 rounded-md border shadow-md w-full"
      style={{ backgroundColor: "#f9a827" }}
    >
      <h1 className="text-center text-2xl font-semibold mb-6 text-gray-800">
        Common Themes
      </h1>
      <p className="text-lg mb-4 text-gray-600">
        Here are the most common themes that we found over the last{" "}
        {selectedPeriod} days
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
        {themes.map(({ theme, count }) => (
          <div
            key={theme}
            className="flex flex-col items-center bg-white p-2 rounded-lg shadow hover:shadow-xl transition-shadow duration-300"
          >
            <div className="mb-1 text-2xl">
              {themeIconMap[theme] || themeIconMap.default}
            </div>
            <span className="text-lg font-semibold text-gray-800">{count}</span>
            <span className="text-sm text-gray-700">{theme}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ThemesGrid;
