import React, { useEffect, useState, useRef } from "react";
import { BiSolidMessageSquareEdit, BiSolidTrash } from 'react-icons/bi';
import Pagination from "./Pagination";
import FilterLength from "./FilterLength";

const SCROLL_SPEED = 50;

const STATUS_COLORS: Record<string, string> = {
  Closed: "bg-gray-100 text-gray-700",
  Endorsed: "bg-blue-300 text-dark",
  "Converted Into Sales": "bg-orange-300 text-dark",
};

const REMARKS_COLORS: Record<string, string> = {
  "No Stocks / Insufficient Stocks": "bg-slate-200",
  "Item Not Carried": "bg-zinc-200",
  "Quotation For Approval": "bg-orange-200",
  "Customer Requested Cancellation": "bg-amber-200",
  "Accreditation / Partnership": "bg-lime-200",
  "For Spf": "bg-green-200",
  "No Response From Client": "bg-emerald-200",
  Assisted: "bg-teal-500",
  "Disapproved Quotation": "bg-cyan-600",
  "For Site Visit": "bg-indigo-200",
  "Non Standard Item": "bg-blue-200",
  "PO Received": "bg-rose-200",
  "Not Converted to Sales": "bg-fuchsia-200",
  "For Occular Inspection": "bg-stone-600",
  "Sold": "bg-sky-200",
};

interface Post {
  userId: string;
  _id: string;
  TicketReferenceNumber: string;
  userName: string;
  CompanyName: string;
  CustomerName: string;
  ContactNumber: string;
  Email: string;
  Gender: string;
  CityAddress: string;
  CustomerSegment: string;
  Channel: string;
  Source: string;
  WrapUp: string;
  CustomerType: string;
  CustomerStatus: string;
  TicketEndorsed: string;
  TicketReceived: string;
  Department: string;
  SalesManager: string;
  SalesAgent: string;
  Inquiries: string;
  Traffic: string;
  Status: string;
  Remarks: string;
  createdAt: string;
  updatedAt: string;
  SONumber: string;
  Amount: string;
  QtySold: string;
  SODate: string;
  PONumber: string;
  PaymentTerms: string;
  POSource: string;
  PaymentDate: string;
  DeliveryDate: string;
  POStatus: string;
}

interface TableProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
  handleDelete: (postId: string) => void;
}

const Table: React.FC<TableProps> = ({ posts, handleEdit, handleDelete }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const [groupedPosts, setGroupedPosts] = useState<{ [key: string]: { [key: string]: Post[] } }>({});
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [userFilter, setUserFilter] = useState("");
  const [currentDate] = useState(new Date());

  const getFormattedDate = (date: Date) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayIndex = date.getDay();
    const dayOfWeek = daysOfWeek[dayIndex] ?? "Unknown";
    const month = date.toLocaleString("default", { month: "short" });
    return `${month} ${date.getDate()}-${dayOfWeek.slice(0, 3)}`;
  };

  useEffect(() => {
    const grouped = posts.reduce((acc: { [key: string]: { [key: string]: Post[] } }, post) => {
      const postDate = new Date(post.createdAt);
      const postFormattedDate = getFormattedDate(postDate);

      if (!acc[postFormattedDate]) acc[postFormattedDate] = {};
      if (!acc[postFormattedDate][post.userName]) acc[postFormattedDate][post.userName] = [];
      acc[postFormattedDate][post.userName].push(post);

      return acc;
    }, {});

    setGroupedPosts(grouped);
  }, [posts]);

  const sortedPosts = Object.keys(groupedPosts)
    .flatMap(day => Object.values(groupedPosts[day]).flat())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredPosts = userFilter
    ? sortedPosts.filter(post => post.userName === userFilter)
    : sortedPosts;

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage);

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
      <FilterLength
        userFilter={userFilter}
        setUserFilter={setUserFilter}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        posts={posts}
      />

      <div
        ref={scrollRef}
        onMouseMove={handleMouseMove}
        className="overflow-x-auto max-w-full border rounded"
        style={{ cursor: "pointer" }}
      >
        <table className="min-w-full table-auto">
          <thead className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white">
            <tr className="text-xs text-left whitespace-nowrap border-l-4 border-emerald-400">
              <th
                className="px-6 py-4 font-semibold sticky left-0 bg-gradient-to-r from-emerald-400 to-emerald-600 z-30"
                style={{ minWidth: '120px' }} // optional para consistent width
              >
                Actions
              </th>
              <th className="px-6 py-4 font-semibold">Date Created</th>
              <th className="px-6 py-4 font-semibold">Date Last Touch / Updated</th>
              <th className="px-6 py-4 font-semibold">CSR Agent</th>
              <th className="px-6 py-4 font-semibold">Ticket No</th>
              <th className="px-6 py-4 font-semibold">Ticket Received</th>
              <th className="px-6 py-4 font-semibold">Ticket Endorsed</th>
              <th className="px-6 py-4 font-semibold">Company</th>
              <th className="px-6 py-4 font-semibold">Customer</th>
              <th className="px-6 py-4 font-semibold">Contact Number</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">Gender</th>
              <th className="px-6 py-4 font-semibold">Client Segment</th>
              <th className="px-6 py-4 font-semibold">City Address</th>
              <th className="px-6 py-4 font-semibold">Traffic</th>
              <th className="px-6 py-4 font-semibold">Channel</th>
              <th className="px-6 py-4 font-semibold">Wrap-Up</th>
              <th className="px-6 py-4 font-semibold">Source</th>
              <th className="px-6 py-4 font-semibold">SO Number</th>
              <th className="px-6 py-4 font-semibold">SO Amount</th>
              <th className="px-6 py-4 font-semibold">QTY Sold</th>
              <th className="px-6 py-4 font-semibold">PO Number</th>
              <th className="px-6 py-4 font-semibold">SO Date</th>
              <th className="px-6 py-4 font-semibold">Payment Terms</th>
              <th className="px-6 py-4 font-semibold">PO Source</th>
              <th className="px-6 py-4 font-semibold">PO Status</th>
              <th className="px-6 py-4 font-semibold">Payment Date</th>
              <th className="px-6 py-4 font-semibold">Delivery Date</th>
              <th className="px-6 py-4 font-semibold">Customer Type</th>
              <th className="px-6 py-4 font-semibold">Customer Status</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Department</th>
              <th className="px-6 py-4 font-semibold">Sales Manager</th>
              <th className="px-6 py-4 font-semibold">Sales Agent</th>
              <th className="px-6 py-4 font-semibold">Remarks</th>
              <th className="px-6 py-4 font-semibold">Inquiry / Concern</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedPosts.map(post => (
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
                <td className="px-6 py-6 text-xs">{new Date(post.createdAt).toLocaleString()}</td>
                <td className="px-6 py-6 text-xs">
                  {isNaN(new Date(post.updatedAt).getTime())
                    ? " - "
                    : new Date(post.updatedAt).toLocaleString()}
                </td>
                <td className="px-6 py-6 text-xs capitalize">{post.userName}</td>
                <td className="px-6 py-6 text-xs">{post.TicketReferenceNumber}</td>
                <td className="px-6 py-6 text-xs">{new Date(post.TicketReceived).toLocaleString()}</td>
                <td className="px-6 py-6 text-xs">{new Date(post.TicketEndorsed).toLocaleString()}</td>
                <td className="px-6 py-6 text-xs">{post.CompanyName}</td>
                <td className="px-6 py-6 text-xs">{post.CustomerName}</td>
                <td className="px-6 py-6 text-xs">{post.ContactNumber}</td>
                <td className="px-6 py-6 text-xs">{post.Email}</td>
                <td className="px-6 py-6 text-xs">{post.Gender}</td>
                <td className="px-6 py-6 text-xs">{post.CustomerSegment}</td>
                <td className="px-6 py-6 text-xs">{post.CityAddress}</td>
                <td className="px-6 py-6 text-xs">{post.Traffic}</td>
                <td className="px-6 py-6 text-xs">{post.Channel}</td>
                <td className="px-6 py-6 text-xs">{post.WrapUp}</td>
                <td className="px-6 py-6 text-xs">{post.Source}</td>
                <td className="px-6 py-6 text-xs">{post.SONumber}</td>
                <td className="px-6 py-6 text-xs">{post.Amount}</td>
                <td className="px-6 py-6 text-xs">{post.QtySold}</td>
                <td className="px-6 py-6 text-xs">{post.PONumber}</td>
                <td className="px-6 py-6 text-xs">{post.SODate}</td>
                <td className="px-6 py-6 text-xs">{post.PaymentTerms}</td>
                <td className="px-6 py-6 text-xs">{post.POSource}</td>
                <td className="px-6 py-6 text-xs">{post.POStatus}</td>
                <td className="px-6 py-6 text-xs">{post.PaymentDate}</td>
                <td className="px-6 py-6 text-xs">{post.DeliveryDate}</td>
                <td className="px-6 py-6 text-xs">{post.CustomerType}</td>
                <td className="px-6 py-6 text-xs">{post.CustomerStatus}</td>
                <td className={`px-6 py-6 text-xs ${STATUS_COLORS[post.Status]}`}>{post.Status}</td>
                <td className="px-6 py-6 text-xs">{post.Department}</td>
                <td className="px-6 py-6 text-xs">{post.SalesManager}</td>
                <td className="px-6 py-6 text-xs">{post.SalesAgent}</td>
                <td className={`px-6 py-6 text-xs ${REMARKS_COLORS[post.Remarks]}`}>{post.Remarks}</td>
                <td className="px-6 py-6 text-xs">
                  {post.Inquiries?.length > 20
                    ? `${post.Inquiries.substring(0, 20)}...`
                    : post.Inquiries}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        itemsPerPage={itemsPerPage}
        totalItems={filteredPosts.length}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Table;
