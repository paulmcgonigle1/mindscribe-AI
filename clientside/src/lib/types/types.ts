export type JournalEntry = {
  entryID: number;
  user: string|number;  
  timestamp: Date;
  content: string;
  moodRating: number;
};

export type NewJournalEntry = {
  user: string | number; // Assuming you only need to send the user ID
  content: string;
  moodRating: number; 
};


export type Insight = {
  insightID: number;
  userID: number; // Assuming you want to track the user associated with the insight
  timestamp: string; // The date and time when the insight was created

  // New properties corresponding to the updated Django model
  moods: string | null;
  sentiment: string | null;
  keywords: string | null;
  key_themes: string | null;  
};

export type  ImprovementData = {
  message: string;
  tasks: string[];

  createdAt: string | null;
}

export type MoodChartData = {
  date: string;
  moodRating: number;
} 

export type EmotionData = { 
  emotion: string;
  count: number;
}
export type ThemeData = { 
  theme: string;
  count: number;
}
export type EmotionCorrelation = {
  emotion: string;
  mood_ratings: { [moodRating: string]: number };
  average_mood_rating: number;
  total_occurrences: number;
};

export type ThemeCorrelation = {
  theme: string;
  mood_ratings: { [moodRating: string]: number };
  // ... any other properties you might have
};

// In your types file

export type MyAnalysisData = {
  name: string;
  value: number;
  // Add more properties as needed
};