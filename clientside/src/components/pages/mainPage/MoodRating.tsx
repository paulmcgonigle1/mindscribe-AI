import React, { useState } from "react";

export default function MoodRating() {
  const [moodRating, setMoodRating] = useState<number | null>(null);

  const handleMoodClick = (rating: number) => {
    setMoodRating(rating);
  };

  return (
    <>
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
    </>
  );
}
