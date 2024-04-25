import { JournalEntry } from "../../../../lib/types/types";
import MoodStats from "./MoodStats";
import MoodChartBar from "./MoodLineChart";
import Load from "../../../../assets/mindscribe2/svg/serverdown.svg";

interface MoodStatsProps {
  entries: JournalEntry[];
  selectedPeriod: number;
  onPeriodChange: (newPeriod: number) => void;
}
function MoodAnalytics({
  entries,
  selectedPeriod,
  onPeriodChange,
}: MoodStatsProps) {
  const enoughEntries = entries.length >= 5;

  // if (!enoughEntries) {
  //   return (
  //     <div className="flex flex-1 items-center justify-center bg-white p-4 rounded-sm border border-gray-200 flex-col">
  //       <h1 className="text-lg mb-20">Mood Chart</h1>
  //       <div className="items-center text-center">
  //         <div className="text-red-500">
  //           You need at least 5 journal entries to display the mood chart.
  //         </div>
  // <div className="hidden md:block">
  //   {/* Replace with your image path */}
  //   <img
  //     src={Load}
  //     alt="Descriptive Alt Text"
  //     className="h-[25vh] mx-auto mb-auto"
  //   />
  // </div>
  //       </div>
  //     </div>
  //   );
  // }
  return (
    <div className="bg-white shadow rounded-lg p-4 flex-1">
      <MoodStats
        entries={entries}
        selectedPeriod={selectedPeriod}
        onPeriodChange={onPeriodChange}
      />
      <MoodChartBar
        entries={entries}
        selectedPeriod={selectedPeriod}
        onPeriodChange={onPeriodChange}
      />
    </div>
  );
}

export default MoodAnalytics;
