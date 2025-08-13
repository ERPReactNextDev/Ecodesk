import React, { useState, useMemo } from "react";

interface DailyTransactionTableProps {
  posts: any[];
}

const calculateTimeConsumed = (startdate: string, enddate: string) => {
  if (!startdate || !enddate) return "N/A";
  const start = new Date(startdate);
  const end = new Date(enddate);
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

const DailyTransactionTable: React.FC<DailyTransactionTableProps> = ({ posts }) => {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const dateA = a.startdate ? new Date(a.startdate).getTime() : 0;
      const dateB = b.startdate ? new Date(b.startdate).getTime() : 0;
      return dateB - dateA;
    });
  }, [posts]);

  const groupedByCompany = useMemo(() => {
    const grouped: { [key: string]: any[] } = {};
    sortedPosts.forEach((post) => {
      const company = post.companyname || "Unknown";
      if (!grouped[company]) {
        grouped[company] = [];
      }
      grouped[company].push(post);
    });
    return grouped;
  }, [sortedPosts]);

  const handleRowClick = (company: string) => {
    setSelectedCompany(company);
  };

  const closeModal = () => {
    setSelectedCompany(null);
  };

  return (
    <div className="overflow-x-auto">
      {sortedPosts.length > 0 ? (
        <table className="min-w-full table-auto">
          <thead className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white">
            <tr className="text-xs text-left whitespace-nowrap border-l-4 border-emerald-400">
              <th className="px-6 py-4 font-semibold">Ticket Number</th>
              <th className="px-6 py-4 font-semibold">Account Name</th>
              <th className="px-6 py-4 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Object.entries(groupedByCompany).map(([company, records]) => (
              <tr
                key={company}
                className="hover:bg-emerald-50 transition-colors duration-300 cursor-pointer whitespace-nowrap"
                onClick={() => handleRowClick(company)}
              >
                <td className="px-6 py-6 text-xs underline">{records[0].ticketreferencenumber || "-"}</td>
                <td className="px-6 py-6 text-xs uppercase">{company}</td>
                <td className="px-6 py-6 text-xs">{formatDate(records[0].date_created)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-4 text-sm">No CSR inquiries available</div>
      )}

      {selectedCompany && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-[999] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 flex flex-col">
            <h3 className="text-lg font-semibold mb-6 text-center text-emerald-700">
              Ticket Details for <span className="uppercase font-bold">{selectedCompany}</span>
            </h3>
            <div className="space-y-5 text-sm text-gray-700">
              {groupedByCompany[selectedCompany].map((ticket, idx) => (
                <div
                  key={idx}
                  className="border rounded-md p-4 hover:shadow-lg transition-shadow bg-gray-50"
                >
                  <p><strong>Ticket Number:</strong> {ticket.ticketreferencenumber}</p>
                  <p><strong>Contact:</strong> {ticket.contact_person || "-"} / {ticket.contactnumber || "-"}</p>
                  <p><strong>Email:</strong> {ticket.emailaddress || "-"}</p>
                  <p><strong>Wrap Up:</strong> {ticket.wrapup || "-"}</p>
                  <p className="capitalize"><strong>Inquiry / Concern:</strong> {ticket.inquiries || "-"}</p>
                  <p className="capitalize"><strong>Remarks:</strong> {ticket.remarks || "-"}</p>
                  <p className="capitalize"><strong>Agent:</strong> {ticket.AgentFirstname || ""} {ticket.AgentLastname || ""}</p>
                  <p className="capitalize"><strong>TSM:</strong> {ticket.ManagerFirstname || ""} {ticket.ManagerLastname || ""}</p>
                  <p><strong>Time Consumed:</strong> {calculateTimeConsumed(ticket.startdate, ticket.enddate)}</p>
                  <p><strong>Date Created:</strong> {formatDate(ticket.date_created)}</p>
                </div>
              ))}
            </div>
            <button
              onClick={closeModal}
              className="mt-6 self-center px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-md shadow-md transition-colors"
              aria-label="Close modal"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default DailyTransactionTable;
