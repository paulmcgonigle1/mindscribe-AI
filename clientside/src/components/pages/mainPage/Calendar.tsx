import React, { useEffect, useState } from "react";
import { JournalEntry } from "../../../lib/types/types";
import { getRecentEntries } from "../../../services/JournalService";

// Assume this function is available and properly imported
import getDaysArrayForMonth from "../../../lib/utils/get-days-for-month-array";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]; // 0-indexed

const DayPreview = ({ entries }: { entries: JournalEntry[] }) => {
  // This component would render the content of journal entries
  // You could use a simple list, or style it however you prefer
  return (
    <div>
      {entries.map((entry) => (
        <div key={entry.entryID}>
          <p>{entry.content}</p>
        </div>
      ))}
    </div>
  );
};

function Calendar() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const entries = await getRecentEntries();
        console.log("Received entries:", entries);
        setEntries(entries);
      } catch (error) {
        console.error("Failed to fetch recent entries:", error);
      }
    };
    fetchEntries();
  }, []);

  // Placeholder function to simulate getting day data
  // In practice, you would replace this with actual data fetching logic
  // Find journal entries for a particular day
  const getDayData = (date: Date) => {
    return entries.filter(
      (entry) =>
        new Date(entry.timestamp).toDateString() === date.toDateString()
    );
  };
  const daysArray = getDaysArrayForMonth(new Date());
  const DayPreview = ({ entries }: { entries: JournalEntry[] }) => {
    // Renders a preview of entries for a day
    return (
      <div className="absolute bg-white shadow-lg rounded px-4 py-2 -mt-20">
        {entries.map((entry) => (
          <div key={entry.entryID}>
            <p>{entry.content}</p>
          </div>
        ))}
      </div>
    );
  };
  const moodsEmojiMap: { [key: number]: string } = {
    1: "😢", // Awful
    2: "😟", // Bad
    3: "😐", // Meh
    4: "🙂", // Good
    5: "😄", // Amazing
  };

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-7 gap-1 bg-white p-4">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-center font-bold uppercase text-gray-600"
          >
            {day}
          </div>
        ))}
        {daysArray.map((day: Date, index: number) => {
          const dayEntries = getDayData(day);
          return (
            <div
              key={index}
              onMouseEnter={() => setHoveredDate(day)}
              onMouseLeave={() => setHoveredDate(null)}
              onClick={() => {
                /* handle day click */
              }}
              className={`h-20 border border-gray-300 rounded flex justify-center items-center ${
                dayEntries.length > 0 ? "bg-blue-200" : "bg-gray-100"
              }`}
            >
              {day.getDay()}
              {dayEntries.length > 0 && moodsEmojiMap[dayEntries[0].moodRating]}
              {hoveredDate &&
                day.toDateString() === hoveredDate.toDateString() && (
                  <DayPreview entries={dayEntries} />
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;
