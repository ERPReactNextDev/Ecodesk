"use client";

import React, { useState } from "react";
import AccountTab from "./Tabs/AccountTab";
import TrackingTab from "./Tabs/TrackingTab";
import { LuClipboardList } from 'react-icons/lu';
import { FiUser, FiCheck, FiX, } from "react-icons/fi";

interface FormFieldsProps {
  postData: any;
  handleChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: any } }
  ) => void;
  setPostData: React.Dispatch<React.SetStateAction<any>>;
  setShowForm: (show: boolean) => void;
  setIsEditMode: (edit: boolean) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isEditMode: boolean;
  initialFormState: any;
}

const FormFields: React.FC<FormFieldsProps> = ({
  postData,
  handleChange,
  setPostData,
  setShowForm,
  setIsEditMode,
  handleSubmit,
  isEditMode,
  initialFormState,
}) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 4;
  const [activeTab, setActiveTab] = useState<"account" | "trackingtab">("account");

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Instead of directly submitting, open modal first
  const handlePreSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const confirmSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setShowConfirmModal(false);
    handleSubmit(e); // call original handleSubmit
  };

  return (
    <>
      <form
        onSubmit={handlePreSubmit}
        className="text-xs flex flex-col md:flex-row h-full"
        style={{ minHeight: "80vh" }}
      >
        {/* Tabs */}
        <div className="hidden md:flex w-60 border-r pr-1 border-gray-300 flex-col">
          <button
            type="button"
            className={`flex items-center gap-2 px-4 py-4 rounded text-left ${activeTab === "account"
                ? "bg-blue-900 text-white"
                : "hover:bg-gray-100"
              }`}
            onClick={() => setActiveTab("account")}
          >
            <FiUser className="text-lg" />
            Account Information
          </button>

          <button
            type="button"
            className={`flex items-center gap-2 px-4 py-4 rounded text-left ${activeTab === "trackingtab"
                ? "bg-blue-900 text-white"
                : "hover:bg-gray-100"
              }`}
            onClick={() => setActiveTab("trackingtab")}
          >
            <LuClipboardList className="text-lg" />
            Tracking Information
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4">
            {/* Mobile */}
            <div className="md:hidden">
              {step === 1 && (
                <AccountTab postData={postData} handleChange={handleChange} />
              )}
              {step === 2 && (
                <TrackingTab postData={postData} handleChange={handleChange} />
              )}
            </div>

            {/* Desktop */}
            <div className="hidden md:block">
              {activeTab === "account" && (
                <AccountTab postData={postData} handleChange={handleChange} />
              )}
              {activeTab === "trackingtab" && (
                <TrackingTab postData={postData} handleChange={handleChange} />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between p-4 border-t bg-white">
            {/* Mobile navigation */}
            <div className="md:hidden flex justify-between w-full">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className={`px-4 py-2 rounded text-white ${step === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                Prev
              </button>
              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700"
                  >
                    {isEditMode ? "Update" : "Save"}
                  </button>
                  <button
                    type="button"
                    className="px-4 py-3 rounded-lg bg-gray-400 text-white hover:bg-gray-600"
                    onClick={() => {
                      setShowForm(false);
                      setIsEditMode(false);
                      setPostData(initialFormState);
                      setStep(1);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Desktop */}
            <div className="hidden md:flex gap-2 ml-auto">
              <button
                type="submit"
                className="flex items-center gap-1 px-4 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                <FiCheck /> {isEditMode ? "Update" : "Save"}
              </button>
              <button
                type="button"
                className="flex items-center gap-1 px-4 py-3 rounded-lg bg-gray-400 text-white hover:bg-gray-600"
                onClick={() => {
                  setShowForm(false);
                  setIsEditMode(false);
                  setPostData(initialFormState);
                  setStep(1);
                }}
              >
                <FiX /> Cancel
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">
              {isEditMode ? "Confirm Update" : "Confirm Save"}
            </h2>
            <div className="max-h-60 overflow-y-auto text-xs space-y-2">
              {Object.entries(postData).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between border-b py-1 text-gray-700"
                >
                  <span className="font-medium">{key}</span>
                  <span className="text-right capitalize italic">{String(value)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-4 text-xs">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex items-center gap-1 px-4 py-3 rounded-lg bg-gray-400 text-white hover:bg-gray-600"
              >
                <FiX /> Cancel
              </button>
              <button
                onClick={(e: any) => confirmSubmit(e)}
                className="flex items-center gap-1 px-4 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                <FiCheck /> Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormFields;
