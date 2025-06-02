import React, { useState, useEffect } from 'react';
import { FiWifi, FiWifiOff, FiServer, FiCheck, FiX } from 'react-icons/fi';

const DebugPanel: React.FC = () => {
    const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
    const [lastCheck, setLastCheck] = useState<Date>(new Date());

    const checkBackendStatus = async () => {
        try {
            const response = await fetch('http://localhost:8000/health');
            if (response.ok) {
                setBackendStatus('online');
            } else {
                setBackendStatus('offline');
            }
        } catch (error) {
            console.log('Backend health check failed:', error);
            setBackendStatus('offline');
        }
        setLastCheck(new Date());
    };

    useEffect(() => {
        checkBackendStatus();
        const interval = setInterval(checkBackendStatus, 10000); // Check every 10 seconds
        return () => clearInterval(interval);
    }, []);

    if (process.env.NODE_ENV === 'production') {
        return null; // Don't show in production
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-black/80 backdrop-blur-sm text-white p-3 rounded-lg shadow-lg text-xs">
                <div className="flex items-center space-x-2 mb-2">
                    <FiServer className="h-4 w-4" />
                    <span className="font-semibold">Backend Status</span>
                </div>
                
                <div className="flex items-center space-x-2">
                    {backendStatus === 'checking' ? (
                        <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                    ) : backendStatus === 'online' ? (
                        <FiCheck className="h-3 w-3 text-green-400" />
                    ) : (
                        <FiX className="h-3 w-3 text-red-400" />
                    )}
                    
                    <span className={backendStatus === 'online' ? 'text-green-400' : 'text-red-400'}>
                        {backendStatus === 'online' ? 'Online' : 'Offline'}
                    </span>
                </div>
                
                <div className="text-gray-400 mt-1">
                    Last check: {lastCheck.toLocaleTimeString()}
                </div>
                
                <button 
                    onClick={checkBackendStatus}
                    className="mt-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                >
                    Refresh
                </button>
            </div>
        </div>
    );
};

export default DebugPanel;