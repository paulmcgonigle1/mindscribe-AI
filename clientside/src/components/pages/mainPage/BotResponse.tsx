import React from "react";
import ChatBot from "../../chatbot/ChatBot";

interface BotResponseProps {
  fetchInsightsCallback: () => void; // Callback function to trigger fetchInsights
}
function BotResponse({ fetchInsightsCallback }: BotResponseProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">
          Your Insightful Companion
        </h2>
        <p className="text-sm text-gray-700">
          Here's what the bot has to say about your recent journal entries. Feel
          free to start a new conversation anytime!
        </p>
      </div>
      <div className="p-4">
        <ChatBot fetchInsightsCallback={fetchInsightsCallback} />
      </div>
    </div>
  );
}

export default BotResponse;
