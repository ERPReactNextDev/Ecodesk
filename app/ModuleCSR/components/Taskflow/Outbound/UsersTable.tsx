import React, { useMemo, useRef, useState } from "react";
import { CiClock2 } from "react-icons/ci";
import Pagination from "./Pagination";

const SCROLL_SPEED = 50;
const ITEMS_PER_PAGE = 10; // para 5 lang per page

interface OutboundTableProps {
    posts: any[];
}

const getTypeOfClientColor = (type: string) => {
    switch (type) {
        case "Successful":
            return "bg-green-100";
        case "Unsuccessful":
            return "bg-red-100";
        default:
            return "";
    }
};

const calculateTimeConsumed = (startDate?: string, endDate?: string) => {
    if (!startDate || !endDate) return "N/A";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInSeconds = (end.getTime() - start.getTime()) / 1000;
    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = Math.floor(diffInSeconds % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
};

const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    const formattedDateStr = date.toLocaleDateString("en-US", {
        timeZone: "UTC",
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    return `${formattedDateStr} ${hours}:${minutesStr} ${ampm}`;
};

const OutboundTable: React.FC<OutboundTableProps> = ({ posts }) => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const animationFrameId = useRef<number | null>(null);

    const [currentPage, setCurrentPage] = useState(1);

    const sortedPosts = useMemo(() => {
        return posts
            .filter((post) => post?.typeactivity === "Outbound calls")
            .sort((a, b) => {
                const dateA = a?.startdate ? new Date(a.startdate).getTime() : 0;
                const dateB = b?.startdate ? new Date(b.startdate).getTime() : 0;
                return dateB - dateA;
            });
    }, [posts]);

    // Pagination logic
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedPosts = sortedPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const totalPages = Math.ceil(sortedPosts.length / ITEMS_PER_PAGE);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        if (animationFrameId.current) return;

        animationFrameId.current = requestAnimationFrame(() => {
            const { left, right } = scrollRef.current!.getBoundingClientRect();
            const x = e.clientX;
            const edgeThreshold = 100;

            if (x - left < edgeThreshold) {
                scrollRef.current!.scrollBy({ left: -SCROLL_SPEED });
            } else if (right - x < edgeThreshold) {
                scrollRef.current!.scrollBy({ left: SCROLL_SPEED });
            }

            animationFrameId.current = null;
        });
    };

    return (
        <div>
            <div
                ref={scrollRef}
                onMouseMove={handleMouseMove}
                className="overflow-x-auto max-w-full border rounded"
                style={{ cursor: "pointer" }}
            >
                {paginatedPosts.length > 0 ? (
                    <table className="min-w-full table-auto">
                        <thead className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white">
                            <tr className="text-xs text-left whitespace-nowrap border-l-4 border-emerald-400">
                                <th className="px-6 py-4 font-semibold">Account Name</th>
                                <th className="px-6 py-4 font-semibold">Contact Person</th>
                                <th className="px-6 py-4 font-semibold">Contact Number</th>
                                <th className="px-6 py-4 font-semibold">Email</th>
                                <th className="px-6 py-4 font-semibold">Type of Client</th>
                                <th className="px-6 py-4 font-semibold">Type of Call</th>
                                <th className="px-6 py-4 font-semibold">Call Status</th>
                                <th className="px-6 py-4 font-semibold">Remarks</th>
                                <th className="px-6 py-4 font-semibold">Agent / TSM</th>
                                <th className="px-6 py-4 font-semibold">Call Duration</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedPosts.map((post, index) => (
                                <tr
                                    key={post?._id || index}
                                    className={`hover:bg-gray-50 ${getTypeOfClientColor(post?.callstatus)}`}
                                >
                                    <td className="px-6 py-6 text-xs uppercase">{post?.companyname || "N/A"}</td>
                                    <td className="px-6 py-6 text-xs capitalize">{post?.contactperson || "N/A"}</td>
                                    <td className="px-6 py-6 text-xs">{post?.contactnumber || "N/A"}</td>
                                    <td className="px-6 py-6 text-xs">{post?.emailaddress || "N/A"}</td>
                                    <td className="px-6 py-6 text-xs">{post?.typeclient || "N/A"}</td>
                                    <td className="px-6 py-6 text-xs">{post?.typecall || "N/A"}</td>
                                    <td className="px-6 py-6 text-xs">{post?.callstatus || "N/A"}</td>
                                    <td className="px-6 py-6 text-xs capitalize">{post?.remarks || "N/A"}</td>
                                    <td className="px-6 py-6 text-xs capitalize">
                                        {post?.AgentFirstname} {post?.AgentLastname} / {post?.ManagerFirstname} {post?.ManagerLastname}
                                    </td>
                                    <td className="px-6 py-6 text-xs flex items-center gap-1">
                                        <CiClock2 size={13} className="text-gray-900" />
                                        <span className="italic">
                                            {formatDate(post.startdate)} - {formatDate(post.enddate)} ({calculateTimeConsumed(post.startdate, post.enddate)})
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center py-4 text-sm">No outbound calls available</div>
                )}
            </div>

            {/* Pagination Controls */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
};

export default OutboundTable;
