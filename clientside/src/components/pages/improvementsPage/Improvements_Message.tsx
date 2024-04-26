import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../../context/AuthContext";
import Typewriter from "typewriter-effect";
import Load from "../../../assets/mindscribe2/svg/writer1.svg";
import { fetchMessageOfDay } from "../../../services/JournalService";

function Improvements_Message() {
  const [message, setMessage] = useState<string | null>(null);
  const [shouldTypeWriter, setShouldTypeWriter] = useState<boolean>(true); // Indicates whether to use Typewriter effect
  const { authTokens } = useContext(AuthContext) ?? {};

  const fetchMessage = async () => {
    if (authTokens?.access) {
      try {
        const response = await fetchMessageOfDay(authTokens);
        setMessage(response.message);
        localStorage.setItem("messageOfDay", response.message); // Store the new message in localStorage
        setShouldTypeWriter(true); // Enable Typewriter when a new message is fetched
      } catch (error) {
        console.error("Error fetching message of the day:", error);
      }
    }
  };

  useEffect(() => {
    const storedMessage = localStorage.getItem("messageOfDay"); // Retrieve message from localStorage
    if (storedMessage) {
      setMessage(storedMessage);
      setShouldTypeWriter(false); // Disable Typewriter if message is retrieved from localStorage
    } else {
      fetchMessage(); // Fetch message when component mounts if not already stored
    }
  }, []); // Fetch message only once when the component mounts

  const handleFetchNewMessage = () => {
    fetchMessage(); // Fetch message when button is clicked
  };

  return (
    <div className="flex flex-col rounded-lg p-4 justify-center items-center bg-green-100 flex-grow shadow-lg h-[35vh]">
      <div className="w-full flex flex-col justify-center items-center h-full ">
        {" "}
        {/* Updated this line */}
        <h1 className="text-center text-2xl font-semibold mb-4">
          Today's Personal Message
        </h1>
        <div className="text-xl text-gray-800 flex flex-col justify-center pt-10 overflow-y-auto">
          {message ? (
            shouldTypeWriter ? (
              <Typewriter
                options={{
                  strings: message,
                  autoStart: true,
                  delay: 15,
                  cursor: "",
                }}
              />
            ) : (
              <p>{message}</p>
            )
          ) : (
            <p className="text-center text-gray-500">No message for today.</p>
          )}
        </div>
        <button
          className=" items-center shadow w-fit hover:bg-orange-100 rounded text-black p-2"
          onClick={handleFetchNewMessage}
        >
          Get New Message
        </button>
      </div>
    </div>
  );
}

export default Improvements_Message;
