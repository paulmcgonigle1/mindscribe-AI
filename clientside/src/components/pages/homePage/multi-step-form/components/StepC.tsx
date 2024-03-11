type StepCProp = {
  formData: {
    responseType: string;
  };
  handleChangeInput: (format: string, value: any) => void;
  handlePrevStep: () => void;
  handleNextStep: () => void;
};

const StepC: React.FC<StepCProp> = ({
  formData,
  handleChangeInput,
  handlePrevStep,
  handleNextStep,
}) => {
  const handleFormatSelect = (format: string) => {
    // Directly specify the field name and the value
    handleChangeInput("responseType", format);
  };

  return (
    <div>
      <h1 className="mt-2 text-xl font-bold text-blue-900">
        Step C: Journal Companion Responses
      </h1>

      <div className="flex gap-4 my-4 align-middle justify-items-stretch">
        {["Text", "Voice", "Both"].map((format) => (
          <button
            key={format}
            onClick={() => handleFormatSelect(format.toLowerCase())}
            className={`py-2 px-4 rounded-lg text-lg transition-all duration-150 ease-in-out ${
              formData.responseType === format.toLowerCase()
                ? "bg-blue-500 text-white ring-2 ring-orange-300 shadow-lg"
                : "bg-gray-200 hover:bg-gray-300"
            } focus:outline-none focus:ring-4 focus:ring-blue-400`}
          >
            {format}
          </button>
        ))}
      </div>
      <div className="my-2 flex justify-between items-center">
        <button
          className="bg-yellow-400 px-4 py-2 rounded-xl"
          onClick={handlePrevStep}
        >
          Prev
        </button>
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

export default StepC;
