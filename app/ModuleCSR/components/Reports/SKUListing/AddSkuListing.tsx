"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import SkuFormFields from "./SkuFormFields";
import { FetchUserName } from "./FetchUsername";

interface OptionType {
    value: string;
    label: string;
}

interface AddSkuListingProps {
    onCancel: () => void;
    refreshPosts: () => void;
    userName: string;
    editPost?: any;
}

const AddSkuListing: React.FC<AddSkuListingProps> = ({ onCancel, refreshPosts, editPost }) => {
    const [UserID, setUserID] = useState("");
    const [userName, setuserName] = useState("");
    const [CompanyName, setCompanyName] = useState(editPost ? editPost.CompanyName : "");
    const [Remarks, setRemarks] = useState(editPost ? editPost.Remarks : "");
    const [ItemCode, setItemCode] = useState(editPost ? editPost.ItemCode : "");
    const [ItemDescription, setItemDescription] = useState(editPost ? editPost.ItemDescription : "");
    const [QtySold, setQtySold] = useState(editPost ? editPost.QtySold : "");

    // SalesAgent as OptionType
    const [SalesAgent, setSalesAgent] = useState<OptionType | null>(
        editPost
            ? { value: editPost.SalesAgent, label: editPost.SalesAgentName || "" }
            : null
    );
    const [SalesAgentName, setSalesAgentName] = useState(editPost ? editPost.SalesAgentName || "" : "");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get("id");
        if (userId) {
            FetchUserName(userId, setuserName);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editPost
            ? `/api/ModuleCSR/SkuListing/EditSku`
            : `/api/ModuleCSR/SkuListing/CreateSku`;
        const method = editPost ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userName,
                CompanyName,
                Remarks,
                ItemCode,
                ItemDescription,
                QtySold,
                SalesAgent: SalesAgent?.value || "",  // send only value
                SalesAgentName,                       // send name as well
                id: editPost ? editPost._id : undefined,
            }),
        });

        if (response.ok) {
            toast.success(editPost ? "Account updated successfully" : "Account added successfully", {
                autoClose: 1000,
                onClose: () => {
                    onCancel();
                    refreshPosts();
                }
            });
        } else {
            toast.error(editPost ? "Failed to update account" : "Failed to add account", {
                autoClose: 1000
            });
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 text-xs">
                <h2 className="text-xs font-bold mb-4">
                    {editPost ? "Edit Account" : "Add New Account"}
                </h2>

                <SkuFormFields
                    userName={userName}
                    setuserName={setuserName}
                    UserID={UserID}
                    setUserID={setUserID}
                    CompanyName={CompanyName}
                    setCompanyName={setCompanyName}
                    Remarks={Remarks}
                    setRemarks={setRemarks}
                    ItemCode={ItemCode}
                    setItemCode={setItemCode}
                    ItemDescription={ItemDescription}
                    setItemDescription={setItemDescription}
                    QtySold={QtySold}
                    setQtySold={setQtySold}
                    SalesAgent={SalesAgent?.value || ""} // for compatibility
                    setSalesAgent={(value: string) => {
                        setSalesAgent({ value, label: "" }); // label will be updated in SkuFormFields
                    }}
                    SalesAgentName={SalesAgentName}
                    setSalesAgentName={setSalesAgentName}
                    editPost={editPost}
                />

                <div className="flex justify-between mt-4">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded text-xs">
                        {editPost ? "Update" : "Submit"}
                    </button>
                    <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded text-xs" onClick={onCancel}>
                        Back
                    </button>
                </div>
            </form>

            <ToastContainer className="text-xs" autoClose={1000} />
        </>
    );
};

export default AddSkuListing;
