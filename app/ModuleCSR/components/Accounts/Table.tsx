import React, { useState, useMemo, useRef } from "react";
import { BiSolidMessageSquareEdit } from 'react-icons/bi';
const SCROLL_SPEED = 50;

interface Post {
  _id: string;
  CompanyName: string;
  CustomerName: string;
  Gender: string;
  ContactNumber: string;
  Email: string;
  CityAddress: string;
  CustomerSegment?: string;
  CustomerType?: string;
}

interface AccountsTableProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
  handleDelete: (postId: string) => void;
  Role: string;
  loading?: boolean;
  editedPostId?: string;
}

const AccountsTable: React.FC<AccountsTableProps> = ({ posts, handleEdit, handleDelete, Role, loading = false, editedPostId, }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Post; direction: "asc" | "desc" } | null>(null);

  const filteredSortedPosts = useMemo(() => {
    let sorted = posts;
    if (sortConfig !== null) {
      sorted = posts.slice().sort((a, b) => {
        const aKey = a[sortConfig.key];
        const bKey = b[sortConfig.key];
        if (typeof aKey === "string" && typeof bKey === "string") {
          return sortConfig.direction === "asc"
            ? aKey.localeCompare(bKey)
            : bKey.localeCompare(aKey);
        }
        return 0;
      });
    }
    return sorted;
  }, [posts, sortConfig]);

  const handleSort = (key: keyof Post) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    if (animationFrameId.current) return; // Prevent overlapping

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
    <div
      ref={scrollRef}
      onMouseMove={handleMouseMove}
      className="overflow-x-auto max-w-full border rounded"
      style={{ cursor: "pointer" }}
    >

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : filteredSortedPosts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No data found.</div>
      ) : (

        <table className="min-w-full table-auto">
          <thead className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white">
            <tr className="text-xs text-left whitespace-nowrap border-l-4 border-emerald-400">
              <th
                className="px-6 py-4 font-semibold sticky left-0 bg-gradient-to-r from-emerald-400 to-emerald-600 z-30"
                style={{ minWidth: '120px' }} // optional para consistent width
              >
                Actions
              </th>
              {[
                { key: "CompanyName", label: "Company Name" },
                { key: "CustomerName", label: "Customer Name" },
                { key: "Gender", label: "Gender" },
                { key: "ContactNumber", label: "Contact Number" },
                { key: "Email", label: "Email" },
                { key: "CityAddress", label: "City Address" },
                { key: "CustomerSegment", label: "Segment" },
                { key: "CustomerType", label: "Customer Type" },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className="px-6 py-4 font-semibold"
                  onClick={() => handleSort(key as keyof Post)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSort(key as keyof Post);
                    }
                  }}
                  aria-sort={
                    sortConfig?.key === key
                      ? sortConfig.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  role="columnheader"
                  scope="col"
                >
                  {label}
                  {sortConfig?.key === key && (
                    <span aria-hidden="true">
                      {sortConfig.direction === "asc" ? " ▲" : " ▼"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSortedPosts.map((post) => (
              <tr
                key={post._id}
                className="hover:bg-emerald-50 transition-colors duration-300 cursor-pointer whitespace-nowrap"
                onClick={() => handleEdit(post)}
              >
                <td
                  className="px-6 py-6 text-xs flex gap-1 sticky left-0 bg-white z-20"
                  onClick={e => e.stopPropagation()}
                  style={{ minWidth: '120px' }}
                >
                  <button
                    onClick={() => handleEdit(post)}
                    className="bg-white border border-emerald-400 text-emerald-600 px-3 py-1 rounded-md flex items-center gap-1 hover:bg-emerald-600 hover:text-white transition"
                    aria-label="Edit"
                  >
                    <BiSolidMessageSquareEdit />Edit
                  </button>
                </td>
                <td className="px-6 py-4 text-xs uppercase">{post.CompanyName}</td>
                <td className="px-6 py-4 text-xs capitalize">{post.CustomerName}</td>
                <td className="px-6 py-4 text-xs">{post.Gender}</td>
                <td className="px-6 py-4 text-xs">{post.ContactNumber}</td>
                <td className="px-6 py-4 text-xs">{post.Email}</td>
                <td className="px-6 py-4 text-xs capitalize">{post.CityAddress}</td>
                <td className="px-6 py-4 text-xs">{post.CustomerSegment || "N/A"}</td>
                <td className="px-6 py-4 text-xs">{post.CustomerType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AccountsTable;
