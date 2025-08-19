"use client";

import React, { useMemo, useState } from "react";
import { MdOutlineShowChart } from 'react-icons/md';

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Post {
  date_created: string;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  postsPerPage: number;
  onPageLengthChange: (value: number) => void;
  posts: Post[];
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  postsPerPage,
  onPageLengthChange,
  posts,
}) => {
  const [showChart, setShowChart] = useState(false);

  // ✅ Aggregate posts per createdAt (by date only)
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((post) => {
      const date = new Date(post.date_created).toLocaleDateString();
      counts[date] = (counts[date] || 0) + 1;
    });
    return Object.entries(counts).map(([date, count]) => ({
      date,
      count,
    }));
  }, [posts]);

  return (
    <div className="flex flex-col gap-4 mt-6 text-xs">
      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3">
        {/* Page Length Selector */}
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={postsPerPage}
            onChange={(e) => onPageLengthChange(Number(e.target.value))}
            className="border rounded px-4 py-3 text-xs"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>per page</span>
        </div>

        {/* Pagination + View Chart Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-3 border rounded-md ${currentPage === 1
              ? "text-gray-400 bg-gray-100 cursor-not-allowed"
              : "hover:bg-gray-200"
              }`}
          >
            Prev
          </button>

          <span>
            Page <b>{currentPage}</b> of <b>{totalPages}</b>
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-3 border rounded-md ${currentPage === totalPages
              ? "text-gray-400 bg-gray-100 cursor-not-allowed"
              : "hover:bg-gray-200"
              }`}
          >
            Next
          </button>

          {/* View/Hide Chart Toggle */}
          <button
            onClick={() => setShowChart((prev) => !prev)}
            className="px-3 py-3 border rounded-md hover:bg-gray-100 flex items-center gap-2"
          >
            <MdOutlineShowChart size={18} className="text-blue-600" />
            <span>{showChart ? "Hide Chart" : "View Chart"}</span>
          </button>

        </div>
      </div>

      {/* 📊 Line Chart (Hidden/Shown) */}
      {showChart && (
        <div className="w-full h-56 flex flex-col gap-2">
          {/* Chart Title */}
          <h3 className="text-center text-sm font-semibold text-gray-700">
            Total Counts Per Date
          </h3>

          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#2563eb"
                strokeWidth={1.5}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

    </div>
  );
};

export default Pagination;
