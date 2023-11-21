export type JournalEntry = {
  entryID: number;
  user: string|number;  
  timestamp: Date;
  content: string;
};

export type NewJournalEntry = {
  user: string | number; // Assuming you only need to send the user ID
  content: string;
};