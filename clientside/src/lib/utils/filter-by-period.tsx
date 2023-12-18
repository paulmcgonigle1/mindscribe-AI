import { JournalEntry } from "../types/types";

export const filterEntriesByPeriod = (
  moodData: JournalEntry[], // Array of JournalEntry
  selectedPeriod: number // Number
): JournalEntry[] => {
  // Returns an array of JournalEntry
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - selectedPeriod + 1);
  startDate.setHours(0, 0, 0, 0);

  return moodData.filter((entry: JournalEntry) => {
    const entryDate = new Date(entry.timestamp);
    return entryDate >= startDate && entryDate <= endDate;
  });
};
