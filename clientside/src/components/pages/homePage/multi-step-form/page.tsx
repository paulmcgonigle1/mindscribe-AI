import MultiStepForm from "./components/MultiStepForm";

const Questionnaire = () => {
  return (
    <div className="bg-white rounded-lg mx-4 p-4">
      <h1 className="text-blue-400 text-2xl">
        Personalize your experiene before we begin{" "}
      </h1>
      <br />
      <br />
      <br />
      <MultiStepForm showStepNumber={true} />
    </div>
  );
};

export default Questionnaire;
