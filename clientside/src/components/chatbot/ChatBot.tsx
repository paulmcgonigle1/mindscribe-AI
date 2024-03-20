import React, { useState, useEffect, useContext } from "react";
import ChatMessages from "./ChatMessages";
import chatbot from "../../assets/chatbot.png"; // Path to your bot's avatar image

interface ChatBotProps {
  fetchInsightsCallback: () => Promise<void>;
  message: string | null;
}
function ChatBot({ fetchInsightsCallback, message }: ChatBotProps) {
  const [messages, setMessages] = useState<string[]>([]);
  // const { authTokens } = useContext(AuthContext) ?? {};

  // Effect to update messages state when message prop changes
  useEffect(() => {
    // Check if message is not null and not an empty string
    if (message) {
      // Optionally, check for duplicates before adding
      if (!messages.includes(message)) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    }
  }, [message]); // Dependency on message prop

  return (
    <div className="flex flex-col p-4 max-w-md mx-auto bg-white rounded-lg border shadow-md space-y-4">
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <div key={index} className="flex items-center">
            <ChatMessages message={message} />
            <img
              src={chatbot}
              alt="Chat Bot"
              onClick={() => fetchInsightsCallback().catch(console.error)} // Make sure the onClick handler calls fetchInsightsCallback
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
            onClick={() => fetchInsightsCallback().catch(console.error)} // Make sure the onClick handler calls fetchInsightsCallback
            className="w-20 h-20 rounded-full mx-auto mt-4 cursor-pointer" // Added cursor-pointer for better UX
          />
        </div>
      )}
    </div>
  );
}

export default ChatBot;
