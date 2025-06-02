import axios from 'axios';

// Use environment variable or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiration and logging
api.interceptors.response.use(
    (response) => {
        console.log(`✅ API Success: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
        return response;
    },
    (error) => {
        // Enhanced error logging
        console.error('❌ API Error Details:', {
            url: error.config?.url,
            method: error.config?.method?.toUpperCase(),
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
            fullError: error
        });

        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            console.warn('🔒 Token expired, redirecting to login');
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

// Auth endpoints
export const auth = {
    login: async (email: string, password: string) => {
        try {
            console.log('🔐 Attempting login for:', email);
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);
            
            const response = await api.post('/auth/login', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            console.log('✅ Login successful');
            return response.data;
        } catch (error: any) {
            console.error('❌ Login failed:', error.response?.data || error.message);
            throw error;
        }
    },
    
    register: async (userData: {
        email: string;
        username: string;
        password: string;
        first_name?: string;
        last_name?: string;
    }) => {
        try {
            console.log('📝 Attempting registration for:', userData.email);
            const response = await api.post('/auth/register', userData);
            console.log('✅ Registration successful');
            return response.data;
        } catch (error: any) {
            console.error('❌ Registration failed:', error.response?.data || error.message);
            throw error;
        }
    },
    
    getMe: async () => {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error: any) {
            console.error('❌ Get user failed:', error.response?.data || error.message);
            throw error;
        }
    },
    
    refresh: async () => {
        try {
            const response = await api.post('/auth/refresh');
            return response.data;
        } catch (error: any) {
            console.error('❌ Token refresh failed:', error.response?.data || error.message);
            throw error;
        }
    },
};

// Journal endpoints
export const journals = {
    create: async (content: string, moodRating: number) => {
        const response = await api.post('/journals/', { content, mood_rating: moodRating });
        return response.data;
    },
    getAll: async () => {
        const response = await api.get('/journals/');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get(`/journals/${id}`);
        return response.data;
    },
    update: async (id: number, data: { content?: string; mood_rating?: number }) => {
        const response = await api.put(`/journals/${id}`, data);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/journals/${id}`);
        return response.data;
    },
    checkToday: async () => {
        const response = await api.get('/journals/check/today');
        return response.data;
    },
};

// Insights endpoints
export const insights = {
    create: async (entryId: number, data: {
        keywords?: string;
        moods?: string;
        sentiment?: string;
        key_themes?: string;
    }) => {
        const response = await api.post('/insights/', { entry_id: entryId, ...data });
        return response.data;
    },
    getForEntry: async (entryId: number) => {
        const response = await api.get(`/insights/entry/${entryId}`);
        return response.data;
    },
    getDaily: async (date: string) => {
        const response = await api.get(`/insights/daily/${date}`);
        return response.data;
    },
};

// Improvements endpoints
export const improvements = {
    create: async (data: {
        message_of_the_day?: string;
        additional_info?: string;
    }) => {
        const response = await api.post('/improvements/', data);
        return response.data;
    },
    getAll: async () => {
        const response = await api.get('/improvements/');
        return response.data;
    },
    createTask: async (data: {
        improvement_id: number;
        content: string;
        explanation?: string;
    }) => {
        const response = await api.post('/improvements/tasks', data);
        return response.data;
    },
    updateTask: async (taskId: number, data: {
        improvement_id: number;
        content: string;
        explanation?: string;
        is_completed?: boolean;
        in_progress?: boolean;
    }) => {
        const response = await api.put(`/improvements/tasks/${taskId}`, data);
        return response.data;
    },
};

// Preferences endpoints
export const preferences = {
    get: async () => {
        const response = await api.get('/preferences/');
        return response.data;
    },
    update: async (data: {
        is_personalised?: boolean;
        preferred_type?: string;
        preferred_style?: string;
        response_type?: string;
        companion_type?: string;
    }) => {
        const response = await api.put('/preferences/', data);
        return response.data;
    },
};

// User endpoints
export const users = {
    getMe: async () => {
        const response = await api.get('/users/me');
        return response.data;
    },
    updateMe: async (data: {
        email?: string;
        username?: string;
        first_name?: string;
        last_name?: string;
        password?: string;
    }) => {
        const response = await api.put('/users/me', data);
        return response.data;
    },
    deleteMe: async () => {
        const response = await api.delete('/users/me');
        return response.data;
    },
};

// Legacy compatibility functions for components that haven't been migrated yet
export const legacy = {
    // Themes endpoint - placeholder until backend implements it
    getThemes: async (days: number) => {
        console.warn('Themes endpoint not implemented in FastAPI backend yet');
        return [];
    },
    
    // Emotions endpoint - placeholder until backend implements it
    getEmotions: async (days: number) => {
        console.warn('Emotions endpoint not implemented in FastAPI backend yet');
        return [];
    },
    
    // Settings endpoint - using preferences for now
    getSettings: async () => {
        const prefs = await preferences.get();
        return {
            preferred_type: prefs.preferred_type || 'motivation',
            preferred_style: prefs.preferred_style || 'insightful',
            is_personalised: prefs.is_personalised || false,
            responseType: prefs.response_type || 'text',
            companionType: prefs.companion_type || 'Companion 1',
        };
    },
    
    updateSettings: async (settings: any) => {
        return await preferences.update({
            preferred_type: settings.preferred_type,
            preferred_style: settings.preferred_style,
            is_personalised: settings.is_personalised,
            response_type: settings.responseType,
            companion_type: settings.companionType,
        });
    },
    
    // Tasks endpoints - placeholder until backend implements it
    getTrackedTasks: async () => {
        console.warn('Tracked tasks endpoint not implemented in FastAPI backend yet');
        return [];
    },
    
    getCompletedTasks: async () => {
        console.warn('Completed tasks endpoint not implemented in FastAPI backend yet');
        return [];
    },
    
    saveTask: async (taskId: number, state: boolean) => {
        console.warn('Save task endpoint not implemented in FastAPI backend yet');
        return {};
    },
    
    updateTaskCompletionStatus: async (taskId: number) => {
        console.warn('Task completion endpoint not implemented in FastAPI backend yet');
        return {};
    },
    
    // Improvements endpoints - placeholder until backend implements it
    getImprovements: async () => {
        console.warn('Get improvements endpoint not implemented in FastAPI backend yet');
        return {
            message: 'Welcome! Complete your first journal entry to get AI-powered improvements.',
            tasks: [],
            createdAt: new Date().toISOString(),
        };
    },
    
    createImprovements: async () => {
        console.warn('Create improvements endpoint not implemented in FastAPI backend yet');
        return {
            message: 'AI improvements coming soon!',
            tasks: [],
            createdAt: new Date().toISOString(),
        };
    },
    
    fetchMessageOfDay: async () => {
        console.warn('Message of day endpoint not implemented in FastAPI backend yet');
        return {
            message: 'Keep journaling! Your mental health journey is important. 🌟'
        };
    },
    
    // Journal compatibility functions
    createEntry: async (authTokens: { access: string }, entry: { content: string; moodRating: number }) => {
        return await journals.create(entry.content, entry.moodRating);
    },
    
    getJournals: async (authTokens: { access: string }) => {
        return await journals.getAll();
    },
    
    fetchJournalEntryForToday: async (authTokens: { access: string }) => {
        try {
            const today = await journals.checkToday();
            return {
                hasEntryForToday: !!today,
                entry: today
            };
        } catch (error) {
            return {
                hasEntryForToday: false,
                entry: null
            };
        }
    },
    
    getInsightForJournalEntry: async (authTokens: { access: string }, entryId: number) => {
        try {
            return await insights.getForEntry(entryId);
        } catch (error) {
            console.warn('Insights not available for entry:', entryId);
            return [];
        }
    },
    
    removeUserData: async (authTokens: { access: string }) => {
        console.warn('Remove user data endpoint not implemented in FastAPI backend yet');
        return;
    },
    
    updatePreferances: async (authTokens: { access: string }, formData: any) => {
        console.warn('Update preferences endpoint not implemented in FastAPI backend yet');
        return formData; // Return the same data for now
    }
};

export default {
    auth,
    journals,
    insights,
    improvements,
    preferences,
    users,
    legacy,
}; 