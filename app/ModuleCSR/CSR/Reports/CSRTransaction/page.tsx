"use client";

import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";

import { ToastContainer, toast } from "react-toastify";
import Table from "../../../components/Reports/CSRTransaction/Table";
import SearchFilters from "../../../components/Reports/CSRTransaction/SearchFilters";
import Pagination from "../../../components/Reports/CSRTransaction/Pagination";

interface User {
    ReferenceID: string;
    Firstname: string;
    Lastname: string;
    Email?: string;
    Role?: string;
    userName?: string;
    [key: string]: any;
}

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
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    const [usersList, setUsersList] = useState<User[]>([]);

    const fetchPosts = async (refId: string) => {
        try {
            const res = await fetch(`/api/ModuleSales/Task/DailyActivity/FetchInquiries`);
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

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/getUsers"); // API endpoint mo
                const data = await response.json();
                setUsersList(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    // Search & filter
    useEffect(() => {
        let filtered = posts;

        // Filter by typeclient === "CSR Inquiries"
        filtered = filtered.filter(post => post.typeclient === "CSR Inquiries");

        // Search filter
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter((post) =>
                Object.values(post).some((value) =>
                    value
                        ? String(value).toLowerCase().includes(lowerSearch)
                        : false
                )
            );
        }

        // Date range filter
        if (startDate || endDate) {
            filtered = filtered.filter((post) => {
                const postDate = post?.date_created ? new Date(post.date_created) : null;
                if (!postDate) return false;

                const meetsStart = !startDate || postDate >= new Date(startDate);
                const meetsEnd = !endDate || postDate <= new Date(endDate + "T23:59:59");

                return meetsStart && meetsEnd;
            });
        }

        // Sort by createdAt (latest first)
        filtered = filtered.sort((a, b) => {
            const dateA = new Date(a.date_created).getTime();
            const dateB = new Date(b.date_created).getTime();
            return dateB - dateA; // descending
        });

        setFilteredPosts(filtered);
    }, [posts, searchTerm, startDate, endDate]);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    return (
        <SessionChecker>
            <ParentLayout>
                <div className="container mx-auto p-4 text-gray-900">
                    <div className="grid grid-cols-1">
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
                                usersList={usersList} // <-- pass the users list here
                            />
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => setCurrentPage(page)}
                                postsPerPage={postsPerPage}
                                onPageLengthChange={(value) => {
                                    setPostsPerPage(value);
                                    setCurrentPage(1);
                                }}
                                posts={filteredPosts}
                            />

                        </div>
                    </div>
                </div>

                <ToastContainer className="text-xs" autoClose={1000} />
            </ParentLayout>
        </SessionChecker>
    );
}
