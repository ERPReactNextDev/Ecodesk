"use client";

import React from "react";
import { toast } from "react-toastify";
import FormFields from "./FormFields";

interface FormProps {
  showForm: boolean;
  isEditMode: boolean;
  postData: any;
  initialFormState: any;
  setPostData: (data: any) => void;
  setShowForm: (val: boolean) => void;
  setIsEditMode: (val: boolean) => void;
  editingPostId: string | null;
  setEditingPostId: (val: string | null) => void;
  userDetails: any;
  fetchPosts: (refId: string) => void;
}

const Form: React.FC<FormProps> = ({
  showForm,
  isEditMode,
  postData,
  initialFormState,
  setPostData,
  setShowForm,
  setIsEditMode,
  editingPostId,
  setEditingPostId,
  userDetails,
  fetchPosts,
}) => {
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: any } }
  ) => {
    const { name, value } =
      "target" in e && e.target
        ? e.target
        : { name: "", value: undefined };

    if (!name) return;

    setPostData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Always include ReferenceID and metadata
    const payload = {
      ...postData,
      ReferenceID: userDetails.ReferenceID,
      userName: userDetails.userName,
      Role: userDetails.Role,
      createdBy: userDetails.UserId,
    };

    console.log("✅ Submitting payload:", payload);

    const url = isEditMode
      ? `/api/Backend/Ticket/edit?id=${editingPostId}`
      : "/api/Backend/Ticket/create";

    const method = isEditMode ? "PUT" : "POST";

    try {
      // 🔹 First, create or update ticket
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(isEditMode ? "Data Updated!" : "Data Added!");
        // Reset form after submission
        setShowForm(false);
        setIsEditMode(false);
        setEditingPostId(null);
        setPostData(initialFormState);
        fetchPosts(userDetails.ReferenceID);
      } else {
        toast.error(result.message || "Error occurred.");
      }
    } catch (error) {
      console.error("❌ Failed to save data:", error);
      toast.error("Failed to save data.");
    }
  };

  if (!showForm) return null;

  return (
    <FormFields
      postData={postData}
      handleChange={handleChange}
      setPostData={setPostData}
      setShowForm={setShowForm}
      setIsEditMode={setIsEditMode}
      handleSubmit={handleSubmit}
      isEditMode={isEditMode}
      initialFormState={initialFormState}
    />
  );
};

export default Form;
