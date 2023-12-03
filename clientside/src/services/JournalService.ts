import axios from 'axios';
import { JournalEntry, NewJournalEntry, Insight, ImprovementData } from '../lib/types/types';

const BASE_URL = 'http://localhost:8000'; // Replace with the URL of your Django server

export const getRecentEntries = async (): Promise<JournalEntry[]> => {
    const response = await axios.get(`${BASE_URL}/myapp/journal-entries/`);
    return response.data;
  };
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

  export const createMentalHealthPlan = async (userId: number): Promise<ImprovementData> => {
    const response = await axios.get(`${BASE_URL}/myapp/create-plan/${userId}/`);
    return {
      plan: response.data.plan,
      createdAt: response.data.created_at
    };
    
}
export const getMentalHealthPlan = async (userId: number): Promise<ImprovementData> => {
    const response = await axios.get(`${BASE_URL}/myapp/mental-health-plan/${userId}/`);
    return {
      plan: response.data.plan,
      createdAt: response.data.created_at
    };
} 


// Add more functions as needed for other API calls
