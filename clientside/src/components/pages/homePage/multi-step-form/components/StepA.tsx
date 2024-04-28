import React from "react";

type StepAProp = {
  formData: {
    firstName: string;
    lastName: string;
  };
  handleChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNextStep: () => void;
};

const StepA: React.FC<StepAProp> = ({
  formData,
  handleChangeInput,
  handleNextStep,
}) => {
  return (
    <div>
      <h1 className="mt-2 text-xl font-bold text-black">Step A: Name</h1>
      <div className="my-2">
        <label>First name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={(e) => handleChangeInput(e)}
          className="w-full outline-none border border-gray-400 px-2 py-1 rounded-lg focus:border-blue-600"
        />
      </div>
      <div className="my-2">
        <label>Last name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={(e) => handleChangeInput(e)}
          className="w-full outline-none border border-gray-400 px-2 py-1 rounded-lg focus:border-blue-600"
        />
      </div>
      <div className="my-2 flex justify-end items-center">
        <button
          className="bg-green-400 px-4 py-2 rounded-xl"
          onClick={handleNextStep}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StepA;
