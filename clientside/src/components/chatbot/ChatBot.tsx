import React, { useState, useEffect } from "react";
import ChatMessages from "./ChatMessages";
import chatbot from "../../assets/chatbot.png"; // Path to your bot's avatar image

function ChatBot() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // This is where you'd typically connect to your WebSocket or backend to receive messages

    const insightsData = {
      emotions: "energized, overwhelmed, discouraged, tough, lifted spirits",
      sentiment: "positive, negative",
      themes: "learning, friendship, perseverance",
    };

    const message = `It sounds like you had a day full of ups and downs. Feeling ${insightsData.emotions} is completely natural. It's great to see themes of ${insightsData.themes} in your day. Remember, it's okay to have ${insightsData.sentiment} days.`;

    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  return (
    <div className="flex flex-col p-4 max-w-md mx-auto bg-white rounded-lg border shadow-md space-y-4">
      {messages.map((message, index) => (
        <div key={index} className="flex items-center">
          <ChatMessages message={message} />
          <img
            src={chatbot}
            alt="Chat Bot"
            className="w-20 h-20 rounded-full ml-4" // Adjusted avatar size and spacing
          />
        </div>
      ))}
    </div>
  );
}

export default ChatBot;
