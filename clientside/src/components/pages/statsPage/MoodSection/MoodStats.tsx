import { JournalEntry } from "../../../../lib/types/types";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";
// import { Label } from "recharts";

// Helper function to calculate average mood
function calculateAverageMood(entries: JournalEntry[]) {
  const moodSum = entries.reduce((acc, entry) => acc + entry.moodRating, 0);
  return moodSum / entries.length || 0; // Avoid division by zero
}

interface MoodStatsProps {
  entries: JournalEntry[];
  selectedPeriod: number;
  onPeriodChange: (newPeriod: number) => void;
}

const timePeriods = [
  { value: 7, label: "Last 7 Days" },
  { value: 30, label: "Last 30 Days" },
  { value: 90, label: "Last 3 Months" },
  { value: 365, label: "Last Year" },
];

function MoodStats({
  entries,
  selectedPeriod,
  onPeriodChange,
}: MoodStatsProps) {
  const averageMood = calculateAverageMood(entries);
  const selectedTimePeriod = timePeriods.find(
    (period) => period.value === selectedPeriod
  );

  return (
    <div className="flex flex-col mb-2 space-y-4 relative">
      {" "}
      {/* Added relative class */}
      <h1 className="text-xl font-semibold">Mood Over Time</h1>
      <div>
        <Listbox value={selectedPeriod} onChange={onPeriodChange}>
          {() => (
            <>
              <Listbox.Label className="text-sm font-medium">
                Select Period:
              </Listbox.Label>
              <div className="mt-1 relative">
                <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <span className="block truncate">
                    {selectedTimePeriod?.label}
                  </span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    {/* Icon */}
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm z-10">
                    {" "}
                    {/* Added z-10 class */}
                    {timePeriods.map((period) => (
                      <Listbox.Option
                        key={period.value}
                        className={({ active }) =>
                          `cursor-default select-none relative py-2 pl-10 pr-4 ${
                            active
                              ? "text-indigo-900 bg-indigo-100"
                              : "text-gray-900"
                          }`
                        }
                        value={period.value}
                      >
                        {period.label}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>
      </div>
      <div>
        <h2 className="text-sm font-medium text-fuchsia-600">
          Average Mood Rating: {averageMood.toFixed(2)}
        </h2>
        {/* Here you can add your chart visualization */}
      </div>
    </div>
  );
}

export default MoodStats;
