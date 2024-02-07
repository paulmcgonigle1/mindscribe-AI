import React, { useEffect, useState } from "react";
import { JournalEntry } from "../../../../lib/types/types";
import { getRecentEntries } from "../../../../services/JournalService";
import MoodStats from "./MoodStats";
import MoodChartBar from "./MoodLineChart";
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
