import { useContext, useEffect, useState } from "react";

import Calendar from "./Calendar";
import {
  fetchJournalEntryForToday,
  getSettings,
} from "../../../services/JournalService";
import AuthContext from "../../../context/AuthContext";
import Questionnaire from "../homePage/multi-step-form/page";
import Modal from "../../shared/Modal";
import BotResponse from "./BotResponse";
import JournalEntry from "./JournalEntry";
export default function JournalDashboard() {
  const [moodRating, setMoodRating] = useState<number | null>(null);
  const { authTokens } = useContext(AuthContext) ?? {};
  //this is for handling the first time a user comes on the site to personalize their experience
  const [isPersonalized, setIsPersonalized] = useState(true); // Default to true to avoid flicker
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
  const [hasJournaledToday, setHasJournaledToday] = useState(false);
  const handleJournalSubmit = () => {
    setHasJournaledToday(true);
  };

  // New function to allow journaling again
  const resetJournalState = () => {
    setHasJournaledToday(false);
  };

  useEffect(() => {
    const checkJournalEntryForToday = async () => {
      if (authTokens?.access) {
        const hasEntry = await fetchJournalEntryForToday(authTokens);
        console.log("The user has journalled today : ", hasEntry);
        setHasJournaledToday(hasEntry.journal_exists);
      }
    };
    // indicating whether a journal entry has been made for the current day

    checkJournalEntryForToday();
  }, [authTokens]);
  useEffect(() => {
    // fetch settings logic

    const fetchUserSettings = async () => {
      if (authTokens?.access) {
        try {
          const response = await getSettings(authTokens);
          console.log("Settings for this user here:", response);
          setIsPersonalized(response.is_personalised);
          //control modal based on true or false
          setShowQuestionnaireModal(!response.is_personalised);
        } catch (error) {
          console.error("Error fetching tracked tasks plan:", error);
        }
      }
    };

    fetchUserSettings();
  }, [authTokens]);
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-wrap md:flex-nowrap gap-6">
        <div className="flex flex-1 md:w-1/2">
          <div className="flex-1 w-full p-4 min-h-full">
            <JournalEntry
              onJournalSubmit={handleJournalSubmit}
              hasJournaledToday={hasJournaledToday}
              resetJournalState={resetJournalState}
            />
          </div>
          <div className="flex flex-1 md:w-1/2">
            <Calendar />
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 md:w-2/3">
          <BotResponse />
          {/* <Calendar /> */}
          {/* <RecentJournals /> */}
        </div>
      </div>
      <Modal
        isOpen={showQuestionnaireModal}
        onClose={() => setShowQuestionnaireModal(false)}
      >
        <Questionnaire />
      </Modal>
    </div>
  );
}
