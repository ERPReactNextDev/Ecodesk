"use client";

import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";

import { ToastContainer, toast } from "react-toastify";
import Form from "../../../components/Reports/SKU/Form";
import Table from "../../../components/Reports/SKU/Table";
import SearchFilters from "../../../components/Reports/SKU/SearchFilters";
import Pagination from "../../../components/Reports/SKU/Pagination";
import { FiX, FiTrash2 } from "react-icons/fi";

export default function Post() {
    const [userDetails, setUserDetails] = useState({
        UserId: "",
        ReferenceID: "",
        Firstname: "",
        Lastname: "",
        Email: "",
        Role: "",
        userName: "",
    });

    const [posts, setPosts] = useState<any[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [confirmStep, setConfirmStep] = useState(false);
    const [postData, setPostData] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);

    const initialFormState = {
        createdAt: "",
        CompanyName: "",
        ItemCategory: "",
        ItemCode: "",
        ItemDescription: "",
        Quantity: "",
        Remarks: "",
        ReferenceID: "",
        userName: "",
        Inquiries: "",
        createdBy: "",
    };

    const fetchPosts = async (refId: string) => {
        try {
            const res = await fetch(`/api/Backend/Ticket/fetch?id=${refId}`);
            const json = await res.json();
            setPosts(json.data || []);
        } catch {
            toast.error("Failed to fetch tickets.", { position: "bottom-right" });
        }
    };

    useEffect(() => {
        const userId = new URLSearchParams(window.location.search).get("id");
        if (!userId) return;

        (async () => {
            try {
                const res = await fetch(`/api/Backend/user?id=${encodeURIComponent(userId)}`);
                const data = await res.json();
                setUserDetails({
                    UserId: data._id,
                    ReferenceID: data.ReferenceID ?? "",
                    Firstname: data.Firstname ?? "",
                    Lastname: data.Lastname ?? "",
                    Email: data.Email ?? "",
                    Role: data.Role ?? "",
                    userName: data.userName ?? "",
                });
                fetchPosts(data.ReferenceID);
            } catch {
                toast.error("Failed to fetch user data.", { position: "bottom-right" });
            }
        })();
    }, []);

    // Search & filter
    useEffect(() => {
        let filtered = posts;

        // Filter by user ReferenceID
        if (userDetails.ReferenceID) {
            filtered = filtered.filter(
                (post) => post.ReferenceID === userDetails.ReferenceID
            );
        }

        // Filter by search term
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter((post) =>
                Object.values(post).some((value) =>
                    value ? String(value).toLowerCase().includes(lowerSearch) : false
                )
            );
        }

        // Filter by date range
        if (startDate || endDate) {
            filtered = filtered.filter((post) => {
                const postDate = post?.createdAt ? new Date(post.createdAt) : null;
                if (!postDate) return false;

                const meetsStart = !startDate || postDate >= new Date(startDate);
                const meetsEnd =
                    !endDate || postDate <= new Date(endDate + "T23:59:59");

                return meetsStart && meetsEnd;
            });
        }

        // Filter by remarks (case-insensitive)
        filtered = filtered.filter((post) => {
            const r = post.Remarks?.trim() || "";
            return (
                r === "Item Not Carried" ||
                r === "Non Standard Item" ||
                r === "No Stocks / Insufficient Stocks"
            );
        });

        // Sort by createdAt (latest first)
        filtered = filtered.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA; // descending
        });

        setFilteredPosts(filtered);
    }, [posts, searchTerm, startDate, endDate, userDetails.ReferenceID]);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const handleEdit = (post: any) => {
        setPostData(post);
        setEditingPostId(post._id);
        setIsEditMode(true);
        setShowForm(true);
    };

    const handleDeleteClick = (id: string) => {
        setDeleteTargetId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteTargetId) return;
        try {
            const res = await fetch(`/api/Backend/Ticket/delete?id=${deleteTargetId}`, { method: "DELETE" });
            const result = await res.json();
            if (res.ok) {
                toast.success("Ticket deleted", { position: "bottom-right" });
                fetchPosts(userDetails.ReferenceID);
            } else {
                toast.error(result.message || "Delete failed", { position: "bottom-right" });
            }
        } catch {
            toast.error("Error deleting ticket", { position: "bottom-right" });
        } finally {
            setShowDeleteModal(false);
            setDeleteTargetId(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeleteTargetId(null);
        setConfirmStep(false); // reset step kapag ni-cancel
    };

    return (
        <SessionChecker>
            <ParentLayout>
                <div className="container mx-auto p-4 text-gray-900">
                    <div className="grid grid-cols-1">
                        {/* Form Modal */}
                        {showForm && (
                            <div className="fixed inset-0 z-[999] overflow-hidden">
                                <div
                                    className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 animate-fadeIn"
                                    onClick={() => {
                                        setShowForm(false);
                                        setIsEditMode(false);
                                        setEditingPostId(null);
                                    }}
                                />
                                <div
                                    className={`absolute bottom-0 left-0 w-full h-[90vh] bg-white shadow-xl overflow-y-auto transform transition-transform duration-300 ease-out ${showForm ? "animate-slideUp" : "translate-y-full"
                                        }`}
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-lg font-bold text-gray-800 uppercase">
                                                {isEditMode ? "Edit Ticket" : "New Ticket"}
                                            </h3>
                                            <button
                                                onClick={() => {
                                                    setShowForm(false);
                                                    setIsEditMode(false);
                                                    setEditingPostId(null);
                                                }}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <FiX className="text-xl" />
                                            </button>
                                        </div>
                                        <Form
                                            showForm={showForm}
                                            isEditMode={isEditMode}
                                            postData={postData}
                                            initialFormState={initialFormState}
                                            setPostData={setPostData}
                                            setShowForm={setShowForm}
                                            setIsEditMode={setIsEditMode}
                                            editingPostId={editingPostId}
                                            setEditingPostId={setEditingPostId}
                                            userDetails={userDetails}
                                            fetchPosts={fetchPosts}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Table and Filters */}
                        <div className="mb-4 p-4 bg-white shadow-md rounded-lg text-gray-900">
                            <SearchFilters
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                startDate={startDate}
                                setStartDate={setStartDate}
                                endDate={endDate}
                                setEndDate={setEndDate}
                            />
                            <Table
                                currentPosts={currentPosts}
                                handleEdit={handleEdit}
                                handleDelete={handleDeleteClick} // updated
                            />
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => setCurrentPage(page)}
                                postsPerPage={postsPerPage}
                                onPageLengthChange={(value) => {
                                    setPostsPerPage(value);
                                    setCurrentPage(1); // reset to first page when page size changes
                                }}
                                posts={filteredPosts} // ✅ ipasa dito yung array na may createdAt
                            />

                        </div>
                    </div>

                    {/* Delete Confirmation Modal */}
                    {showDeleteModal && (
                        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
                            {/* Overlay */}
                            <div
                                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                                onClick={cancelDelete}
                            />

                            {/* Modal Content */}
                            <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md z-10 animate-fadeIn">
                                {!confirmStep ? (
                                    <>
                                        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                                        <p className="text-sm mb-6">
                                            Are you sure you want to delete this ticket?
                                        </p>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={cancelDelete}
                                                className="flex items-center gap-1 px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm"
                                            >
                                                <FiX /> Cancel
                                            </button>
                                            <button
                                                onClick={() => setConfirmStep(true)}
                                                className="flex items-center gap-1 px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
                                            >
                                                <FiTrash2 /> Delete
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-lg font-semibold mb-4">Are you really sure?</h3>
                                        <p className="text-sm mb-6 text-red-600">
                                            This action is <strong>irreversible</strong> and the data cannot be recovered!
                                        </p>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={cancelDelete}
                                                className="flex items-center gap-1 px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm"
                                            >
                                                <FiX /> Cancel
                                            </button>
                                            <button
                                                onClick={confirmDelete}
                                                className="flex items-center gap-1 px-4 py-2 rounded bg-red-800 hover:bg-red-900 text-white text-sm"
                                            >
                                                <FiTrash2 /> Delete Permanently
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <ToastContainer className="text-xs" autoClose={1000} />
            </ParentLayout>
        </SessionChecker>
    );
}
