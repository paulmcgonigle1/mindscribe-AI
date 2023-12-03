import React, { useState } from "react";

interface MoodRatingProps {
  setParentMoodRating: (rating: number | null) => void; // Function type definition
}

export default function MoodRating({ setParentMoodRating }: MoodRatingProps) {
  const [moodRating, setMoodRating] = useState<number | null>(null);

  const moods = [
    { rating: 1, face: "😢" }, // Awful
    { rating: 2, face: "😟" }, // Bad
    { rating: 3, face: "😐" }, // Meh
    { rating: 4, face: "🙂" }, // Good
    { rating: 5, face: "😄" }, // Amazing
  ];

  const handleMoodClick = (rating: number) => {
    setMoodRating(rating);
    setParentMoodRating(rating); // Update the parent's state
  };

  return (
    <>
      <div className="text-lg font-medium">Mood Rating</div>
      <div className="flex flex-row gap-2">
        {moods.map((mood) => (
          <button
            key={mood.rating}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              moodRating === mood.rating
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
            onClick={() => handleMoodClick(mood.rating)}
          >
            <span className="text-2xl">{mood.face}</span>
          </button>
        ))}
      </div>
    </>
  );
}
