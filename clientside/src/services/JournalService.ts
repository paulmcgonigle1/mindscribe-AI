import axios from 'axios';
import { JournalEntry, NewJournalEntry, Insight, ImprovementData, EmotionData, ThemeData, MyAnalysisData } from '../lib/types/types';

const BASE_URL = 'http://localhost:8000'; // Replace with the URL of your Django server

export const getRecentEntries = async (): Promise<JournalEntry[]> => {
    const response = await axios.get(`${BASE_URL}/myapp/journal-entries/`);
    return response.data;
  };

  export const getJournals = async (authTokens:{access:string}):Promise<JournalEntry[]> => {
    const response = await axios.get(`${BASE_URL}/myapp/api/journals/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens.access}`, // Use template literal for proper spacing
      }
    })
    return response.data
  }

  export const getInsightForJournalEntry = async (entryId: number): Promise<Insight[]> => {
    const response = await axios.get(`${BASE_URL}/myapp/journal-entries/${entryId}/insights/`);
    return response.data;
  }
  export const getEntriesByUser = async (userId: number): Promise<JournalEntry[]> => {
    const response = await axios.get(`${BASE_URL}/myapp/journal-entries/${userId}/`);
    return response.data;
  }

  export const createEntry = async (entry: NewJournalEntry): Promise<NewJournalEntry> => {
    const response = await axios.post(`${BASE_URL}/myapp/journal-entries/`, entry);
    return response.data;
  };


  export const getInsightbyDay = async (date: string, userId: number): Promise<Insight[]> => {
    const [year, month, day] = date.split('-');
    const response = await axios.get(`${BASE_URL}/myapp/daily-insights/${userId}/${year}/${month}/${day}/`);
    return response.data;
  }

  export const createImprovements = async (userId: number): Promise<ImprovementData> => {
    const response = await axios.get(`${BASE_URL}/myapp/create-improvements/${userId}/`);
    return {
      message: response.data.message,
        tasks: response.data.tasks,
        createdAt: response.data.createdAt,
    };
    
}
export const getImprovements = async (userId: number): Promise<ImprovementData> => {
    const response = await axios.get(`${BASE_URL}/myapp/get-improvements/${userId}/`);
    return {
        message: response.data.message,
        tasks: response.data.tasks,
        createdAt: response.data.createdAt,
    };
} 

export const getEmotions = async (userId: number, days: number): Promise<EmotionData[]> => {
    const response = await axios.get(`${BASE_URL}/myapp/emotions/${userId}/?days=${days}`);  
    return response.data;
}   
export const getThemes = async (userId: number, days: number): Promise<ThemeData[]> => {
  const response = await axios.get(`${BASE_URL}/myapp/themes/${userId}/?days=${days}`);  
  return response.data;
}   

export const getAnalysisData = async (userId: number): Promise<MyAnalysisData> => {
  const response = await axios.get(`${BASE_URL}/myapp/analyze-data/${userId}/`);
  return response.data;
}

// Add more functions as needed for other API calls
