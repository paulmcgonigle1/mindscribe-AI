import { useState } from "react";

export default function JournalDashboard() {
  const [moodRating, setMoodRating] = useState<number | null>(null);
  const [journalEntry, setJournalEntry] = useState("");

  const handleMoodClick = (rating: number) => {
    setMoodRating(rating);
  };

  const handleJournalChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setJournalEntry(event.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4 w-full">
        <div className="w-1/2">
          <textarea
            className="w-full h-64 p-2 border border-gray-300 rounded-md"
            placeholder="Write your journal entry here..."
            value={journalEntry}
            onChange={handleJournalChange}
          />
        </div>
        <div className="w-1/2">
          <div className="flex flex-col gap-2">
            <div className="text-lg font-medium">Mood Rating</div>
            <div className="flex flex-row gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  className={`w-12 h-12 rounded-full ${
                    moodRating === rating
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                  onClick={() => handleMoodClick(rating)}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full">
        <div className="w-1/2">
          <div className="text-lg font-medium">Stats Summary</div>
          {/* Add your stats summary here */}
        </div>
        <div className="w-1/2">{/* Add any additional components here */}</div>
      </div>
    </div>
  );
}
