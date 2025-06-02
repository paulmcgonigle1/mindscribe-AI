import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBook, FaChartBar, FaRocket, FaCog, FaSignOutAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import classNames from "classnames";

type SidebarLinkType = {
  key: string;
  path: string;
  label: string;
  icon: JSX.Element;
  badge?: string;
};

const MODERN_SIDEBAR_LINKS: SidebarLinkType[] = [
  {
    key: "dashboard",
    label: "Journal",
    path: "/",
    icon: <FaBook className="w-5 h-5" />,
  },
  {
    key: "statistics",
    label: "Analytics",
    path: "/statistics",
    icon: <FaChartBar className="w-5 h-5" />,
  },
  {
    key: "improvements",
    label: "Growth",
    path: "/improvements",
    icon: <FaRocket className="w-5 h-5" />,
    badge: "AI",
  },
];

const SIDEBAR_BOTTOM_LINKS: SidebarLinkType[] = [
  {
    key: "settings",
    label: "Settings",
    path: "/settings",
    icon: <FaCog className="w-5 h-5" />,
  },
];

interface SidebarLinkProps {
  item: SidebarLinkType;
  isCollapsed: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ item, isCollapsed }) => {
  const { pathname } = useLocation();
  const isActive = pathname === item.path;

  return (
    <Link
      to={item.path}
      className={classNames(
        "group relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300",
        isActive
          ? "bg-white/20 text-white shadow-lg border border-white/30"
          : "text-white/80 hover:text-white hover:bg-white/10",
        isCollapsed ? "justify-center" : ""
      )}
      title={isCollapsed ? item.label : undefined}
    >
      <div className="relative">
        {item.icon}
        {item.badge && (
          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
            {item.badge}
          </span>
        )}
      </div>
      
      {!isCollapsed && (
        <span className="font-medium text-body">{item.label}</span>
      )}
      
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-blue-400 rounded-r-full" />
      )}
    </Link>
  );
};

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside 
      className={classNames(
        "glass-card border-0 border-r border-white/20 flex flex-col relative z-30 transition-all duration-300 h-screen",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl flex items-center justify-center">
                <HiOutlineSparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-h6">MindScribe</h1>
                <p className="text-white/60 text-caption">AI Journal</p>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="glass-button !p-2 ml-auto"
          >
            {isCollapsed ? (
              <FaChevronRight className="w-4 h-4" />
            ) : (
              <FaChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* User Profile */}
      {!isCollapsed && (
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user?.first_name?.[0] || user?.email?.[0] || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">
                {user?.first_name || 'User'}
              </p>
              <p className="text-white/60 text-body-sm truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <div className="space-y-2">
          {MODERN_SIDEBAR_LINKS.map((item) => (
            <SidebarLink key={item.key} item={item} isCollapsed={isCollapsed} />
          ))}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-white/20 space-y-2">
        {SIDEBAR_BOTTOM_LINKS.map((item) => (
          <SidebarLink key={item.key} item={item} isCollapsed={isCollapsed} />
        ))}
        
        <button
          onClick={handleLogout}
          className={classNames(
            "group w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 text-red-300 hover:text-red-200 hover:bg-red-500/20",
            isCollapsed ? "justify-center" : ""
          )}
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <FaSignOutAlt className="w-5 h-5" />
          {!isCollapsed && (
            <span className="font-medium text-body">Sign Out</span>
          )}
        </button>
      </div>

      {/* Collapsed User Avatar */}
      {isCollapsed && (
        <div className="p-4 border-t border-white/20">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-lg">
              {user?.first_name?.[0] || user?.email?.[0] || 'U'}
            </span>
          </div>
        </div>
      )}

      {/* Floating Tips for Collapsed State */}
      {isCollapsed && (
        <div className="absolute left-full top-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="glass-card p-2">
            <p className="text-white text-body-sm whitespace-nowrap">
              Expand sidebar
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}