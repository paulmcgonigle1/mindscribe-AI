import React, { useState, useEffect, useContext } from "react";
import ChatMessages from "./ChatMessages";
import chatbot from "../../assets/chatbot.png"; // Path to your bot's avatar image
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import { generateInsightMessageFromBot } from "../../services/JournalService";

function ChatBot() {
  const [messages, setMessages] = useState<string[]>([]);
  const { authTokens } = useContext(AuthContext) ?? {};

  const fetchInsights = async () => {
    if (authTokens?.access) {
      try {
        const response = await generateInsightMessageFromBot(authTokens);
        const insightMessage = response.message; // Accessing the message property

        setMessages((prevMessages) => [...prevMessages, insightMessage]);
      } catch (error) {
        console.error("Error fetching insights:", error);
      }
    }
  };

  return (
    <div className="flex flex-col p-4 max-w-md mx-auto bg-white rounded-lg border shadow-md space-y-4">
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <div key={index} className="flex items-center">
            <ChatMessages message={message} />
            <img
              src={chatbot}
              alt="Chat Bot"
              onClick={fetchInsights}
              className="w-20 h-20 rounded-full ml-4" // Adjusted avatar size and spacing
            />
          </div>
        ))
      ) : (
        <div className="text-center">
          <p>No insights available yet. Click on the bot to get insights!</p>
          <img
            src={chatbot}
            alt="Chat Bot"
            onClick={fetchInsights}
            className="w-20 h-20 rounded-full mx-auto mt-4 cursor-pointer" // Added cursor-pointer for better UX
          />
        </div>
      )}
    </div>
  );
}

export default ChatBot;
