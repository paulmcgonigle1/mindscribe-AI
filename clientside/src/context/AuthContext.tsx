import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/api';

interface User {
    id: number;
    email: string;
    username: string;
    first_name?: string;
    last_name?: string;
    is_active: boolean;
    created_at: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: {
        email: string;
        username: string;
        password: string;
        first_name?: string;
        last_name?: string;
    }) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchUser = async () => {
        try {
            const userData = await auth.getMe();
            setUser(userData);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            // If token is invalid, logout
            logout();
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            setIsAuthenticated(true);
            fetchUser().finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            console.log('🔐 AuthContext: Starting login process...');
            
            const response = await auth.login(email, password);
            const { access_token, user: userData } = response;
            
            if (!access_token) {
                throw new Error('No access token received from server');
            }
            
            localStorage.setItem('token', access_token);
            setToken(access_token);
            setUser(userData);
            setIsAuthenticated(true);
            
            console.log('✅ AuthContext: Login successful', { user: userData.email });
        } catch (error: any) {
            console.error('❌ AuthContext: Login failed:', error);
            
            // Create user-friendly error message
            let errorMessage = 'Login failed. Please try again.';
            
            if (error.response?.status === 401) {
                errorMessage = 'Invalid email or password. Please check your credentials.';
            } else if (error.response?.status === 422) {
                errorMessage = 'Please enter valid email and password.';
            } else if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
                errorMessage = 'Cannot connect to server. Please check if the backend is running.';
            } else if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail;
            }
            
            const enhancedError = new Error(errorMessage);
            (enhancedError as any).originalError = error;
            throw enhancedError;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData: {
        email: string;
        username: string;
        password: string;
        first_name?: string;
        last_name?: string;
    }) => {
        try {
            setIsLoading(true);
            console.log('📝 AuthContext: Starting registration process...');
            
            await auth.register(userData);
            console.log('✅ AuthContext: Registration successful, logging in...');
            
            // After successful registration, log the user in
            await login(userData.email, userData.password);
        } catch (error: any) {
            console.error('❌ AuthContext: Registration failed:', error);
            
            // Create user-friendly error message
            let errorMessage = 'Registration failed. Please try again.';
            
            if (error.response?.status === 400) {
                if (error.response.data?.detail?.includes('Email already registered')) {
                    errorMessage = 'This email is already registered. Please use a different email or try logging in.';
                } else if (error.response.data?.detail?.includes('Username already registered')) {
                    errorMessage = 'This username is already taken. Please choose a different username.';
                } else {
                    errorMessage = error.response.data?.detail || 'Registration failed. Please check your information.';
                }
            } else if (error.response?.status === 422) {
                errorMessage = 'Please check all required fields and try again.';
            } else if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
                errorMessage = 'Cannot connect to server. Please check if the backend is running.';
            } else if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail;
            }
            
            const enhancedError = new Error(errorMessage);
            (enhancedError as any).originalError = error;
            throw enhancedError;
        } finally {
            setIsLoading(false);
        }
    };

    const refreshUser = async () => {
        if (token) {
            await fetchUser();
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated,
                isLoading,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
