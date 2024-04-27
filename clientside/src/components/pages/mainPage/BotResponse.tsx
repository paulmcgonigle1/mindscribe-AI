import ChatBot from "../../chatbot/ChatBot";

interface BotResponseProps {
  fetchInsightsCallback: () => Promise<void>; // Callback function to trigger fetchInsights
  message: string | null;
}
function BotResponse({ fetchInsightsCallback, message }: BotResponseProps) {
  return (
    <div
      className="bg-white shadow-md  rounded-lg h-[35vh]"
      style={{ backgroundColor: "#f9a827" }}
    >
      <div className="p-4 border-b">
        <h2 className="text-2xl text-center font-semibold text-gray-900">
          Your Insightful Companion
        </h2>
        <p className="text-lg text-gray text-center">
          Here's what the bot has to say about your recent journal entries
        </p>
      </div>
      <div className="p-4">
        <ChatBot
          fetchInsightsCallback={fetchInsightsCallback}
          message={message}
        />
      </div>
    </div>
  );
}

export default BotResponse;
