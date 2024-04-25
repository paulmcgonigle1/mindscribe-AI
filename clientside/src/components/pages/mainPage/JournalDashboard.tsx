import { useContext, useEffect, useState } from "react";

import Calendar from "./Calendar";
import {
  createImprovements,
  fetchJournalEntryForToday,
  generateInsightMessageFromBot,
  getSettings,
} from "../../../services/JournalService";
import AuthContext from "../../../context/AuthContext";
import Questionnaire from "../homePage/multi-step-form/page";
import Modal from "../../shared/Modal";
import BotResponse from "./BotResponse";
import JournalEntry from "./JournalEntry";
import Load from "../../../assets/mindscribe2/svg/writer1.svg";

export default function JournalDashboard() {
  // const [moodRating, setMoodRating] = useState<number | null>(null);
  const { authTokens } = useContext(AuthContext) ?? {};
  //this is for handling the first time a user comes on the site to personalize their experience
  const [isPersonalized, setIsPersonalized] = useState(true); // Default to true to avoid flicker
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
  const [hasJournaledToday, setHasJournaledToday] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleCreateImprovements = async () => {
    if (authTokens?.access) {
      try {
        await createImprovements(authTokens);
        console.log("Improvements plan created successfuly:");
      } catch (error) {
        console.error("Error creating improvments  plan:", error);
      }
    }
  };
  const handleJournalSubmit = async () => {
    await fetchMessage();
    setHasJournaledToday(true);
    await handleCreateImprovements();
  };

  // New function to allow journaling again
  const resetJournalState = () => {
    setHasJournaledToday(false);
  };

  useEffect(() => {
    const checkJournalEntryForToday = async () => {
      if (authTokens?.access) {
        const hasEntry = await fetchJournalEntryForToday(authTokens);
        // console.log("The user has journalled today : ", hasEntry);
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
          // console.log("Settings for this user here:", response);
          setIsPersonalized(response.is_personalised);
          if (isPersonalized) {
            console.log("Personalized");
          }
          //control modal based on true or false
          setShowQuestionnaireModal(!response.is_personalised);
        } catch (error) {
          console.error("Error fetching tracked tasks plan:", error);
        }
      }
    };

    fetchUserSettings();
  }, [authTokens]);

  //this needs to be updated to properly handle new message
  const fetchMessage = async () => {
    if (authTokens?.access) {
      try {
        const response = await generateInsightMessageFromBot(authTokens);
        const insightMessage = response.message; // Accessing the message property

        setMessage(insightMessage);
      } catch (error) {
        console.error("Error fetching insights:", error);
      }
    }
  };
  return (
    <div className=" justify-center m-2">
      <div className="flex flex-col gap-6 p-4 ">
        {/* Journal Page Title and Introduction */}
        <div className="flex  items-center justify-center">
          <div className=" bg-rich-green p-8 border  rounded-lg flex flex-col items-center justify-center ">
            <h1 className="text-3xl text-black mb-2 text-left ">Journal </h1>
            <p className="text-lg text-white text-center ">
              Welcome to your personal journaling space. Take a moment to
              reflect on your day, track your mood, and gain insights to foster
              your well-being.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap xl:flex-nowrap gap-4">
          <div className="w-full lg:w-1/2 p-4">
            <JournalEntry
              onJournalSubmit={handleJournalSubmit}
              hasJournaledToday={hasJournaledToday}
              resetJournalState={resetJournalState}
            />
          </div>
          <div className="flex flex-1 m-1  p-4 w-full max-h-[35vh]">
            <Calendar />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6 ">
          <div className="flex-1 max-w-2xl ">
            <BotResponse
              fetchInsightsCallback={fetchMessage}
              message={message}
            />
          </div>
          <div className="hidden xl:block">
            {/* Replace with your image path */}
            <img
              src={Load}
              alt="Descriptive Alt Text"
              className="h-[20vh] m-auto mt-6"
            />
          </div>
        </div>

        <Modal
          isOpen={showQuestionnaireModal}
          onClose={() => setShowQuestionnaireModal(false)}
        >
          <Questionnaire />
        </Modal>
      </div>
    </div>
  );
}
