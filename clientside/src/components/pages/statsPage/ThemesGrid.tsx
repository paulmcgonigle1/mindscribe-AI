import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getThemes } from "../../../services/JournalService";
import { ThemeData } from "../../../lib/types/types";
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
  FaBook,
  FaGraduationCap,
  FaBed,
  FaHandshake,
  FaClipboard,
  FaPeace,
  FaHeartCircleBolt,
  FaStar,
  FaFire,
  FaHouse,
} from "react-icons/fa6";

type themeIconMapType = {
  [key: string]: JSX.Element;
};

const themeIconMap: themeIconMapType = {
  college: <FaGraduationCap className="w-8 h-8 text-yellow-400" />,
  friendship: <FaHandshake className="w-8 h-8 text-red-400" />,
  room: <FaBed className="w-8 h-8 text-green-400" />,
  responsibility: <FaClipboard className="w-8 h-8 text-blue-400" />,
  yoga: <FaPeace className="w-8 h-8 text-blue-400" />,
  teamwork: <FaHeartCircleBolt className="w-8 h-8 text-green-400" />,
  contributing: <FaStar className="w-8 h-8 text-purple-400" />,
  unity: <FaFire className="w-8 h-8 text-sky-400" />,
  house: <FaHouse className="w-8 h-8 text-orange-400" />,
  default: <FaFaceGrinBeamSweat className="w-8 h-8 text-orange-400" />,

  // Add mappings for other themes
};

type ThemeGridProps = {
  selectedPeriod: number;
};

function ThemesGrid({ selectedPeriod }: ThemeGridProps) {
  const [themes, setThemes] = useState<ThemeData[]>([]);

  const userId = 1;
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        //const userId = 1;
        const userThemes = await getThemes(userId, selectedPeriod);
        console.log(userThemes); //this needs to be updated to get entries for the user
        setThemes(userThemes);
      } catch (error) {
        console.error("Error fetching themes:", error);
      }
    };
    fetchThemes();
  }, [selectedPeriod]);

  return (
    <div className="flex flex-1 bg-white p-4 rounded-sm border border-gray-200  flex-col ">
      <h1 className="text-xl mb-4 ">Common themes</h1>
      <div className="theme-icons-container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {themes.map(({ theme, count }) => (
          <div
            key={theme}
            className="theme-item flex flex-col items-center bg-gray-100 p-3 rounded-md shadow"
          >
            <div className={`icon-container ${theme}-icon`}>
              {themeIconMap[theme] || themeIconMap.default}
            </div>
            <span className="theme-count text-lg font-semibold">{count} </span>
            <span className="theme-label text-sm text-gray-700">{theme}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ThemesGrid;
