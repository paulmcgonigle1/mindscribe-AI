import axios from 'axios';
import { JournalEntry, NewJournalEntry, Insight } from '../lib/types/types';

const BASE_URL = 'http://localhost:8000'; // Replace with the URL of your Django server

export const getRecentEntries = async (): Promise<JournalEntry[]> => {
    const response = await axios.get(`${BASE_URL}/myapp/journal-entries/`);
    return response.data;
  };

  export const createEntry = async (entry: NewJournalEntry): Promise<NewJournalEntry> => {
    console.log(entry);
    const response = await axios.post(`${BASE_URL}/myapp/journal-entries/`, entry);
    return response.data;
  };


  export const getInsightbyDay = async (date: string, userId: number): Promise<Insight[]> => {
    const [year, month, day] = date.split('-');
    const response = await axios.get(`${BASE_URL}/myapp/daily-insights/${userId}/${year}/${month}/${day}/`);
    return response.data;
  }
// Add more functions as needed for other API calls
