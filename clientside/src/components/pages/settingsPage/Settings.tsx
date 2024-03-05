import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../../context/AuthContext";
import {
  getSettings,
  getTrackedTasks,
  updateSettings,
} from "../../../services/JournalService";

function Settings() {
  const [settings, setSettings] = useState({
    preferred_type: "",
    preferred_style: "",
  });

  const { authTokens } = useContext(AuthContext) ?? {};

  console.log("Current settings:", settings);

  useEffect(() => {
    // fetch settings logic

    const fetchSettings = async () => {
      if (authTokens?.access) {
        try {
          const fetchedsettings = await getSettings(authTokens);
          console.log("Settings for this user:", fetchedsettings);
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

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    console.log(`Updating setting: ${name} to ${value}`); // Add this line

    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-md mx-auto my-10 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Settings</h2>
      <h3 className="text-xl font-semibold text-gray-500 mb-4">Preferences</h3>
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
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}

export default Settings;
