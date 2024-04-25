import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../../context/AuthContext";
import {
  getSettings,
  removeUserData,
  updateSettings,
} from "../../../services/JournalService";
import Load from "../../../assets/mindscribe2/svg/settings.svg";
import Companion1 from "../../../assets/chatbot.png";
import Companion2 from "../../../assets/companion2.png";
import Companion3 from "../../../assets/chatbot.png";

function Settings() {
  const [settings, setSettings] = useState({
    preferred_type: "",
    preferred_style: "",
    is_personalised: false,
    responseType: "",
    companionType: "",
  });

  const { authTokens } = useContext(AuthContext) ?? {};

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
      <h2 className="text-2xl font-semibold text-center text-gray-800 mt-20">
        Settings
      </h2>
      <div className="max-w-4xl mx-auto my-10 bg-white shadow-md rounded-lg p-6 md:grid md:grid-cols-2 md:gap-6 min-h-[50vh] max-h-[60vh] ">
        <div className="md:col-span-1">
          <h3 className="text-xl font-semibold text-gray-500 mb-4">
            Personal Messages
          </h3>
          <form onSubmit={handleSubmit}>
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
            <div className="mb-6">
              <label
                htmlFor="companionType"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Companion Personality
              </label>
              <div className="flex justify-between items-center">
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

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save Settings
            </button>
            <button
              onClick={handleRemoveData}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 focus:outline-none focus:shadow-outline"
            >
              Remove All Data
            </button>
          </form>
        </div>
        <div className="md:col-span-1 flex md:justify-end bg-gray">
          <img
            src={Load}
            alt="Descriptive Alt Text"
            className=" object-contain" // Adjust the size as needed
          />
        </div>
      </div>
    </div>
  );
}

export default Settings;
