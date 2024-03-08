import React, { useContext, useEffect, useState } from "react";
import StepA from "./StepA";
import StepB from "./StepB";
import StepC from "./StepC";
import StepD from "./StepD";
import StepFinal from "./StepFinal";
import AuthContext from "../../../../../context/AuthContext";
import {
  updatePreferances,
  updateSettings,
} from "../../../../../services/JournalService";

const initialFormData = {
  firstName: "",
  lastName: "",
  preferred_type: "",
  preferred_style: "",
  responseType: "",
  agreeToTerms: "", //changed this from false
};

const stepsArray = ["A", "B", "C", "D"];
interface MultiStepFormProps {
  showStepNumber: boolean;
}
const { authTokens } = useContext(AuthContext) ?? {};

const MultiStepForm: React.FC<MultiStepFormProps> = ({ showStepNumber }) => {
  const [step, setStep] = useState("A");
  const [formData, setFormData] = useState(initialFormData);

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
    // Here You can do final Validation and then Submit Your form
    if (!formData.agreeToTerms) {
      alert("Error!!!!!!   You must agree to Terms of Services!!!!");
    } else {
      // fixes auth token error
      if (!authTokens?.access) {
        console.error("No authentication token available.");
        return;
      }
      console.log("About to update preferences from my service.");

      try {
        // Call the updateSettings function, passing the auth tokens and the current settings state.
        const response = await updatePreferances(authTokens, formData);
        console.log("Settings updated successfully:", response);
        setStep("Final");
        // Optionally, you could refresh the settings from the server again here, or handle any post-update logic.
      } catch (error) {
        console.error("Error updating settings:", error);
      }
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
      <section className="mt-2 mb-4 flex justify-between">
        {stepsArray.map((item) => (
          <div
            key={item}
            className={`w-8 h-8 flex justify-center items-center border-2 border-gray-600 rounded-full cursor-pointer ${
              item === step ? "bg-blue-500" : ""
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
    <div className="w-[600px] max-w-full px-6 py-1 mx-auto rounded-lg border-2 border-dotted border-sky-300">
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
