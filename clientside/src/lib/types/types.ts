export type JournalEntry = {
    entryID: number;
    user: {
      id: string; // or number, depending on your User model
      username: string;
      // include any other fields from the User model that you need
    };
    timestamp: Date;
    content: string;
  };