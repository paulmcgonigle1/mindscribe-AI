import { useState, useEffect } from "react";
import Typewriter from "typewriter-effect"; // Ensure you have this installed
import chatbot from "../../assets/chatbot.png"; // Correct path to image

interface ChatBotProps {
  fetchInsightsCallback: () => Promise<void>;
  message: string | null;
}

function ChatBot({ fetchInsightsCallback, message }: ChatBotProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const [hasAdviceBeenAdded, setHasAdviceBeenAdded] = useState<boolean>(false);

  useEffect(() => {
    if (message && !messages.includes(message)) {
      // Add new user message
      setMessages((prevMessages) => [...prevMessages, message]);

      // Add advice message if it's the first user message
      if (!hasAdviceBeenAdded) {
        setTimeout(() => {
          setMessages((prevMessages) => [
            ...prevMessages,
            "Please go to the improvements page to find out how to improve.",
          ]);
          setHasAdviceBeenAdded(true); // Ensure advice message is only added once
        }, 6000); // Delay of 3 seconds
      }
    }
  }, [message]); // Remove hasAdviceBeenAdded and messages from dependency array to avoid retriggering the effect needlessly

  return (
    <div className="flex flex-col p-4 max-w-xl mx-auto bg-white rounded-lg border shadow-md space-y-4">
      <div className="overflow-y-auto max-h-[300px] space-y-4">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div key={index} className="flex items-center">
              <div className="flex-grow bg-gray-100 rounded-lg p-2 text-md text-gray-700">
                <Typewriter
                  options={{
                    strings: message,
                    autoStart: true,
                    delay: 19, // Typing effect speed
                  }}
                />
              </div>
              <img
                src={chatbot}
                alt="Chat Bot"
                onClick={() => fetchInsightsCallback().catch(console.error)}
                className="w-20 h-20 rounded-full ml-4"
              />
            </div>
          ))
        ) : (
          <div className="text-center">
            <p>No insights available yet. Click on the bot to get insights!</p>
            <img
              src={chatbot}
              alt="Chat Bot"
              onClick={() => fetchInsightsCallback().catch(console.error)}
              className="w-20 h-20 rounded-full mx-auto mt-4 cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatBot;
