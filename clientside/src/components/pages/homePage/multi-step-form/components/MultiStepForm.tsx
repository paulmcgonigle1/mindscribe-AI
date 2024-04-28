import React, { useContext, useEffect, useState } from "react";
import StepA from "./StepA";
import StepB from "./StepB";
import StepC from "./StepC";
import StepD from "./StepD";
import StepFinal from "./StepFinal";
import AuthContext from "../../../../../context/AuthContext";
import { updatePreferances } from "../../../../../services/JournalService";

const initialFormData = {
  firstName: "",
  lastName: "",
  preferred_type: "",
  preferred_style: "",
  responseType: "",
  agreeToTerms: false, //changed this from false
};

const stepsArray = ["A", "B", "C", "D"];
interface MultiStepFormProps {
  showStepNumber: boolean;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({ showStepNumber }) => {
  const [step, setStep] = useState("A");
  const [formData, setFormData] = useState(initialFormData);
  const { authTokens } = useContext(AuthContext) ?? {};

  // We need a method to go to next step
  const handleNextStep = () => {
    if (step === "A") setStep("B");
    else if (step === "B") setStep("C");
    else if (step === "C") setStep("D");
  };

  // We need a method to go to prev step
  const handlePrevStep = () => {
    if (step === "D") setStep("C");
    else if (step === "C") setStep("B");
    else if (step === "B") setStep("A");
  };

  // We need a method to update our formData
  const handleChangeInput = (nameOrEvent: any, value?: any) => {
    let fieldName: string;
    let fieldValue: any;

    // Check if the first argument is an event
    if (typeof nameOrEvent === "object" && nameOrEvent.target) {
      fieldName = nameOrEvent.target.name;
      fieldValue =
        nameOrEvent.target.type === "checkbox"
          ? nameOrEvent.target.checked
          : nameOrEvent.target.value;
    } else {
      // Handle manual updates (e.g., from a button click)
      fieldName = nameOrEvent;
      fieldValue = value;
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: fieldValue,
    }));
  };

  // We need a method to do final operation
  const handleSubmitFormData = async () => {
    console.log("inside handle submit");

    // Check if terms are agreed
    if (formData.agreeToTerms !== true) {
      // Assuming "Yes" means agreed
      alert("Error!!!!!!   You must agree to Terms of Services!!!!");
      return; // This stops the execution of the rest of the function
    }

    // Proceed only if the auth token exists
    if (!authTokens?.access) {
      console.error("No authentication token available.");
      return; // Stops execution if no auth token
    }

    console.log("About to update preferences from my service.");

    try {
      // Call the updateSettings function, passing the auth tokens and the current settings state.
      const response = await updatePreferances(authTokens, formData);
      console.log("Settings updated successfully:", response);
      setStep("Final"); // Proceed to the final step
      // Optionally, you could refresh the settings from the server again here, or handle any post-update logic.
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  useEffect(() => {
    console.log("Form Data at beginning: ", formData);
  }, [formData]);

  // Section for render StepNumbers
  const renderTopStepNumbers = () => {
    if (!showStepNumber || step === "Final") {
      return null;
    }
    return (
      <section className="mt-2  flex justify-between">
        {stepsArray.map((item) => (
          <div
            key={item}
            className={`w-8 h-8 flex justify-center items-center border-2 border-gray-600 rounded-full cursor-pointer ${
              item === step ? "bg-orange-500" : ""
            }`}
            onClick={() => setStep(item)}
          >
            {item}
          </div>
        ))}
      </section>
    );
  };

  return (
    <div className="w-[600px] min-h-[28vh] max-w-full px-6 py-1 mx-auto rounded-lg border-2 border-dotted border-orange-400">
      {renderTopStepNumbers()}

      {/* // Render Steps */}
      {step === "A" ? (
        <StepA
          formData={formData}
          handleChangeInput={handleChangeInput}
          handleNextStep={handleNextStep}
        />
      ) : null}
      {step === "B" ? (
        <StepB
          formData={formData}
          handleChangeInput={handleChangeInput}
          handlePrevStep={handlePrevStep}
          handleNextStep={handleNextStep}
        />
      ) : null}
      {step === "C" ? (
        <StepC
          formData={formData}
          handleChangeInput={handleChangeInput}
          handlePrevStep={handlePrevStep}
          handleNextStep={handleNextStep}
        />
      ) : null}
      {step === "D" ? (
        <StepD
          formData={formData}
          handleChangeInput={handleChangeInput}
          handlePrevStep={handlePrevStep}
          handleSubmitFormData={handleSubmitFormData}
        />
      ) : null}
      {step === "Final" ? <StepFinal /> : null}
    </div>
  );
};

export default MultiStepForm;
