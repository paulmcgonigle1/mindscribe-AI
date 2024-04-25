// import { useContext, useEffect } from "react";
import { ImprovementData } from "../../../lib/types/types";
// import { getSettings } from "../../../services/JournalService";
// import AuthContext from "../../../context/AuthContext";
import Typewriter from "typewriter-effect";

interface ImprovementsMessageProps {
  improvementData: ImprovementData; // Define the type based on your actual type definitions
}
function Improvements_Message({ improvementData }: ImprovementsMessageProps) {
  // const [settings, setSettings] = useState({
  //   preferred_type: "",
  //   preferred_style: "",
  // });

  // const { authTokens } = useContext(AuthContext) ?? {};

  // useEffect(() => {
  //   // fetch settings logic

  //   const fetchSettings = async () => {
  //     if (authTokens?.access) {
  //       try {
  //         const fetchedsettings = await getSettings(authTokens);
  //         // console.log("Settings for this user:", fetchedsettings);
  //         // setSettings(fetchedsettings);
  //       } catch (error) {
  //         console.error("Error fetching tracked tasks plan:", error);
  //       }
  //     }
  //   };

  //   fetchSettings();
  // }, [authTokens]);
  // Creates a new mental health plan and sets that to the one
  return (
    <div className="flex flex-col rounded-lg p-4 justify-center items-center bg-green-100 flex-grow">
      <div className="w-full flex flex-col justify-center h-full">
        <h1 className="text-center text-3xl font-semibold mb-4">
          Today's Personal Message
        </h1>
        <div className="text-lg text-gray-800 flex flex-col justify-center h-full">
          {improvementData.message ? (
            <Typewriter
              options={{
                strings: improvementData.message,
                autoStart: true,
                delay: 18, // Lower is faster
              }}
            />
          ) : (
            <p className="text-center text-gray-500">No message for today.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Improvements_Message;
