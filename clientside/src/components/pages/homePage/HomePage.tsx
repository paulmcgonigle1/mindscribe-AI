import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-5xl text-center text-gray-800 font-bold mb-6">
          Welcome to My Mental Health Journal
        </h1>
        <p className="text-lg text-center text-gray-600 mb-8">
          Your personal space to reflect, grow, and track your mental health
          journey.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login to Start
        </button>
      </div>
    </div>
  );
};

export default HomePage;
