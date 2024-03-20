import { useState, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import chatbot from "../../assets/chatbot.png"; // Path to your bot's avatar image
import { Link } from "react-router-dom";

interface ChatBotProps {
  fetchInsightsCallback: () => Promise<void>;
  message: string | null;
}
function ChatBot({ fetchInsightsCallback, message }: ChatBotProps) {
  const [messages, setMessages] = useState<React.ReactNode[]>([]); // Update state to hold React nodes
  const [hasAdviceBeenAdded, setHasAdviceBeenAdded] = useState<boolean>(false);

  useEffect(() => {
    if (message) {
      const newMessages = messages.includes(message)
        ? [...messages]
        : [...messages, message];

      if (newMessages.length === 1 && !hasAdviceBeenAdded) {
        // Create a React node with the message and a Link component
        const adviceMessage = (
          <span>
            Please go to the{" "}
            <Link to="/improvements" className="text-blue-500 hover:underline">
              improvements page
            </Link>{" "}
            to find out how to improve.
          </span>
        );

        newMessages.push(adviceMessage);
        setHasAdviceBeenAdded(true);
      }

      setMessages(newMessages);
    }
  }, [message, messages, hasAdviceBeenAdded]);

  return (
    <div className="flex flex-col p-4 max-w-xl mx-auto bg-white rounded-lg border shadow-md space-y-4">
      <div className="overflow-y-auto max-h-[300px] space-y-4">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div key={index} className="flex items-center">
              <ChatMessage message={message} />

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
