import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from "./components/shared/Layout";
import JournalDashboard from "./components/pages/mainPage/JournalDashboard";
import StatsDashboard from "./components/pages/statsPage/StatsDashboard";
import ImprovementsDashboard from "./components/pages/improvementsPage/ImprovementsDashboard";
import HomePage from "./components/pages/homePage/HomePage";
import LoginPage from "./components/pages/homePage/LoginPage";
import RegisterPage from "./components/pages/homePage/RegisterPage";
import Settings from "./components/pages/settingsPage/Settings";
import SignupPage from "./components/pages/homePage/SignupPage";
import TrackTasks from "./components/pages/trackTasksPage/TrackTasks";
import DebugPanel from "./components/DebugPanel";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white">Loading...</p>
                </div>
            </div>
        );
    }
    
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/sign-up" element={<SignupPage />} />
                    <Route path="/home" element={<HomePage />} />

                    {/* Protected routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<JournalDashboard />} />
                        <Route path="statistics" element={<StatsDashboard />} />
                        <Route path="improvements" element={<ImprovementsDashboard />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="track-tasks" element={<TrackTasks />} />
                    </Route>

                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                
                {/* Debug panel for development */}
                <DebugPanel />
            </Router>
        </AuthProvider>
    );
};

export default App;
