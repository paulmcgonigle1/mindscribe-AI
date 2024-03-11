import { useContext, useEffect, useState } from "react";
import { ImprovementData } from "../../../lib/types/types";
import { getSettings } from "../../../services/JournalService";
import AuthContext from "../../../context/AuthContext";

interface ImprovementsMessageProps {
  improvementData: ImprovementData; // Define the type based on your actual type definitions
}
function Improvements_Message({ improvementData }: ImprovementsMessageProps) {
  const [settings, setSettings] = useState({
    preferred_type: "",
    preferred_style: "",
  });

  const { authTokens } = useContext(AuthContext) ?? {};

  useEffect(() => {
    // fetch settings logic

    const fetchSettings = async () => {
      if (authTokens?.access) {
        try {
          const fetchedsettings = await getSettings(authTokens);
          console.log("Settings for this user:", fetchedsettings);
          setSettings(fetchedsettings);
        } catch (error) {
          console.error("Error fetching tracked tasks plan:", error);
        }
      }
    };

    fetchSettings();
  }, [authTokens]);
  // Creates a new mental health plan and sets that to the one
  return (
    <div className="relative border border-stone-400 bg-white shadow-lg rounded-lg overflow-hidden mx-auto max-w-xl">
      <div className="py-4 px-6 bg-indigo-600 text-white">
        <h1 className="text-center text-xl font-semibold">Today's Message</h1>
        <h2 className="text-center">
          A {settings.preferred_style} {settings.preferred_type} -- based on
          your preferences
        </h2>
      </div>
      {improvementData.message ? (
        <div className="p-6">
          <p className="text-gray-700 text-justify leading-relaxed">
            {improvementData.message}
          </p>
          {improvementData.createdAt && (
            <p className="text-center text-xs mt-4 text-gray-500">
              Based on entry from:{" "}
              {new Date(improvementData.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
      ) : (
        <p className="p-6 text-center text-gray-500">No message for today.</p>
      )}
    </div>
  );
}

export default Improvements_Message;
