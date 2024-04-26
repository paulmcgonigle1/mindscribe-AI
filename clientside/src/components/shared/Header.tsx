import { Fragment, useContext, useState } from "react";
import { HiChevronDoubleDown } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import TrackTasks from "../pages/trackTasksPage/TrackTasks";

export default function Header() {
  const [trackTasksVisible, setTrackTasksVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  let { user } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const handleOverlayClick = () => {
    setTrackTasksVisible(false);
  };
  return (
    <div
      className="bg-gray-50 h-16 px-4 flex justify-between items-center border-b border-gray-200 z-50"
      style={{ backgroundColor: "#f9a827" }}
    >
      <div className="flex-grow">
        <div className="relative">
          <button
            className="text-black group justify-items-end inline-flex items-center rounded-md bg-warm-orange px-3 py-2 text-base font-medium hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
            onClick={() => setTrackTasksVisible(!trackTasksVisible)}
          >
            <span>Track Tasks</span>
            <HiChevronDoubleDown
              className="text-white-300 ml-2 h-5 w-5 transition duration-150 ease-in-out group-hover:text-blue-300/80"
              aria-hidden="true"
            />
          </button>
          {trackTasksVisible && (
            <>
              {/* Overlay background */}
              <div
                className="fixed inset-0 bg-black bg-opacity-30 mt-[63px] ml-[240px]"
                aria-hidden="true"
                onClick={handleOverlayClick} // This will trigger when the overlay is clicked
              ></div>

              {/* Scale-in animation container */}
              <div className="absolute left-1/4 z-50 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl animate-scale-in">
                <div className="bg-gray-50 overflow-hidden rounded-lg shadow-2xl ring-1 ring-black/5">
                  <TrackTasks />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mr-2">
        <div>
          <p>{user && `Hello, ${user.username}`}</p>
        </div>

        {/* User Menu */}
        <div className="relative inline-block text-left rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400">
          <button
            className="ml-2 inline-flex"
            onClick={() => setSettingsVisible(!settingsVisible)}
          >
            <span className="sr-only">Open User Menu</span>
            <FaUserCircle className="h-10 w-10 rounded-full" />
          </button>
          {settingsVisible && (
            <div className="origin-top-right z-10 absolute right-0 mt-2 w-40 rounded-lg shadow-sm p-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <button onClick={() => navigate("/settings")}>Settings</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
