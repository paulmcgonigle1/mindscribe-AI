type StepBProp = {
  formData: {
    preferred_type: string;
    preferred_style: string;
  };
  handleChangeInput: (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => void;
  handlePrevStep: () => void;
  handleNextStep: () => void;
};

const StepB: React.FC<StepBProp> = ({
  formData,
  handleChangeInput,
  handlePrevStep,
  handleNextStep,
}) => {
  return (
    <div>
      <h1 className="mt-2 text-xl font-bold text-blue-900">
        Step B: Motivational Daily Messages
      </h1>

      <div className="my-2">
        <label
          htmlFor="preferred_type"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Preferred Message Type
        </label>
        <select
          id="preferred_type"
          name="preferred_type"
          value={formData.preferred_type}
          onChange={(e) => handleChangeInput(e)}
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="poem">Poem</option>
          <option value="story">Story</option>
          <option value="quote">Quote</option>
          <option value="motivation">Motivation</option>
        </select>
      </div>
      <div className="my-2">
        <label
          htmlFor="preferred_style"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Preferred Message Style
        </label>
        <select
          id="preferred_style"
          name="preferred_style"
          value={formData.preferred_style}
          onChange={(e) => handleChangeInput(e)}
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="stoic">Stoic</option>
          <option value="funny">Funny</option>
          <option value="deep">Deep</option>
          <option value="insightful">Insightful</option>
        </select>
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

export default StepB;
