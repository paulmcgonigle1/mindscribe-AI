import React, { useState } from "react";
import { createEntry } from "../../../services/JournalService";
import { NewJournalEntry } from "../../../lib/types/types";
export default function JournalSection() {
  const [entryText, setEntryText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async () => {
    if (entryText) {
      setIsLoading(true);
      try {
        const newEntry: NewJournalEntry = {
          user: 1, // Provide the user information here
          content: entryText,
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
      <div className="w-1/2">
        <textarea
          className="w-full h-64 p-2 border border-gray-300 rounded-md"
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
