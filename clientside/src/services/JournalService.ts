import axios from 'axios';
import { JournalEntry, NewJournalEntry, Insight, ImprovementData, EmotionData, ThemeData, MyAnalysisData, Task, Settings, Preferences, JournalResponse, MessageData } from '../lib/types/types';

const BASE_URL = 'http://localhost:8000'; // Replace with the URL of your Django server



export const createEntry = async (authTokens: { access: string }, entry: NewJournalEntry): Promise<NewJournalEntry> => {
  const response = await axios.post(`${BASE_URL}/myapp/api/createjournal/`, entry, {
    headers:{
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authTokens.access}`, // Include the Authorization header
    }
  });
  return response.data;
};
//this gets the common themes for the logged user
export const getThemes = async (authTokens: { access: string }, days: number): Promise<ThemeData[]> => {
  const response = await axios.get(`${BASE_URL}/myapp/themes/?days=${days}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authTokens.access}`, 
    }
  });  
  return response.data;
}   
export const getEmotions = async (authTokens: { access: string }, days: number): Promise<EmotionData[]> => {
  const response = await axios.get(`${BASE_URL}/myapp/emotions/?days=${days}`,{
    headers:{
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authTokens.access}`, 
    }
  });  
  return response.data;
}   
export const saveTask = async (authTokens: { access: string }, taskId: number, state: boolean): Promise<any> => {
  // Assuming you want to set the inProgress status to true for this task
  const response = await axios.patch(`${BASE_URL}/myapp/api/savetask/${taskId}/`, {
    inProgress: state,
  },{
    headers:{
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authTokens.access}`, 
    }
  });  
  return response.data;
};
//set to complete
export const updateTaskCompletionStatus = async (authTokens: { access: string }, taskId: number): Promise<any> => {
  // Assuming you want to set the inProgress status to true for this task
  const response = await axios.patch(`${BASE_URL}/myapp/api/complete-task/${taskId}/`, {
    isCompleted: true,
  },{
    headers:{
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authTokens.access}`, 
    }
  });  
  return response.data;
};
// export const archiveOrRemoveTask = async (authTokens: { access: string }, taskId: number): Promise<any> => {
//create new improvemetns
export const createImprovements = async (authTokens: { access: string }): Promise<ImprovementData> => {
  try {
    const response = await axios.get(`${BASE_URL}/myapp/create-improvements/`,  { // Note the method change to POST
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens.access}`,
      }
    });
    
    return {
    
      message: response.data.message,
      tasks: response.data.tasks,
      createdAt: response.data.createdAt,
    };
  } catch (error) {
    // Log error or handle it as needed
    console.error("Failed to create improvements:", error);
    throw new Error("Error creating improvements");
  }
};
export const fetchMessageOfDay = async (authTokens: { access: string }): Promise<MessageData> => {
  try {
    const response = await axios.get(`${BASE_URL}/myapp/create-message/`,  {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens.access}`,
      }
    });

    return {
      message: response.data.message
    };
  } catch (error) {
    console.error("Failed to fetch message of the day:", error);
    throw new Error("Error fetching message of the day");
  }
};
export const removeUserData = async (authTokens:{ access: string }): Promise<void> => {
  await axios.get(`${BASE_URL}/myapp/delete-user/`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authTokens.access}`,
    }
  });
}
 
export const getImprovements = async (authTokens: { access: string }): Promise<ImprovementData> => {
  const response = await axios.get(`${BASE_URL}/myapp/get-improvements/`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authTokens.access}`, 
    }
  });
  return {
      message: response.data.message,
      tasks: response.data.tasks,
      createdAt: response.data.createdAt,
  };
} 
export const getSettings = async (authTokens: { access: string }): Promise<Settings> => {
  const response = await axios.get(`${BASE_URL}/myapp/settings/`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authTokens.access}`, 
    }
  });
  return {
    preferred_type: response.data.preferred_type,
    preferred_style: response.data.preferred_style,
    is_personalised: response.data.is_personalised,
    responseType: response.data.responseType,
    companionType: response.data.companionType,
  };
} 
//for updating our settings at the moment
export const updateSettings = async (authTokens: { access: string }, newSettings:Settings): Promise<Settings> => {
  const response = await axios.patch(`${BASE_URL}/myapp/settings/`, newSettings, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authTokens.access}`, 
    }
  });
  return {
    preferred_type: response.data.preferred_type,
    preferred_style: response.data.preferred_style,
    is_personalised: response.data.is_is_personalised,
    responseType: response.data.responseType,
    companionType: response.data.companionType,
  };
} 

export const updatePreferances= async (authTokens: { access: string }, newPreferences:Preferences): Promise<Preferences> => {
  console.log(newPreferences)
 const response = await axios.patch(`${BASE_URL}/myapp/preferences/`, newPreferences, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authTokens.access}`, 
  }
 });
 return {

  firstName: response.data.firstName,
    lastName: response.data.lastName,
    preferred_type: response.data.preferred_type,
    preferred_style: response.data.preferred_style,
    responseType: response.data.responseType,
    agreeToTerms: response.data.is_personalised

 }}

export const getTrackedTasks = async (authTokens: { access: string }): Promise<Task[]> => {
  
  const response = await axios.get(`${BASE_URL}/myapp/get-tracked-tasks/`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authTokens.access}`, 
    }
  });
  console.log(response)
  return response.data;
  
} 
export const getCompletedTasks = async (authTokens: { access: string }): Promise<Task[]> => {
  
  const response = await axios.get(`${BASE_URL}/myapp/get-completed-tasks/`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authTokens.access}`, 
    }
  });
  console.log(response)
  return response.data;
  
} 

//get all of the journals for the user
  export const getJournals = async (authTokens:{access:string}):Promise<JournalEntry[]> => {
    const response = await axios.get(`${BASE_URL}/myapp/api/journals/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens.access}`, // Use template literal for proper spacing
      }
    })
    if (response.status === 401) {
      // You could throw a specific error for this case
      throw new Error('Unauthorized');
    } else if (response.status !== 200) {
      throw new Error(`Received non-200 status code: ${response.status}`);
    }
    return response.data;
  }
  //get all of the journals for the user
  export const fetchJournalEntryForToday = async (authTokens:{access:string}):Promise<JournalResponse> => {
    const response = await axios.get(`${BASE_URL}/myapp/api/check_journal_for_today/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens.access}`, // Use template literal for proper spacing
      }
    })
    if (response.status === 401) {
      // You could throw a specific error for this case
      throw new Error('Unauthorized');
    } else if (response.status !== 200) {
      throw new Error(`Received non-200 status code: ${response.status}`);
    }
    return response.data;
  }


  export const getInsightForJournalEntry = async (authTokens: { access: string }, entryId: number): Promise<Insight[]> => {
    const response = await axios.get(`${BASE_URL}/myapp/journal-entries/${entryId}/insights/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens.access}`, // Include the Authorization header
      }
    });
    return response.data;
  };
  //getting insight message for the user to display it in front-end from the bot
  export const generateInsightMessageFromBot = async (authTokens: { access: string }): Promise<{message:string}> => {
    const response = await axios.get(`${BASE_URL}/myapp/api/createInsightMessage/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens.access}`, // Include the Authorization header
      }
    });
    console.log("API Response:", response); // Temporary logging for debugging

    
    return response.data;
  };
  
 

  export const getInsightbyDay = async (date: string, userId: number): Promise<Insight[]> => {
    const [year, month, day] = date.split('-');
    const response = await axios.get(`${BASE_URL}/myapp/daily-insights/${userId}/${year}/${month}/${day}/`);
    return response.data;
  }

 



export const getAnalysisData = async (userId: number): Promise<MyAnalysisData> => {
  const response = await axios.get(`${BASE_URL}/myapp/analyze-data/${userId}/`);
  return response.data;
}
