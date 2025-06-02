import React, { useState, useRef, useEffect } from "react";
import { HiOutlineMenu, HiOutlineX, HiOutlineChevronDown } from "react-icons/hi";
import { FaUserCircle, FaTasks, FaSignOutAlt, FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import TrackTasks from "../pages/trackTasksPage/TrackTasks";

export default function Header() {
  const [trackTasksVisible, setTrackTasksVisible] = useState(false);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const trackTasksRef = useRef<HTMLDivElement>(null);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuVisible(false);
      }
      if (trackTasksRef.current && !trackTasksRef.current.contains(event.target as Node)) {
        setTrackTasksVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Main Header */}
      <header className="glass-card border-0 border-b border-white/20 h-20 px-6 flex justify-between items-center relative z-40">
        {/* Left Section - Logo & Navigation */}
        <div className="flex items-center space-x-6">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden glass-button !p-2"
            onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
          >
            {mobileMenuVisible ? (
              <HiOutlineX className="w-6 h-6" />
            ) : (
              <HiOutlineMenu className="w-6 h-6" />
            )}
          </button>

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <h1 className="text-h5 text-white font-bold hidden sm:block">
              MindScribe AI
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4">
            <div className="relative" ref={trackTasksRef}>
              <button
                className="glass-button flex items-center space-x-2 group"
                onClick={() => setTrackTasksVisible(!trackTasksVisible)}
              >
                <FaTasks className="w-4 h-4" />
                <span>Track Tasks</span>
                <HiOutlineChevronDown 
                  className={`w-4 h-4 transition-transform duration-300 ${
                    trackTasksVisible ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Track Tasks Dropdown */}
              {trackTasksVisible && (
                <div className="absolute top-full left-0 mt-2 z-50 animate-fade-in-up">
                  <div className="glass-card p-6 w-96 max-w-sm">
                    <TrackTasks />
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Section - User Menu */}
        <div className="flex items-center space-x-4">
          {/* Welcome Message */}
          <div className="hidden md:block text-right">
            <p className="text-white/90 text-body-sm">Welcome back,</p>
            <p className="text-white font-semibold">
              {user?.first_name || user?.email || 'User'}
            </p>
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              className="glass-button !p-3 flex items-center space-x-2 group"
              onClick={() => setUserMenuVisible(!userMenuVisible)}
            >
              <FaUserCircle className="w-6 h-6" />
              <HiOutlineChevronDown 
                className={`w-4 h-4 transition-transform duration-300 hidden sm:block ${
                  userMenuVisible ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {/* User Dropdown Menu */}
            {userMenuVisible && (
              <div className="absolute top-full right-0 mt-2 z-50 animate-fade-in-up">
                <div className="glass-card p-4 w-48">
                  <div className="space-y-2">
                    <div className="px-4 py-2 border-b border-white/20">
                      <p className="text-white text-body-sm font-medium">
                        {user?.email}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setUserMenuVisible(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                    >
                      <FaCog className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                    >
                      <FaSignOutAlt className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {mobileMenuVisible && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm">
          <div className="glass-card m-4 mt-24 p-6 animate-slide-in">
            <div className="space-y-4">
              <button
                className="w-full glass-button flex items-center space-x-3"
                onClick={() => {
                  setTrackTasksVisible(!trackTasksVisible);
                  setMobileMenuVisible(false);
                }}
              >
                <FaTasks className="w-5 h-5" />
                <span>Track Tasks</span>
              </button>
              
              <button
                className="w-full glass-button flex items-center space-x-3"
                onClick={() => {
                  navigate('/settings');
                  setMobileMenuVisible(false);
                }}
              >
                <FaCog className="w-5 h-5" />
                <span>Settings</span>
              </button>
              
              <button
                className="w-full bg-red-500/20 border border-red-300/30 text-red-200 hover:bg-red-500/30 flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Track Tasks Mobile Overlay */}
      {trackTasksVisible && mobileMenuVisible && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
          <div className="glass-card m-4 mt-24 p-6 animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-h6 text-white font-semibold">Track Tasks</h3>
              <button
                onClick={() => setTrackTasksVisible(false)}
                className="text-white/70 hover:text-white"
              >
                <HiOutlineX className="w-6 h-6" />
              </button>
            </div>
            <TrackTasks />
          </div>
        </div>
      )}
    </>
  );
}