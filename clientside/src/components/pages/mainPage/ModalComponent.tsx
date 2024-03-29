import React from "react";
import { Insight, JournalEntry } from "../../../lib/types/types";

interface ModalComponentProps {
  isOpen: boolean;
  onClose: (event: React.MouseEvent<HTMLButtonElement>) => void; // Updated to accept a mouse event
  insight: Insight;
}

const ModalComponent = ({ isOpen, onClose, insight }: ModalComponentProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Insight for Journal Entry
          </h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              Insight Id: {insight.insightID}
              {/* ... add more details you want to show ... */}
            </p>
            <p className="text-sm text-gray-800">
              <strong>Emotions:</strong> {insight.moods || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Sentiment:</strong> {insight.sentiment || "N/A"}
            </p>

            <p className="text-sm text-gray-600">
              <strong>Themes:</strong> {insight.key_themes || "N/A"}
            </p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              id="ok-btn"
              onClick={(event) => onClose(event)}
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
