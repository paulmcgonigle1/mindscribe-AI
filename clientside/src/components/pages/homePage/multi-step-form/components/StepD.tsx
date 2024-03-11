import { useState } from "react";
import Modal from "../../../../shared/Modal";

type StepDProp = {
  formData: {
    firstName: string;
    lastName: string;
    preferred_type: string;
    preferred_style: string;
    responseType: string;
    agreeToTerms: boolean;
  };
  handleChangeInput: (fieldName: string, value: string | boolean) => void;
  handlePrevStep: () => void;
  handleSubmitFormData: () => void;
};

const StepD: React.FC<StepDProp> = ({
  formData,
  handleChangeInput,
  handlePrevStep,
  handleSubmitFormData,
}) => {
  // State to manage the visibility of the ToS modal
  const [showTermsModal, setShowTermsModal] = useState(false);
  // Toggle function for showing/hiding the ToS modal
  const toggleTermsModal = () => setShowTermsModal(!showTermsModal);

  const handleAgreeToTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChangeInput(e.target.name, e.target.checked);
  };
  return (
    <div>
      <h1 className="mt-2 text-xl font-bold text-blue-900">
        Step D: Confirm Form Data
      </h1>
      <DataConfirmRow label="First Name:" value={formData.firstName} />
      <DataConfirmRow label="Last Name:" value={formData.lastName} />
      <DataConfirmRow
        label="Preffered Message Style:"
        value={formData.preferred_type}
      />

      <DataConfirmRow
        label="Preffered Message Type :"
        value={formData.preferred_style}
      />
      <DataConfirmRow
        label="Message Response Type:"
        value={formData.responseType}
      />

      <p className="text-center">
        <button
          type="button"
          className="text-blue-600 hover:underline"
          onClick={toggleTermsModal}
        >
          Read Terms of Service
        </button>
      </p>

      {/* Checkbox for agreeing to terms */}
      <div className="my-4 flex items-center">
        <input
          type="checkbox"
          name="agreeToTerms"
          id="agreeToTerms"
          checked={formData.agreeToTerms === true}
          onChange={handleAgreeToTermsChange}
          className="w-4 h-4 mr-2 accent-pink-500"
        />
        <label htmlFor="agreeToTerms" className="text-slate-500">
          I Agree to the Terms of Services
        </label>
      </div>

      {/* Modal for displaying ToS */}
      <Modal isOpen={showTermsModal} onClose={toggleTermsModal}>
        <div className="overflow-y-auto max-h-[80vh] max-w-[80vh] p-5">
          {/* Your Terms of Service content here */}
          <h2 className="text-2xl font-semibold mb-4">Terms of Service</h2>
          <p className="space-y-4 text-justify">
            Welcome to [App Name]! These Terms of Service ("Terms") govern your
            use of [App Name], including all related tools, services, and
            features (collectively, the "Service") provided by [Your Company
            Name] ("we", "us", or "our"). By accessing or using the Service, you
            agree to be bound by these Terms. If you disagree with any part of
            the Terms, then you do not have permission to access the Service.
          </p>
          <h3 className="text-xl font-semibold">Privacy Policy</h3>
          <p className="space-y-4 text-justify">
            Your privacy is important to us. Please review our Privacy Policy,
            which also governs your use of the Service, to understand our
            practices.
          </p>
          <h3 className="text-xl font-semibold">Account Registration</h3>
          <p>
            To access certain features of the Service, you may be required to
            create an account. You agree to provide accurate, current, and
            complete information during the registration process and to update
            such information to keep it accurate, current, and complete.
          </p>
          <h3 className="text-xl font-semibold">Prohibited Uses</h3>
          <p>
            You agree not to use the Service in any manner that:
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                Violates any national, regional, or international law or
                regulation.
              </li>
              <li>
                Infringes on the rights of others, including copyright,
                trademark, privacy, or other personal or proprietary rights.
              </li>
              <li>
                Is harmful, fraudulent, deceptive, threatening, harassing,
                defamatory, obscene, or otherwise objectionable.
              </li>
            </ol>
          </p>
          <h3 className="text-xl font-semibold">Intellectual Property</h3>
          <p>
            The Service and its original content, features, and functionality
            are and will remain the exclusive property of [Your Company Name]
            and its licensors.
          </p>
          <h3 className="text-xl font-semibold">Termination</h3>
          <p>
            We may terminate or suspend your account and bar access to the
            Service immediately, without prior notice or liability, for any
            reason whatsoever, including, without limitation, a breach of the
            Terms.
          </p>
          <h3 className="text-xl font-semibold">Disclaimer</h3>
          <p>
            Your use of the Service is at your sole risk. The Service is
            provided on an "AS IS" and "AS AVAILABLE" basis. We disclaim all
            warranties of any kind, whether express or implied.
          </p>
          <h3 className="text-xl font-semibold">Limitation of Liability</h3>
          <p>
            In no event shall [Your Company Name], nor its directors, employees,
            partners, agents, suppliers, or affiliates, be liable for any
            indirect, incidental, special, consequential or punitive damages,
            including without limitation, loss of profits, data, use, goodwill,
            or other intangible losses, resulting from your access to or use of
            or inability to access or use the Service.
          </p>
          <h3 className="text-xl font-semibold">Governing Law</h3>
          <p>
            These Terms shall be governed by and construed in accordance with
            the laws of [Your Jurisdiction], without regard to its conflict of
            law provisions.
          </p>
          <h3 className="text-xl font-semibold">Changes</h3>
          <p>
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. By continuing to access or use our Service
            after those revisions become effective, you agree to be bound by the
            revised terms.
          </p>
          <h3 className="text-xl font-semibold mt-6">Contact Us</h3>
          <p>
            Your use of the Service is at your sole risk. The Service is
            provided on an "AS IS" and "AS AVAILABLE" basis. We disclaim all
            warranties of any kind, whether express or implied.
          </p>
        </div>
      </Modal>

      <div className="my-2 flex justify-between items-center">
        <button
          className="bg-yellow-400 px-4 py-2 rounded-xl"
          onClick={handlePrevStep}
        >
          Prev
        </button>
        <button
          className="bg-blue-400 px-4 py-2 rounded-xl"
          onClick={handleSubmitFormData}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default StepD;

// A Seperate component to show data
const DataConfirmRow = ({ label, value }: any) => {
  return (
    <div className="my-3 border border-dashed border-gray-200 p-1 rounded-lg">
      <span className="mr-4 text-slate-500">{label}</span>
      <span className="mr-4 text-slate-900">{value}</span>
    </div>
  );
};
