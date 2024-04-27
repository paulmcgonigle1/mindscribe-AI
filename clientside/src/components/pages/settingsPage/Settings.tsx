import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../context/AuthContext";
import {
  getSettings,
  removeUserData,
  updateSettings,
} from "../../../services/JournalService";
import Companion1 from "../../../assets/chatbot.png";
import Companion2 from "../../../assets/companion2.png";
import Companion3 from "../../../assets/chatbot.png";
import ConfirmationModal from "./ConfirmationModel";

function Settings() {
  const [settings, setSettings] = useState({
    preferred_type: "",
    preferred_style: "",
    is_personalised: false,
    responseType: "",
    companionType: "",
  });
  const navigate = useNavigate();

  const { authTokens } = useContext(AuthContext) ?? {};
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  console.log("Current settings:", settings);

  useEffect(() => {
    // fetch settings logic

    const fetchSettings = async () => {
      if (authTokens?.access) {
        try {
          const fetchedsettings = await getSettings(authTokens);
          // console.log("Settings for this user:", fetchedsettings);
          setSettings(fetchedsettings);
        } catch (error) {
          console.error("Error fetching tracked tasks plan:", error);
        }
      }
    };

    fetchSettings();
  }, [authTokens]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // fixes auth token error
    if (!authTokens?.access) {
      console.error("No authentication token available.");
      return;
    }

    try {
      // Call the updateSettings function, passing the auth tokens and the current settings state.
      const response = await updateSettings(authTokens, settings);
      console.log("Settings updated successfully:", response);
      // Optionally, you could refresh the settings from the server again here, or handle any post-update logic.
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const handleRemoveData = async () => {
    if (!authTokens?.access) {
      console.error("No authentication token available.");
      return;
    }

    try {
      const response = await removeUserData(authTokens);
      console.log("User data removed successfully:", response);
      navigate("/home");
      // Optionally, you could redirect the user to a different page or display a confirmation message.
    } catch (error) {
      console.error("Error removing user data:", error);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    console.log(`Updating setting: ${name} to ${value}`); // Add this line

    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };
  const handleCompanionClick = (companion: string) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      companionType: companion,
    }));
  };

  return (
    <div className=" justify-center items-center">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mt-10">
        Settings
      </h2>
      <div className="max-w-2xl mx-auto my-8 bg-white shadow-lg rounded-lg p-6 md:grid  md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-xl font-semibold text-gray-500 mb-4">
            Personal Messages
          </h3>
          <form onSubmit={handleSubmit}>
            {/* Preffered Type  */}
            <div className="mb-4">
              <label
                htmlFor="preferred_type"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Preferred Message Type
              </label>
              <select
                id="preferred_type"
                name="preferred_type"
                value={settings.preferred_type}
                onChange={handleChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="poem">Poem</option>
                <option value="story">Story</option>
                <option value="quote">Quote</option>
                <option value="motivation">Motivation</option>
              </select>
            </div>
            {/* Preffered Style  */}
            <div className="mb-6">
              <label
                htmlFor="preferred_style"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Preferred Message Style
              </label>
              <select
                id="preferred_style"
                name="preferred_style"
                value={settings.preferred_style}
                onChange={handleChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="stoic">Stoic</option>
                <option value="funny">Funny</option>
                <option value="deep">Deep</option>
                <option value="insightful">Insightful</option>
              </select>
            </div>
            <h3 className="text-xl font-semibold text-gray-500 mb-4">
              General
            </h3>
            {/* Response Type Here */}
            <div className="mb-4">
              <label
                htmlFor="responseType"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Preferred Response Type - Coming Soon
              </label>
              <select
                id="responseType"
                name="responseType"
                value={settings.responseType}
                onChange={handleChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="text">Text</option>
                <option value="voice">Voice</option>
                <option value="both">Both</option>
              </select>
            </div>
            {/* Companion Preferences Here */}
            <div className="mb-6">
              <label
                htmlFor="companionType"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Companion Personality
              </label>
              <div className="flex justify-start items-center gap-8">
                <div className="flex flex-col items-center">
                  <img
                    src={Companion1}
                    alt="Companion 1"
                    className="w-32 h-32 mb-2 rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                    onClick={() => handleCompanionClick("Companion 1")}
                  />
                  <span className="text-sm">Terry</span>
                </div>
                <div className="flex flex-col items-center">
                  <img
                    src={Companion2}
                    alt="Companion 2"
                    className="w-32 h-32 mb-2 rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                    onClick={() => handleCompanionClick("Companion 2")}
                  />
                  <span className="text-sm">Donald</span>
                </div>
                <div className="flex flex-col items-center">
                  <img
                    src={Companion3}
                    alt="Companion 3"
                    className="w-32 h-32 mb-2 rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                    onClick={() => handleCompanionClick("Companion 3")}
                  />
                  <span className="text-sm">John</span>
                </div>
              </div>
            </div>
            <div className=" flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4"
              >
                Save Settings
              </button>
              <button
                onClick={() => setShowConfirmationModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Remove All Data
              </button>
            </div>
          </form>
        </div>
        <div className="mt-8 flex justify-between">
          {showConfirmationModal && (
            <ConfirmationModal
              onConfirm={handleRemoveData}
              onCancel={() => setShowConfirmationModal(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
