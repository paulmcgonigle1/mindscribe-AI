import React from "react";

type ChatMessageProps = {
  message: string;
};

function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className="flex-grow bg-gray-100 rounded-lg p-2 text-sm text-gray-700">
      {message}
    </div>
  );
}

export default ChatMessage;
