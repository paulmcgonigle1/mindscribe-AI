import MultiStepForm from "./components/MultiStepForm";

const Questionnaire = () => {
  return (
    <div className="bg-white rounded-lg mx-4 p-4 min-h[50vh]]">
      <div className=" p-6 rounded-lg" style={{ backgroundColor: "#f9a827" }}>
        <h1 className="text-2xl text-center font-semibold text-gray-800">
          Personalise your experience
        </h1>
        <p className="text-md text-center text-gray-600 mt-2">
          Update your preferences and settings here for improved experience
        </p>
      </div>
      <br />
      <br />
      <br />
      <MultiStepForm showStepNumber={true} />
    </div>
  );
};

export default Questionnaire;
