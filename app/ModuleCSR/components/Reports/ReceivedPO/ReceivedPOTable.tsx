import React, { useState, useMemo, useRef } from "react";
import { BiSolidMessageSquareEdit, BiSolidTrash } from 'react-icons/bi';
import moment from "moment";
const SCROLL_SPEED = 50;

interface Post {
  _id: string;
  userName: string;
  createdAt: string;
  CompanyName: string;
  ContactNumber: string;
  PONumber: string;
  POAmount: string | number;
  SONumber: string;
  SODate: string;
  PaymentTerms: string;
  PaymentDate: string;
  DeliveryPickupDate: string;
  POStatus: string;
  POSource: string;
  Remarks: string;
  AgentFirstname: string;
  AgentLastname: string;
  SalesAgent: string;
}

interface AccountsTableProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
  handleDelete: (postId: string) => void;
}

const TransactionTable: React.FC<AccountsTableProps> = ({ posts, handleEdit, handleDelete }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const [menuVisible, setMenuVisible] = useState<Record<string, boolean>>({});

  const toggleMenu = (postId: string) => {
    setMenuVisible((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "";
    return moment(timestamp).isValid() ? moment(timestamp).format("MMM D, YYYY") : "";
  };

  // Calculate Total Amount robustly
  const TotalAmount = useMemo(() => {
    return posts.reduce((total, post) => {
      const amountStr = post.POAmount ? post.POAmount.toString() : "0";
      const cleanedAmountStr = amountStr.replace(/[^0-9.-]+/g, "");
      const amount = parseFloat(cleanedAmountStr);
      return total + (isNaN(amount) ? 0 : amount);
    }, 0);
  }, [posts]);

  const calculatePendingDays = (SODate: string) => {
    if (!SODate || !moment(SODate).isValid()) return "";
    const today = moment();
    const soDateMoment = moment(SODate);
    const pendingDays = today.diff(soDateMoment, "days");
    return pendingDays >= 0 ? `${pendingDays} day(s)` : "0 day(s)";
  };

  const calculatePendingPaymentDays = (PaymentDate: string, DeliveryPickupDate: string) => {
    if (!PaymentDate || !DeliveryPickupDate) return "";
    const paymentMoment = moment(PaymentDate);
    const deliveryMoment = moment(DeliveryPickupDate);
    if (!paymentMoment.isValid() || !deliveryMoment.isValid()) return "0 day(s)";
    const pendingPaymentDays = deliveryMoment.diff(paymentMoment, "days");
    return pendingPaymentDays >= 0 ? `${pendingPaymentDays} day(s)` : "0 day(s)";
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
      <table className="min-w-full table-auto">
        <thead className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white">
          <tr className="text-xs text-left whitespace-nowrap border-l-4 border-emerald-400">
            <th
              className="px-6 py-4 font-semibold sticky left-0 bg-gradient-to-r from-emerald-400 to-emerald-600 z-30"
              style={{ minWidth: '120px' }} // optional para consistent width
            >
              Actions
            </th>
            <th className="px-6 py-4 font-semibold">CSR Agent</th>
            <th className="px-6 py-4 font-semibold">Company</th>
            <th className="px-6 py-4 font-semibold">PO Number</th>
            <th className="px-6 py-4 font-semibold">Amount</th>
            <th className="px-6 py-4 font-semibold">SO Number</th>
            <th className="px-6 py-4 font-semibold">SO Date</th>
            <th className="px-6 py-4 font-semibold">Sales Agent</th>
            <th className="px-6 py-4 font-semibold">Pending From SO Date</th>
            <th className="px-6 py-4 font-semibold">Payment Terms</th>
            <th className="px-6 py-4 font-semibold">Payment Date</th>
            <th className="px-6 py-4 font-semibold">Delivery/Pick-Up Date</th>
            <th className="px-6 py-4 font-semibold">Pending Days from Payment</th>
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 font-semibold">Source</th>
            <th className="px-6 py-4 font-semibold">Created At</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {posts.length > 0 ? (
            posts.map((post) => (
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
                <td className="px-6 py-6 text-xs capitalize">
                  {post.AgentLastname}, {post.AgentFirstname}
                </td>
                <td className="px-6 py-6 text-xs uppercase">{post.CompanyName}</td>
                <td className="px-6 py-6 text-xs">{post.PONumber}</td>
                <td className="px-6 py-6 text-xs">
                  {(() => {
                    const amountStr = post.POAmount ? post.POAmount.toString() : "0";
                    const cleaned = amountStr.replace(/[^0-9.-]+/g, "");
                    const amount = parseFloat(cleaned);
                    return isNaN(amount)
                      ? "0.00"
                      : amount.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      });
                  })()}
                </td>
                <td className="px-6 py-6 text-xs">{post.SONumber}</td>
                <td className="px-6 py-6 text-xs">{formatTimestamp(post.SODate)}</td>
                <td className="px-6 py-6 text-xs">{post.SalesAgent}</td>
                <td className="px-6 py-6 text-xs text-red-700">{calculatePendingDays(post.SODate)}</td>
                <td className="px-6 py-6 text-xs">{post.PaymentTerms}</td>
                <td className="px-6 py-6 text-xs">{formatTimestamp(post.PaymentDate)}</td>
                <td className="px-6 py-6 text-xs">{formatTimestamp(post.DeliveryPickupDate)}</td>
                <td className="px-6 py-6 text-xs text-red-700 font-semibold">
                  {calculatePendingPaymentDays(post.PaymentDate, post.DeliveryPickupDate)}
                </td>
                <td className="px-6 py-6 text-xs">{post.POStatus}</td>
                <td className="px-6 py-6 text-xs">{post.POSource}</td>
                <td className="px-6 py-6 text-xs">{new Date(post.createdAt).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={17} className="text-center text-gray-500 text-xs py-3">
                No records found
              </td>
            </tr>
          )}
        </tbody>

        <tfoot>
          <tr className="bg-gray-100 text-xs font-semibold">
            <td colSpan={4} className="px-4 py-2 border text-right">
              Total Amount:
            </td>
            <td className="px-4 py-2 border">
              ₱
              {TotalAmount.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </td>
            <td colSpan={13} className="border"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default TransactionTable;
