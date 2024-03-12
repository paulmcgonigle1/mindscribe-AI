import React, { useContext, useEffect, useState } from "react";
import JournalSection from "./JournalSection";
import MoodRating from "./MoodRating";
import AuthContext from "../../../context/AuthContext";
import { fetchJournalEntryForToday } from "../../../services/JournalService";

function JournalEntry() {
  const [moodRating, setMoodRating] = useState<number | null>(null);
  const [hasJournaledToday, setHasJournaledToday] = useState(false);
  const { authTokens } = useContext(AuthContext) ?? {};

  useEffect(() => {
    const checkJournalEntryForToday = async () => {
      if (authTokens?.access) {
        const hasEntry = await fetchJournalEntryForToday(authTokens);
        console.log("The user has journalled today : ", hasEntry);
        setHasJournaledToday(hasEntry);
      }
    };
    // indicating whether a journal entry has been made for the current day

    checkJournalEntryForToday();
  }, [authTokens]);
  return (
    <div className={`flex-1 w-full ${hasJournaledToday ? "bg-gray-100" : ""}`}>
      {hasJournaledToday ? (
        <div className="text-center p-4">
          <p>You've already journaled for today.</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => setHasJournaledToday(false)}
          >
            Journal Again
          </button>
        </div>
      ) : (
        <>
          <MoodRating setParentMoodRating={setMoodRating} />
          <JournalSection moodRating={moodRating} />
        </>
      )}
    </div>
  );
}

export default JournalEntry;
