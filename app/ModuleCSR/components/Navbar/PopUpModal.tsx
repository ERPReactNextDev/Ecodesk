import React from "react";
import { FaExclamationCircle } from "react-icons/fa";

interface Notification {
  id: number | string;
  ticketreferencenumber: string;
  companyname: string;
  typecall?: string;
  fullname: string;
  remarks: string;
  csrremarks: string;
  date_created?: string;
}

interface PopUpModalProps {
  notif: Notification;
  currentNotifIndex: number;
  filteredNotifications: Notification[];
  loadingId: string | number;
  UpdateProgressStatus: (id: string) => void;
  setCurrentNotifIndex: React.Dispatch<React.SetStateAction<number>>;
}

const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        let hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12;
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;

        const formattedDateStr = date.toLocaleDateString('en-US', {
            timeZone: 'UTC',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });

        return `${formattedDateStr} ${hours}:${minutesStr} ${ampm}`;
    };

const PopUpModal: React.FC<PopUpModalProps> = ({
  notif,
  currentNotifIndex,
  filteredNotifications,
  loadingId,
  UpdateProgressStatus,
  setCurrentNotifIndex
}) => {
  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-60 flex items-center justify-center z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg border-2 border-red-600 overflow-y-auto max-h-[90vh] animate-continuous-shake">
        <h2 className="text-lg font-bold text-red-600 mb-6 flex items-center justify-center space-x-2 select-none">
          <FaExclamationCircle className="text-red-600" />
          <span>Notification {currentNotifIndex + 1} of {filteredNotifications.length}</span>
        </h2>

        <p className="text-[12px] mt-3 leading-relaxed capitalize text-gray-900">
          The ticket <strong>{notif.ticketreferencenumber}</strong> for <strong>{notif.companyname}</strong> is now {notif.typecall ? `marked as ${notif.typecall}` : 'marked as posted'}.
        </p>

        <p className="text-[12px] text-gray-700 mt-2">
          <span className="font-semibold capitalize">Processed by: {notif.fullname}</span>
        </p>

        <p className="text-[12px] text-gray-700 mt-2">
          <span className="font-semibold capitalize">Remarks: {notif.remarks}</span>
        </p>

        {notif.date_created && (
          <span className="text-[10px] mt-3 block text-gray-500 select-none">
            {formatDate(new Date(notif.date_created).getTime())}
          </span>
        )}

        <button
          onClick={() => UpdateProgressStatus(notif.id.toString())}
          disabled={loadingId.toString() === notif.id.toString() || notif.csrremarks === "Read"}
          className={`
            mt-6 w-full py-2 rounded-md text-sm font-semibold transition
            ${notif.csrremarks === "Read"
              ? "bg-green-600 text-white cursor-default"
              : loadingId.toString() === notif.id.toString()
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white cursor-pointer"}
          `}
        >
          {loadingId.toString() === notif.id.toString()
            ? "Loading..."
            : notif.csrremarks === "Read"
              ? "Read"
              : "Mark as Read"}
        </button>

        <div className="flex justify-between mt-6">
          <button
            disabled={currentNotifIndex === 0}
            onClick={() => setCurrentNotifIndex(i => Math.max(i - 1, 0))}
            className={`px-4 py-2 rounded-md text-sm font-medium transition
              ${currentNotifIndex === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-red-600 hover:text-red-800"}
            `}
          >
            Prev
          </button>
          <button
            disabled={currentNotifIndex === filteredNotifications.length - 1}
            onClick={() => setCurrentNotifIndex(i => Math.min(i + 1, filteredNotifications.length - 1))}
            className={`px-4 py-2 rounded-md text-sm font-medium transition
              ${currentNotifIndex === filteredNotifications.length - 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-red-600 hover:text-red-800"}
            `}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUpModal;
