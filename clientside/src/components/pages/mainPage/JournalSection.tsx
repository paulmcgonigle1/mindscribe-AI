import React, { useContext, useState } from "react";
import { createEntry } from "../../../services/JournalService";
import { NewJournalEntry } from "../../../lib/types/types";
import AuthContext from "../../../context/AuthContext";

interface JournalSectionProps {
  moodRating: number | null;
  onJournalSubmit: () => void;
}
export default function JournalSection({
  moodRating,
  onJournalSubmit,
}: JournalSectionProps) {
  const [entryText, setEntryText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { authTokens } = useContext(AuthContext) ?? {};

  const handleSubmit = async () => {
    //checks for missing moodRating
    if (!moodRating && moodRating !== 0) {
      alert("Please select a mood rating before submitting your entry");
      return;
    }

    //check for missing entryText
    if (!entryText) {
      alert("Please write a journal entry before submitting");
      return;
    }

    if (entryText && moodRating != null && authTokens?.access) {
      setIsLoading(true);
      try {
        const newEntry: NewJournalEntry = {
          content: entryText,
          moodRating: moodRating,
        };

        const response = await createEntry(authTokens, newEntry);
        console.log("Entry created:", response);
        // Call the createEntry function with the newEntry object
        setEntryText("");
        //now to update the parent that the journal is done
        onJournalSubmit();
      } catch (error) {
        console.error("Error creating journal entry:", error);
      }

      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="w-full">
        <textarea
          className="w-full h-80 p-2 border border-gray-300 rounded-md"
          placeholder="Write your journal entry here..."
          value={entryText}
          onChange={(e) => setEntryText(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="p-2 bg-blue-500 text-white rounded"
          disabled={isLoading} // disable button while loading
        >
          {isLoading ? "Posting..." : "Post Entry"} {/* Conditional text */}
        </button>
      </div>
    </>
  );
}
