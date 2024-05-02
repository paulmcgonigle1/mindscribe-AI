import React from "react";
import { Insight, JournalEntry } from "../../../lib/types/types";

interface ModalComponentProps {
  isOpen: boolean;
  onClose: (event: React.MouseEvent<HTMLButtonElement>) => void; // Updated to accept a mouse event
  insight: Insight;
  entry: JournalEntry;
}

const ModalComponent = ({
  isOpen,
  onClose,
  insight,
  entry,
}: ModalComponentProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="relative mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white animate-scale-in">
        <div className="mt-3 text-center">
          <div
            className="mb-6  p-6 rounded-lg"
            style={{ backgroundColor: "#f9a827" }}
          >
            <h3 className="text-2xl leading-6 font-semibold text-gray-900">
              Insights by AI companion this Journal Entry
            </h3>
            <p className="text-md text-center text-gray-600 mt-2">
              here are your insights for today.
            </p>
          </div>

          <div className="mt-2 px-7 py-3">
            <p className="text-lg text-gray-500">
              Insight Id: {insight.insightID}
              {/* ... add more details you want to show ... */}
            </p>
            <p className="text-lg text-gray-800">
              <strong>Emotions:</strong> {insight.moods || "N/A"}
            </p>
            <p className="text-lg text-gray-600">
              <strong>Sentiments:</strong> {insight.sentiment || "N/A"}
            </p>

            <p className="text-lg text-gray-600">
              <strong>Themes:</strong> {insight.key_themes || "N/A"}
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold leading-6 text-gray-900">
              Journal entry text
            </h3>
            <p className="text-lg">{entry.content}</p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              id="ok-btn"
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;
