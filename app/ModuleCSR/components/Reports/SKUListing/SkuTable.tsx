import React, { useState, useMemo, useRef } from "react";
import { BiSolidMessageSquareEdit, BiSolidTrash } from 'react-icons/bi';

const SCROLL_SPEED = 50;

interface Post {
  _id: string;
  userName: string;
  createdAt: string;
  CompanyName: string;
  Remarks: string;
  ItemCode: string;
  ItemDescription: string;
  QtySold: string;
  SalesAgent: string;
  ItemCategory: string;
  Inquiries: string;
}

interface AccountsTableProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  handleEdit: (post: Post) => void;
  handleDelete: (postId: string) => void;
  Role: string;
}

const AccountsTable: React.FC<AccountsTableProps> = ({
  posts,
  handleEdit,
  handleDelete,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [remarksFilter, setRemarksFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term state
  const [postsPerPage, setPostsPerPage] = useState(10);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const filteredPosts = useMemo(() => {
    let filtered = posts;

    if (remarksFilter) {
      filtered = filtered.filter((post) =>
        post.Remarks.toLowerCase().includes(remarksFilter.toLowerCase())
      );
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((post) =>
        Object.values(post).some((val) =>
          typeof val === "string" && val.toLowerCase().includes(lowerSearch)
        )
      );
    }

    return filtered;
  }, [posts, remarksFilter, searchTerm]);

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPosts, currentPage, postsPerPage]);

  const totalQty = useMemo(() => {
    return filteredPosts.reduce((total, post) => {
      const qty = parseFloat(post.QtySold) || 0;
      return total + qty;
    }, 0);
  }, [filteredPosts]);

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
    <div className="bg-white">
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {/* Search Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow capitalize"
        />

        {/* Remarks Filter */}
        <select
          id="remarksFilter"
          value={remarksFilter}
          onChange={(e) => setRemarksFilter(e.target.value)}
          className="border px-3 py-2 rounded text-xs capitalize"
        >
          <option value="">All</option>
          <option value="No Stocks / Insufficient Stocks">No Stocks / Insufficient Stocks</option>
          <option value="Item Not Carried">Item Not Carried</option>
          <option value="Non Standard Item">Non Standard Item</option>
        </select>

        {/* Posts Per Page */}
        <select
          id="postsPerPage"
          value={postsPerPage}
          onChange={(e) => setPostsPerPage(Number(e.target.value))}
          className="border px-3 py-2 rounded text-xs"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={500}>500</option>
        </select>
      </div>

      <div
        ref={scrollRef}
        onMouseMove={handleMouseMove}
        className="overflow-x-auto max-w-full border rounded"
        style={{ cursor: "pointer" }}
      >

        {filteredPosts.length > 0 ? (
          <>
            <table className="min-w-full table-auto">
              <thead className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white">
                <tr className="text-xs text-left whitespace-nowrap border-l-4 border-emerald-400">
                  <th
                    className="px-6 py-4 font-semibold sticky left-0 bg-gradient-to-r from-emerald-400 to-emerald-600 z-30"
                    style={{ minWidth: '120px' }} // optional para consistent width
                  >
                    Actions
                  </th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Company Name</th>
                  <th className="px-6 py-4 font-semibold">Item Category</th>
                  <th className="px-6 py-4 font-semibold">Item Code</th>
                  <th className="px-6 py-4 font-semibold">Item Description</th>
                  <th className="px-6 py-4 font-semibold">Quantity</th>
                  <th className="px-6 py-4 font-semibold">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedPosts.map((post) => (
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
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="bg-red-700 border text-white text-xs px-3 py-1 rounded-md hover:bg-red-800 hover:text-white transition flex items-center gap-1"
                      >
                        <BiSolidTrash />Delete
                      </button>
                    </td>
                    <td className="px-6 py-4 text-xs">{new Date(post.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 text-xs">{post.CompanyName}</td>
                    <td className="px-6 py-4 text-xs">{post.ItemCategory}</td>
                    <td className="px-6 py-4 text-xs">{post.ItemCode}</td>
                    <td className="px-6 py-4 text-xs">{post.ItemDescription}</td>
                    <td className="px-6 py-4 text-xs">{post.QtySold}</td>
                    <td className="px-6 py-4 text-xs capitalize">{post.Remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p className="text-center text-gray-500 text-xs mt-4">No records found</p>
        )}

      </div>
      {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 text-gray-600 rounded text-xs"
          >
            Previous
          </button>
          <span className="text-xs">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 text-gray-600 rounded text-xs"
          >
            Next
          </button>
        </div>
    </div>
  );
};

export default AccountsTable;
