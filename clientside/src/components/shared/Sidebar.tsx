import React, { useContext } from "react";
import { FcBullish } from "react-icons/fc";
import {
  DASHBOARD_SIDEBAR_BOTTOM_LINKS,
  DASHBOARD_SIDEBAR_LINKS,
} from "../../lib/constants/navigation";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import { HiOutlineLogout } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
const linkClasses =
  "flex items-center gap-2 font-light px-3 py-2 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base";

type SidebarLinkType = {
  key: string;
  path: string;
  label: string;
  icon: JSX.Element;
};

// Define the props for SidebarLink with a TypeScript interface
interface SidebarLinkProps {
  item: SidebarLinkType;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ item }) => {
  const { pathname } = useLocation();
  return (
    <Link
      to={item.path}
      className={classNames(
        pathname === item.path ? "text-white" : "text-neutral-400",
        linkClasses
      )}
    >
      {item.icon}
      <span>{item.label}</span>
    </Link>
  );
};

export default function Sidebar() {
  let { user, logoutUser } = useContext(AuthContext)!;

  const navigate = useNavigate();
  // const { setAuthTokens, setUser } = useContext(AuthContext); // Assuming your context provides these

  const handleLogout = () => {
    logoutUser();
    // console.log("user after logout: = ", user);
    // console.log("authTokens = ", localStorage.getItem("authTokens"));
    navigate("/sign-up", { state: { isLogin: true } });
  };
  return (
    <div className="bg-neutral-900 w-60 p-3 flex flex-col text-white">
      <div className="flex items-center gap-2 px-1 py-3">
        <FcBullish />
        <span className="text-neutral-180 text-lg">MindScribe AI</span>
      </div>
      <div className="flex-1 py-8 flex flex-col gap-8">
        {DASHBOARD_SIDEBAR_LINKS.map((item) => (
          <SidebarLink key={item.key} item={item} /> // Use the SidebarLink component with a key
        ))}
      </div>
      <div className="flex flex-col gap-0.5 pt-2 border-t border-neutral-700">
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item) => (
          <SidebarLink key={item.key} item={item} />
        ))}
        <div
          className={classNames("text-red-500 cursor-pointer", linkClasses)}
          onClick={handleLogout}
        >
          {
            <span className="text-xl">
              <HiOutlineLogout />
            </span>
          }
          Logout
        </div>
      </div>
    </div>
  );
}
