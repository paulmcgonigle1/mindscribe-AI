import { useState } from "react";

interface MoodRatingProps {
  setParentMoodRating: (rating: number | null) => void; // Function type definition
}

export default function MoodRating({ setParentMoodRating }: MoodRatingProps) {
  const [moodRating, setMoodRating] = useState<number | null>(null);

  const moods = [
    { rating: 1, face: "😢", label: "awful" }, // Awful
    { rating: 2, face: "😟", label: "Bad" }, // Bad
    { rating: 3, face: "😐", label: "Meh" }, // Meh
    { rating: 4, face: "🙂", label: "Good" }, // Good
    { rating: 5, face: "😄", label: "Amazing" }, // Amazing
  ];
  const handleMoodClick = (rating: number) => {
    setMoodRating(rating);
    setParentMoodRating(rating); // Update the parent's state
  };

  return (
    <>
      <div className="text-lg text-center pb-4">How are you feeling today?</div>
      <div className="flex justify-center gap-4 mb-6">
        {moods.map((mood) => (
          <button
            key={mood.rating}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-150 ease-in-out ${
              moodRating === mood.rating
                ? "bg-blue-500 text-white scale-110"
                : "bg-gray-200 text-gray-500 hover:scale-105"
            }`}
            onClick={() => handleMoodClick(mood.rating)}
            title={mood.label} // Assuming 'mood' has a 'label' property for accessibility
          >
            <span className="text-4xl">{mood.face}</span>
          </button>
        ))}
      </div>
    </>
  );
}
