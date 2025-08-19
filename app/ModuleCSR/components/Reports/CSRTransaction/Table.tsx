"use client";

import React, { useEffect, useState } from "react";
import { FiX, FiMail } from "react-icons/fi";
import {
  FaTicketAlt,
  FaUser,
  FaClipboardCheck,
  FaQuestionCircle,
  FaCommentAlt,
  FaUserTie,
  FaUserShield,
  FaClock,
  FaCalendarAlt,
  FaFilter,
} from "react-icons/fa";
import Export from "./Export";
import Filters from "./Filters";

interface Product {
  _id?: string;
  ticketreferencenumber?: string;
  companyname?: string;
  date_created?: string;
  contact_person?: string;
  contactnumber?: string;
  emailaddress?: string;
  wrapup?: string;
  inquiries?: string;
  remarks?: string;
  referenceid?: string; // for agent lookup
  tsm?: string; // for manager lookup
  AgentFirstname?: string;
  AgentLastname?: string;
  ManagerFirstname?: string;
  ManagerLastname?: string;
  startdate?: string;
  enddate?: string;
  [key: string]: any;
}

interface User {
  ReferenceID: string;
  Firstname: string;
  Lastname: string;
}

interface TableProps {
  currentPosts: Product[];
  usersList: User[];
}

const Table: React.FC<TableProps> = ({ currentPosts, usersList }) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    wrapup: "",
  });
  const [filteredPosts, setFilteredPosts] = useState<Product[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Map agent and manager names
  useEffect(() => {
    const mappedPosts = currentPosts.map((post) => {
      const agent = usersList.find((user) => user.ReferenceID === post.referenceid);
      const manager = usersList.find((user) => user.ReferenceID === post.tsm);

      return {
        ...post,
        AgentFirstname: agent?.Firstname || "Unknown",
        AgentLastname: agent?.Lastname || "Unknown",
        ManagerFirstname: manager?.Firstname || "Unknown",
        ManagerLastname: manager?.Lastname || "Unknown",
      };
    });
    setFilteredPosts(mappedPosts);
  }, [currentPosts, usersList]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const formatDate = (date?: string | null) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateTimeConsumed = (start?: string, end?: string) => {
    if (!start || !end) return "-";
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const minutes = Math.floor(diff / 60000);
    return `${minutes} min`;
  };

  // Apply filters (using full names for Agent & Manager)
  const displayedPosts = filteredPosts.filter((post) =>
    Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      if (key === "AgentLastname") {
        return `${post.AgentFirstname} ${post.AgentLastname}`
          .toLowerCase()
          .includes(value.toLowerCase());
      }
      if (key === "ManagerLastname") {
        return `${post.ManagerFirstname} ${post.ManagerLastname}`
          .toLowerCase()
          .includes(value.toLowerCase());
      }
      return (post as any)[key]?.toLowerCase().includes(value.toLowerCase());
    })
  );

  // Group by company
  const groupedPosts = displayedPosts.reduce((acc: Record<string, Product[]>, post) => {
    const company = post.companyname || "No Company";
    if (!acc[company]) acc[company] = [];
    acc[company].push(post);
    return acc;
  }, {});

  const totalPages = selectedCompany
    ? Math.ceil(groupedPosts[selectedCompany].length / 10)
    : 1;

  const handleCompanyClick = (company: string) => {
    setSelectedCompany(company);
    setCurrentPage(1);
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-gray-800">Daily CSR Transaction</h2>
          <p className="text-[10px] text-gray-600 max-w-xl leading-relaxed">
            The Daily CSR Transaction section displays essential details of customer service interactions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center justify-center gap-2 px-3 py-3 text-xs font-semibold rounded-lg bg-gray-500 text-white shadow-sm hover:bg-emerald-700 hover:shadow-md transition-colors"
          >
            <FaFilter />
            Filter
          </button>
          <Export currentPosts={currentPosts} />
        </div>
      </div>

      {filtersOpen && (
        <Filters
          filters={filters}
          currentPosts={currentPosts}
          handleFilterChange={handleFilterChange}
        />
      )}

      {/* Table */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 whitespace-nowrap">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Ticket Ref</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Company Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Object.keys(groupedPosts).length > 0 ? (
            Object.entries(groupedPosts).map(([company, posts]) => (
              <tr
                key={company}
                className="cursor-pointer hover:bg-gray-100 transition-colors duration-200 whitespace-nowrap"
                onClick={() => handleCompanyClick(company)}
              >
                <td className="px-6 py-4 text-xs text-gray-700 uppercase">{posts[0].ticketreferencenumber || "-"}</td>
                <td className="px-6 py-4 text-xs text-gray-700">{company}</td>
                <td className="px-6 py-4 text-xs text-gray-700">{formatDate(posts[0].date_created)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-auto px-4 py-6">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-xl z-10 animate-fadeIn flex flex-col max-h-[80vh]">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <FaTicketAlt className="text-gray-500" /> {selectedCompany}
              </h3>
              <button
                onClick={() => setSelectedCompany(null)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Card container */}
            <div className="flex-1 overflow-auto grid grid-cols-1 gap-4">
              {groupedPosts[selectedCompany]
                .slice((currentPage - 1) * 10, currentPage * 10)
                .map((post, idx) => (
                  <div
                    key={`${post._id ?? idx}-${post.ticketreferencenumber}`}
                    className="border rounded-lg p-4 shadow-sm hover:shadow-md transition text-xs flex flex-col gap-1"
                  >
                    <p className="flex items-center gap-2"><FaTicketAlt className="text-gray-400" /> <strong>Ticket Ref:</strong> {post.ticketreferencenumber || "-"}</p>
                    <p className="flex items-center gap-2"><FaUser className="text-gray-400" /> <strong>Contact:</strong> {post.contact_person || "-"} - {post.contactnumber || "-"}</p>
                    <p className="flex items-center gap-2"><FiMail className="text-gray-400" /> <strong>Email:</strong> {post.emailaddress || "-"}</p>
                    <p className="flex items-center gap-2 capitalize"><FaClipboardCheck className="text-gray-400" /> <strong>Wrap Up:</strong> {post.wrapup || "-"}</p>
                    <p className="flex items-center gap-2 capitalize"><FaQuestionCircle className="text-gray-400" /> <strong>Inquiry:</strong> {post.inquiries || "-"}</p>
                    <p className="flex items-center gap-2 capitalize"><FaCommentAlt className="text-gray-400" /> <strong>Remarks:</strong> {post.remarks || "-"}</p>
                    <p className="flex items-center gap-2 capitalize"><FaUserTie className="text-gray-400" /> <strong>Agent:</strong> {post.AgentFirstname} {post.AgentLastname}</p>
                    <p className="flex items-center gap-2 capitalize"><FaUserShield className="text-gray-400" /> <strong>Manager:</strong> {post.ManagerFirstname} {post.ManagerLastname}</p>
                    <p className="flex items-center gap-2"><FaClock className="text-gray-400" /> <strong>Time Consumed:</strong> {calculateTimeConsumed(post.startdate, post.enddate)}</p>
                    <p className="flex items-center gap-2"><FaCalendarAlt className="text-gray-400" /> <strong>Date:</strong> {formatDate(post.date_created)}</p>
                  </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-xs bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-2 py-1 text-xs">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-xs bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
