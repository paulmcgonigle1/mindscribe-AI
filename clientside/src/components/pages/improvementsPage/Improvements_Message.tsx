import React, { useEffect, useState } from "react";
import { ImprovementData } from "../../../lib/types/types";
import {
  createImprovements,
  getImprovements,
} from "../../../services/JournalService";

interface ImprovementsMessageProps {
  improvementData: ImprovementData; // Define the type based on your actual type definitions
}
function Improvements_Message({ improvementData }: ImprovementsMessageProps) {
  //creates new mental health plan and sets that to the one
  return (
    <div className="relative border border-stone-400 bg-slate-200 px-4 w-full ">
      <h1 className="text-center text-lg">Today's Message</h1>

      {improvementData.message ? (
        <div className="overflow-y-auto max-h-[400px] px-4">
          <h2 className="text-center text-sm">Mental Health Plan</h2>
          <p className="text-center">{improvementData.message}</p>
          {improvementData.createdAt && (
            <p className="text-center text-xs">
              Based on entry from:{" "}
              {new Date(improvementData.createdAt).toLocaleString()}
            </p>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500">No message for today.</p>
      )}
    </div>
  );
}

export default Improvements_Message;
