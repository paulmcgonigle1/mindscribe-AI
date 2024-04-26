// StatsDashboard.js
import { useContext, useEffect, useState } from "react";
import MoodAnalytics from "./MoodSection/MoodAnalytics";
import { getJournals } from "../../../services/JournalService";
import { JournalEntry } from "../../../lib/types/types";
import MoodPieChart from "./MoodPieChart";
import EmotionGrid from "./EmotionGrid";
import ThemesGrid from "./ThemesGrid";
import AuthContext from "../../../context/AuthContext";
import Load from "../../../assets/mindscribe2/svg/load.svg";
import { useNavigate } from "react-router-dom";

export default function StatsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<number>(7); // Default to last 7 days
  const [journals, setJournals] = useState<JournalEntry[]>([]);

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentEntries = async () => {
      if (authContext && authContext.authTokens) {
        try {
          const journals = await getJournals(authContext.authTokens);
          console.log("Received journals:", journals);
          setJournals(journals);
        } catch (error) {
          console.error("Failed to fetch recent entries:", error);
        } finally {
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

  const handleClickNav = () => {
    navigate("/");
  };

  const enoughEntries = journals.length >= 5;

  return (
    <div className="flex flex-col  m-20">
      {!enoughEntries && (
        <div className="absolute top-0 left-0 w-full h-full z-10 opacity-100 flex justify-center items-center">
          <div className="p-8 bg-white rounded-md shadow-lg">
            <h1 className="text-lg font-bold mb-4 text-center text-gray-900">
              Not Enough Data Points
            </h1>
            <p className="text-center text-gray-700">
              You need more journal entries to get statistical insights
            </p>

            <div className="hidden md:block">
              {/* Replace with your image path */}
              <img
                src={Load}
                alt="Descriptive Alt Text"
                className="h-[25vh] m-auto mt-6"
              />
            </div>
            <button
              className="mt-4 px-6 py-3 bg-rich-green text-white font-medium rounded-lg shadow hover:bg-blue-600 "
              onClick={handleClickNav}
            >
              Journal Again
            </button>
          </div>
        </div>
      )}
      <div
        className={`flex ${
          !enoughEntries ? "filter blur-md" : ""
        } flex-wrap -mx-4 w-full`}
      >
        <div className={`flex flex-wrap -mx-4 w-full mb-5`}>
          <div className="w-full xl:w-2/3 px-4 flex min-w-0">
            <MoodAnalytics
              entries={journals}
              selectedPeriod={selectedPeriod}
              onPeriodChange={handlePeriodChange}
            />
          </div>
          <div className="w-full xl:w-1/3  flex min-w-0">
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
    </div>
  );
}
