import React, { useState } from "react";
import { createEntry } from "../../../services/JournalService";
import { NewJournalEntry } from "../../../lib/types/types";

interface JournalSectionProps {
  moodRating: number | null;
}
export default function JournalSection({ moodRating }: JournalSectionProps) {
  const [entryText, setEntryText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

    if (entryText && moodRating != null) {
      setIsLoading(true);
      try {
        const newEntry: NewJournalEntry = {
          user: 1, // Provide the user information here
          content: entryText,
          moodRating: moodRating,
        };

        const response = await createEntry(newEntry);
        console.log("Entry created:", response);
        // Call the createEntry function with the newEntry object
        setEntryText("");
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
