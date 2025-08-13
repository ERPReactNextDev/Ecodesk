"use client";
import React from "react";
import { motion } from "framer-motion";
import { IoIosCloseCircleOutline } from "react-icons/io";

const NotifSidebar = ({
  sidebarRef,
  setShowSidebar,
  activeTab,
  setActiveTab,
  notificationData,
  notifications,
  trackingNotifications,
  wrapUpNotifications,
  UpdateProgressStatus,
  handleMarkAsStatusRead,
  handleMarkAsNotifStatusRead,
  loadingId,
  formatDate
}: any) => {
  return (
    <motion.div
      ref={sidebarRef}
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 right-0 w-80 h-full bg-white border-l border-gray-300 shadow-lg z-[1000] flex flex-col"
    >
      {/* 🔧 Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
        <button onClick={() => setShowSidebar(false)}>
          <IoIosCloseCircleOutline size={20} />
        </button>
      </div>

      {/* 📜 Notifications List */}
      <div className="flex-1 overflow-auto p-2">
        <div className="flex border-b mb-2">
          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex-1 text-center py-2 text-xs font-semibold ${activeTab === "notifications"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600"
              }`}
          >
            Notifications
          </button>
        </div>

        {activeTab === "notifications" && (
          <>
            {/* CSR Notifications */}
            {notificationData.filter((notif: any) => notif.ticketreferencenumber && notif.csrremarks !== "Read").length > 0 && (
              <ul className="space-y-2 mb-2">
                {notificationData
                  .filter((notif: any) => notif.ticketreferencenumber && notif.csrremarks !== "Read")
                  .map((notif: any, index: number) => {
                    const notifId = notif._id || notif.id || index;
                    const notifIdStr = notifId.toString();

                    return (
                      <li
                        key={notifIdStr}
                        className={`p-3 border-b rounded-md relative text-left text-xs text-gray-900 capitalize
                          ${notif.type === "Notification" ? "bg-yellow-100" : "bg-gray-100"} hover:bg-gray-200`}
                      >
                        <p className="text-[10px] mt-5">
                          Your <strong>{notif.companyname}</strong> ticket number: <strong>{notif.ticketreferencenumber}</strong> is currently marked as <strong>{notif.typecall}</strong>.
                        </p>

                        <p className="text-[10px] text-gray-700 mt-1">
                          <span className="font-medium">Processed by:</span> {notif.fullname}
                        </p>

                        <p className="text-[10px] text-gray-700 mt-1">
                          <span className="font-medium">Remarks:</span> {notif.remarks}
                        </p>

                        {notif.date_created && (
                          <span className="text-[8px] mt-1 block text-gray-500">
                            {formatDate(new Date(notif.date_created).getTime())}
                          </span>
                        )}

                        <button
                          onClick={() => UpdateProgressStatus(notif.id.toString())}
                          disabled={loadingId === notif.id.toString()}
                          className={`text-[9px] mb-2 cursor-pointer absolute top-2 right-2 ${notif.csrremarks === "Read"
                            ? "text-green-600 font-bold"
                            : loadingId === notif.id.toString()
                              ? "text-gray-500 cursor-not-allowed"
                              : "text-black hover:text-blue-800"
                            }`}
                        >
                          {loadingId === notif.id.toString()
                            ? "Loading..."
                            : notif.csrremarks === "Read"
                              ? "Read"
                              : "Mark as Read"}
                        </button>
                      </li>
                    );
                  })}
              </ul>
            )}

            {/* Used Notifications */}
            {notifications.filter((notif: any) => notif.status === "Used").length > 0 && (
              <ul className="space-y-2">
                {notifications
                  .filter((notif: any) => notif.status === "Used")
                  .map((notif: any, index: number) => (
                    <li
                      key={notif.id || index}
                      className={`p-3 border-b hover:bg-gray-200 text-xs text-gray-900 capitalize text-left rounded-md relative ${notif.type === "Inquiry Notification" ? "bg-yellow-200" : "bg-gray-100"}`}
                    >
                      <p className="text-[10px] mt-5">{notif.companyname || "Unknown Company"} Processed By {notif.salesagentname || "Unknown Agent"}</p>

                      {notif.ticketreferencenumber && (
                        <p className="text-[10px] text-gray-500">Ticket Reference: {notif.ticketreferencenumber}</p>
                      )}

                      {notif.date_created && notif.type === "Taskflow Notification" && (
                        <span className="text-[8px] mt-1 block">{new Date(notif.date_created).toLocaleString()}</span>
                      )}

                      <button
                        onClick={() => handleMarkAsStatusRead(notif._id)}
                        disabled={loadingId === notif._id}
                        className={`text-[9px] mb-2 cursor-pointer absolute top-2 right-2 ${notif.status === "Read"
                          ? "text-green-600 font-bold"
                          : loadingId === notif._id
                            ? "text-gray-500 cursor-not-allowed"
                            : "text-blue-600 hover:text-blue-800"
                          }`}
                      >
                        {loadingId === notif._id
                          ? "Loading..."
                          : notif.status === "Read"
                            ? "Read"
                            : "Mark as Read"}
                      </button>
                    </li>
                  ))}
              </ul>
            )}

            {/* Tracking Notifications */}
            {trackingNotifications.filter((notif: any) => notif.TrackingStatus === "Open" && notif.status !== "Read").length > 0 && (
              <ul className="space-y-2">
                {trackingNotifications
                  .filter((notif: any) => notif.TrackingStatus === "Open" && notif.status !== "Read")
                  .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((notif: any, index: number) => (
                    <li
                      key={notif._id || index}
                      className={`p-3 mb-2 hover:bg-green-200 text-xs text-gray-900 capitalize text-left rounded-md relative ${notif.type === "DTracking Notification" ? "bg-green-100" : "bg-green-500"}`}
                    >
                      <p className="text-[12px] mt-5 font-bold uppercase italic">{notif.CompanyName}</p>
                      <p className="text-[10px] mt-1 font-semibold">{notif.message}</p>
                      <p className="text-[10px] mt-1 font-semibold">{notif.status}</p>
                      <span className="text-[8px] mt-1 block">{new Date(notif.createdAt).toLocaleString()}</span>

                      <button
                        onClick={() => handleMarkAsStatusRead(notif._id)}
                        disabled={loadingId === notif._id}
                        className={`text-[9px] mb-2 cursor-pointer absolute top-2 right-2 ${notif.status === "Read"
                          ? "text-green-600 font-bold"
                          : loadingId === notif._id
                            ? "text-gray-500 cursor-not-allowed"
                            : "text-blue-600 hover:text-blue-800"
                          }`}
                      >
                        {loadingId === notif._id
                          ? "Loading..."
                          : notif.status === "Read"
                            ? "Read"
                            : "Mark as Read"}
                      </button>
                    </li>
                  ))}
              </ul>
            )}

            {/* Wrap-Up Notifications */}
            {wrapUpNotifications.filter((notif: any) => notif.Status === "Endorsed" && notif.NotificationStatus !== "Read").length > 0 && (
              <ul className="space-y-2">
                {wrapUpNotifications
                  .filter((notif: any) => notif.Status === "Endorsed")
                  .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((notif: any, index: number) => (
                    <li
                      key={notif._id || index}
                      className={`p-3 mb-2 hover:bg-orange-200 text-xs text-gray-900 capitalize text-left mt-2 rounded-md relative ${notif.type === "WrapUp Notification" ? "bg-orange-100" : "bg-green-500"}`}
                    >
                      <p className="text-[12px] mt-5 font-bold uppercase italic">{notif.CompanyName}</p>
                      <p className="text-[10px] mt-1 font-semibold">{notif.message}</p>
                      <span className="text-[8px] mt-1 block">{new Date(notif.createdAt).toLocaleString()}</span>

                      <button
                        onClick={() => handleMarkAsNotifStatusRead(notif._id)}
                        disabled={loadingId === notif._id}
                        className={`text-[9px] mb-2 cursor-pointer absolute top-2 right-2 ${notif.NotificationStatus === "Read"
                          ? "text-green-600 font-bold"
                          : loadingId === notif._id
                            ? "text-gray-500 cursor-not-allowed"
                            : "text-blue-600 hover:text-blue-800"
                          }`}
                      >
                        {loadingId === notif._id
                          ? "Loading..."
                          : notif.NotificationStatus === "Read"
                            ? "Read"
                            : "Mark as Read"}
                      </button>
                    </li>
                  ))}
              </ul>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default NotifSidebar;
