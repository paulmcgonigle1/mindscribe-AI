import React from "react";

type ChatMessageProps = {
  message: React.ReactNode; // Allow message to be a ReactNode
};

function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className="flex-grow bg-gray-100 rounded-lg p-2 text-md text-gray-700">
      {message}
    </div>
  );
}

export default ChatMessage;
