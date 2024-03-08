import { useContext, useEffect, useState } from "react";
import JournalSection from "./JournalSection";
import MoodRating from "./MoodRating";

import Calendar from "./Calendar";
import { getSettings } from "../../../services/JournalService";
import AuthContext from "../../../context/AuthContext";
import Questionnaire from "../homePage/multi-step-form/page";
import Modal from "../../shared/Modal";
export default function JournalDashboard() {
  const [moodRating, setMoodRating] = useState<number | null>(null);
  const { authTokens } = useContext(AuthContext) ?? {};
  //this is for handling the first time a user comes on the site to personalize their experience
  const [isPersonalized, setIsPersonalized] = useState(true); // Default to true to avoid flicker
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);

  useEffect(() => {
    // fetch settings logic

    const fetchUserSettings = async () => {
      if (authTokens?.access) {
        try {
          const response = await getSettings(authTokens);
          console.log("Settings for this user here:", response);
          setIsPersonalized(response.isPersonalized);
          //control modal based on true or false
          setShowQuestionnaireModal(!response.isPersonalized);
        } catch (error) {
          console.error("Error fetching tracked tasks plan:", error);
        }
      }
    };

    fetchUserSettings();
  }, [authTokens]);
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex md:flex-row gap-6">
        <div className="flex-1 flex">
          <div className="flex-1 w-full">
            <MoodRating setParentMoodRating={setMoodRating} />
            <JournalSection moodRating={moodRating} />
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 md:w-2/3">
          <Calendar />
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
