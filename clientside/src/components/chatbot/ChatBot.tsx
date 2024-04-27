import { useState, useEffect } from "react";
import Typewriter from "typewriter-effect"; // Ensure you have this installed
import chatbot from "../../assets/chatbot.png"; // Correct path to image

interface ChatBotProps {
  fetchInsightsCallback: () => Promise<void>;
  message: string | null;
}
interface Message {
  text: string;
  link?: string;
}

function ChatBot({ fetchInsightsCallback, message }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasAdviceBeenAdded, setHasAdviceBeenAdded] = useState<boolean>(false);

  useEffect(() => {
    if (message && !messages.some((msg) => msg.text === message)) {
      const newMessage: Message = { text: message };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      if (!hasAdviceBeenAdded) {
        setTimeout(() => {
          const adviceMessage: Message = {
            text: "Please go to the improvements page to find out how to improve ",
            link: "/improvements",
          };
          setMessages((prevMessages) => [...prevMessages, adviceMessage]);
          setHasAdviceBeenAdded(true);
        }, 9000);
      }
    }
  }, [message]);

  return (
    <div className="flex flex-col p-4 max-w-xl mx-auto max-h-[23vh] overflow-y-auto   bg-white rounded-lg border shadow-md">
      <div className="overflow-y-auto max-h-[250px] space-y-4">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div key={index} className="flex items-center">
              <div className="flex-grow bg-gray-100 rounded-lg p-2 text-md text-gray-700">
                <Typewriter
                  options={{
                    strings: message.text,
                    autoStart: true,
                    delay: 19, // Typing effect speed
                    cursor: "",
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
