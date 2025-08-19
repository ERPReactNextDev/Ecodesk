"use client";

import React, { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { BiSolidMessageSquareEdit, BiSolidTrash, } from 'react-icons/bi';
import Export from "./Export";
import Filters from "./Filters";
import Confirm from "./Modal/Confirm";

interface Product {
  _id: string;
  userName: string;
  TicketReferenceNumber: string;
  TicketReceived: string;
  TicketEndorsed: string;
  CompanyName: string;
  CustomerName: string;
  ContactNumber: string;
  Email: string;
  Gender: string;
  CustomerSegment: string;
  CityAddress: string;
  Traffic: string;
  Channel: string;
  WrapUp: string;
  Source: string;
  SONumber: string;
  SOAmount: string;
  Quantity: string;
  PONumber: string;
  SODate: string;
  PaymentTerms: string;
  POSource: string;
  POStatus: string;
  PaymentDate: string;
  DeliveryDate: string;
  CustomerType: string;
  CustomerStatus: string;
  Status: string;
  Department: string;
  SalesManager: string;
  SalesAgent: string;
  Remarks: string;
  Inquiries: string;
}

interface TableProps {
  currentPosts: Product[];
  handleEdit: (product: Product) => void;
  handleDelete: (id: string) => void;
}

const Table: React.FC<TableProps> = ({ currentPosts, handleEdit, handleDelete }) => {
  const [managerMap, setManagerMap] = useState<Record<string, string>>({});
  const [agentMap, setAgentMap] = useState<Record<string, string>>({});
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    userName: "",
    Gender: "",
    Traffic: "",
    WrapUp: "",
    Channel: "",
    Source: "",
    CustomerStatus: "",
    Status: "",
    Department: "",
    SalesManager: "",
    SalesAgent: "",
  });

  const [filteredPosts, setFilteredPosts] = useState<Product[]>(currentPosts);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    let filtered = [...currentPosts];

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((post) =>
          (post as any)[key]?.toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    setFilteredPosts(filtered);
  }, [filters, currentPosts]);

  useEffect(() => {
    const fetchTSM = async () => {
      try {
        const res = await fetch(
          "/api/tsm?Roles=Territory Sales Manager,Ecommerce Manager,HR Manager,Manager,E-Commerce Staff"
        );
        const data = await res.json();
        const map: Record<string, string> = {};
        data.forEach((user: any) => {
          map[user.ReferenceID] = `${user.Firstname} ${user.Lastname}`;
        });
        setManagerMap(map);
      } catch (err) {
        console.error("Error fetching managers:", err);
      }
    };

    const fetchTSA = async () => {
      try {
        const res = await fetch(
          "/api/tsa?Roles=Territory Sales Associate,E-Commerce Staff"
        );
        const data = await res.json();
        const map: Record<string, string> = {};
        data.forEach((user: any) => {
          map[user.ReferenceID] = `${user.Firstname} ${user.Lastname}`;
        });
        setAgentMap(map);
      } catch (err) {
        console.error("Error fetching agents:", err);
      }
    };

    fetchTSM();
    fetchTSA();
  }, []);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPosts.map((p) => p._id));
    }
    setSelectAll(!selectAll);
  };

  // Handle single select
  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const openBulkDeleteModal = () => {
    if (selectedIds.length > 0) {
      setIsDeleteModalOpen(true);
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      setIsDeleting(true);

      const res = await fetch("/api/Backend/Ticket/bulk-delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (!res.ok) throw new Error("Bulk delete failed");

      const data = await res.json();
      console.log("Bulk delete response:", data);

      setSelectedIds([]);
      setSelectAll(false);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Bulk delete error:", error);
      alert("Failed to delete selected tickets");
    } finally {
      setIsDeleting(false);
    }
  };


  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center p-4 border-b">
        {/* Left side (Title + Paragraph) */}
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-gray-800">CSR Tickets</h2>
          <p className="text-[10px] text-gray-600 max-w-xl leading-relaxed">
            This section provides an overview of ticket management, including the creation of new tickets
            and a list of endorsed, closed, and open tickets. It allows filtering based on various criteria
            to help track and manage ticket statuses efficiently.
          </p>
        </div>

        {/* Right side (Export + Filter Button) */}
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={openBulkDeleteModal}
              className="flex items-center justify-center gap-2 px-3 py-3 text-xs font-semibold rounded-lg 
             bg-red-700 text-white shadow-sm hover:bg-red-800 hover:shadow-md 
             transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <BiSolidTrash /> Bulk Delete ({selectedIds.length})
            </button>
          )}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center justify-center gap-2 px-3 py-3 text-xs font-semibold rounded-lg 
             bg-gray-500 text-white shadow-sm hover:bg-emerald-700 hover:shadow-md 
             transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FaFilter />
            Filter
          </button>
          <Export currentPosts={currentPosts} />
        </div>
      </div>

      <Confirm
        isOpen={isDeleteModalOpen}
        title="Confirm Bulk Delete"
        message={
          <>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-red-600">{selectedIds.length}</span> selected tickets?
            <br />
            This action <span className="font-semibold">cannot be undone</span>.
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        onConfirm={handleBulkDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

      {filtersOpen && (
        <Filters
          filters={filters}
          currentPosts={currentPosts}
          managerMap={managerMap}
          agentMap={agentMap}
          handleFilterChange={handleFilterChange}
        />
      )}

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 whitespace-nowrap">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">
              {selectedIds.length > 1 && (
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="form-checkbox h-4 w-4 text-blue-600 rounded"
                  />
                  <span>Select All</span>
                </label>
              )}
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Actions</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">CSR Agent</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Ticket No</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Ticket Received</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Ticket Endorsed</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Company</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Contact Number</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Gender</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Client Segment</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">City Address</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Traffic</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Channel</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Wrap-Up</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Source</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">SO Number</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">SO Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Quantity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">PO Number</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">SO Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Payment Terms</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">PO Source</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">PO Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Payment Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Delivery Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Customer Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Customer Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Department</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Sales Manager</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Sales Agent</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Remarks</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 tracking-wider">Inquiry / Concern</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <tr key={post._id} onClick={() => handleEdit(post)} className="cursor-pointer hover:bg-gray-100 transition-colors duration-200 whitespace-nowrap">
                <td className="px-3 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(post._id)}
                    onChange={() => handleSelectOne(post._id)}
                    onClick={(e) => e.stopPropagation()}
                    className="form-checkbox h-4 w-4 text-blue-600 rounded"
                  />
                </td>

                <td className="px-6 py-4 text-xs font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ prevent row click
                        handleEdit(post);
                      }}
                      className="bg-white border border-emerald-400 text-emerald-600 px-3 py-2 rounded-md flex items-center gap-1 hover:bg-emerald-600 hover:text-white transition"
                      aria-label="Edit"
                    >
                      <BiSolidMessageSquareEdit />Edit
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ prevent row click
                        handleDelete(post._id);
                      }}
                      className="bg-red-700 border text-white text-xs px-3 py-2 rounded-md hover:bg-red-800 hover:text-white transition flex items-center gap-1"
                    >
                      <BiSolidTrash />Delete
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-gray-700 uppercase">{post.userName || "-"}</td>
                <td className="px-6 py-4 text-xs font-medium text-gray-900 uppercase">{post.TicketReferenceNumber}</td>
                <td className="px-6 py-4 text-xs text-gray-700">
                  {post.TicketReceived ? new Date(post.TicketReceived).toLocaleString() : "-"}
                </td>
                <td className="px-6 py-4 text-xs text-gray-700">
                  {post.TicketEndorsed ? new Date(post.TicketEndorsed).toLocaleString() : "-"}
                </td>
                <td className="px-6 py-4 text-xs text-gray-700 uppercase">{post.CompanyName || "-"}</td>
                <td className="px-6 py-4 text-xs text-gray-700">{post.CustomerName || "-"}</td>
                <td className="px-6 py-4 text-xs text-gray-700">{post.ContactNumber || "-"}</td>
                <td className="px-6 py-4 text-xs text-gray-700">{post.Email || "-"}</td>
                <td className="px-6 py-4 text-xs text-gray-700">{post.Gender || "-"}</td>
                <td className="px-6 py-4 text-xs text-gray-700">{post.CustomerSegment || "-"}</td>
                <td className="px-6 py-4 text-xs text-gray-700">{post.CityAddress || "-"}</td>
                <td className="px-6 py-4 text-xs text-gray-700">{post.Traffic || "-"}</td>
                <td className="px-6 py-4 text-xs text-gray-700">{post.Channel || "-"}</td>
                <td className="px-6 py-4 text-xs text-gray-700">{post.WrapUp || "-"}</td>
                <td className="px-6 py-4 text-xs text-gray-700">{post.Source || "-"}</td>
                <td className="px-6 py-4 text-xs text-gray-700">{post.SONumber || "-"}</td>
                <td className="px-6 py-4 text-xs text-gray-700">{post.SOAmount || "-"}</td>
                <td className="px-6 py-4 text-xs text-gray-700">{post.Quantity || "-"}</td>
                <td className="px-6 py-4 text-xs text-gray-700">{post.PONumber || "-"}</td>
                <td className="px-6 py-4 text-xs text-gray-700">{post.SODate || "-"}</td>
                <td className="px-6 py-4 text-xs text-gray-700">{post.PaymentTerms || "-"}</td>
                <td className="px-6 py-4 text-xs text-gray-700">{post.POSource || "-"}</td>
                <td className="px-6 py-4 text-xs text-gray-700">{post.POStatus || "-"}</td>
                <td className="px-6 py-4 text-xs text-gray-700">
                  {post.PaymentDate ? new Date(post.PaymentDate).toLocaleDateString() : "-"}
                </td>
                <td className="px-6 py-4 text-xs text-gray-700">
                  {post.DeliveryDate ? new Date(post.DeliveryDate).toLocaleDateString() : "-"}
                </td>
                <td className="px-6 py-4 text-xs text-gray-700">{post.CustomerType || "-"}</td>
                <td className="px-6 py-4 text-xs text-gray-700">{post.CustomerStatus || "-"}</td>
                <td className="px-6 py-4 text-xs text-gray-700">{post.Status || "-"}</td>
                <td className="px-6 py-4 text-xs text-gray-700">{post.Department || "-"}</td>
                <td className="px-6 py-4 text-xs text-gray-700 uppercase">{managerMap[post.SalesManager] || "-"}</td>
                <td className="px-6 py-4 text-xs text-gray-700 uppercase">{agentMap[post.SalesAgent] || "-"}</td>
                <td className="px-6 py-4 text-xs text-gray-700">{post.Remarks || "-"}</td>
                <td className="px-6 py-4 text-xs text-gray-700 capitalize">{post.Inquiries || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={32} className="px-6 py-4 text-center text-sm text-gray-500">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

  );
};

export default Table;
