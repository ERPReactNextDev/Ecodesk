import React, { useState, useEffect, useRef } from "react";
import { CiBellOn, CiDark, CiSun } from "react-icons/ci";
import PopUpModal from "./PopUpModal";
import NotifSidebar from "./NotifSidebar";

interface Notification {
  id: number;
  companyname: string;
  callback: string;
  status: string; 
  typeclient: string;
  date_updated: string;
  date_created: string;
  ticketreferencenumber: string;
  salesagentname: string;
  message: string;
  type: string;
  csragent: string;
  typeactivity: string;
  typecall: string;
  agentfullname: string;
  _id: string;
  recepient: string;
  sender: string;
  remarks: string;
  csrremarks: string;
}

interface NavbarProps {
  onToggleSidebar: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

type NotificationData = {
  callback: string;
  message: string;
  type: string;
  date_created: string;
  csragent: string;
  activitystatus: string;
  _id: string;
  companyname: string;
  typecall: string;
  typeactivity: string;
  ticketreferencenumber: string;
  remarks: string;
  id: string;
  csrremarks: string;
  referenceid: string;
  fullname: string;
}

type Callback = {
  companyname: string;
  status: string;
  date_created: string;
  ticketreferencenumber: string
  salesagentname: string;
  csragent: string;
  type: string;
}

type TrackingItem = {
  _id: string;
  message: string;
  id: number;
  userName: string | null;
  type: string;
  status: string;
  createdAt: string;
  TrackingStatus: string;
  TicketConcern: string;
  CompanyName: string;
};

type Inquiries = {
  _id: string;
  message: string;
  id: number;
  userName: string | null;
  type: string;
  Status: string;
  createdAt: string;
  WrapUp: string;
  CompanyName: string;
  NotificationStatus: string;
};

type Email = {
  id: number;
  message: string;
  Email: string;
  subject: string;
  status: string;
  recepient: string;
  sender: string;
  date_created: string;
  NotificationStatus: string;
  recipientEmail: string;
};

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onToggleTheme, isDarkMode }) => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userReferenceId, setUserReferenceId] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<"notifications" | "messages">("notifications");
  const [loadingId, setLoadingId] = useState<string | number | null>(null);
  const [notificationData, setNotificationData] = useState<NotificationData[]>([]);
  const [callbackNotification, setCallbackNotification] = useState<Callback[]>([]);
  const [trackingNotifications, setTrackingNotifications] = useState<TrackingItem[]>([]);
  const [wrapUpNotifications, setWrapUpNotifications] = useState<Inquiries[]>([]);
  const [emailNotifications, setEmailNotifications] = useState<Email[]>([]);
  const allNotifications = [...notifications, ...trackingNotifications, ...callbackNotification, ...notificationData];
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentNotifIndex, setCurrentNotifIndex] = useState(0);
  const [shake, setShake] = useState(false);
  const soundPlayed = localStorage.getItem("soundPlayed");

  // Play sound only once
  const playSound = () => {
    const audio = new Audio("/simple_notification.mp3");
    audio.play();
  };

  const hasNotifications = [
    trackingNotifications.filter((notif) => notif.type === "Taskflow Notification" && notif.status === "Used").length,
    trackingNotifications.filter((notif) => notif.type === "DTracking Notification" && notif.TrackingStatus === "Open" && notif.status !== "Read").length,
    wrapUpNotifications.filter((notif) => notif.type === "WrapUp Notification" && notif.Status === "Endorsed" && notif.NotificationStatus !== "Read").length,
    notificationData.filter((notif) => notif.type === "Notification" && notif.activitystatus && notif.csrremarks !== "Read").length
  ].some(count => count > 0);

  useEffect(() => {
    if (hasNotifications && !soundPlayed) {
      playSound();
      localStorage.setItem("soundPlayed", "true"); 
    }
  }, [hasNotifications, soundPlayed]);

  useEffect(() => {
    if (hasNotifications) {
      setShake(true); 
    } else {
      setShake(false);
    }
  }, [hasNotifications]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const params = new URLSearchParams(window.location.search);
      const userId = params.get("id");

      if (userId) {
        try {
          const response = await fetch(`/api/user?id=${encodeURIComponent(userId)}`);
          if (!response.ok) throw new Error("Failed to fetch user data");

          const data = await response.json();
          setUserName(data.Firstname);
          setUserEmail(data.Email);
          setUserReferenceId(data.ReferenceID || "");
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/getUsers"); // API endpoint mo
        const data = await response.json();
        setUsersList(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!userReferenceId) return;

    const fetchNotificationsData = async () => {
      try {
        const res = await fetch(`/api/ModuleCSR/Task/Progress/FetchProgress?referenceId=${userReferenceId}`);
        const data = await res.json();

        if (!data.success) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const validNotifications = data.data
          .filter((notif: any) => {
            const notifDate = new Date(notif.date_created);
            notifDate.setHours(0, 0, 0, 0);
            return notif.csragent === userReferenceId && notifDate <= today;
          })
          .sort((a: any, b: any) => {
            return new Date(b.date_created).getTime() - new Date(a.date_created).getTime();
          });

        const formattedNotificationsData: NotificationData[] = validNotifications.map((notif: any) => {
          const user = usersList.find((user: any) => user.ReferenceID === notif.referenceid);
          const fullname = user ? `${user.Firstname} ${user.Lastname}` : "Unknown User";

          return {
            _id: notif.id || notif._id,
            id: notif.id,
            date_created: notif.date_created,
            activitystatus: notif.activitystatus,
            csragent: notif.csragent,
            companyname: notif.companyname,
            typecall: notif.typecall,
            typeactivity: notif.typeactivity,
            csrremarks: notif.csrremarks,
            fullname,
            ticketreferencenumber: notif.ticketreferencenumber,
            remarks: notif.remarks || "No remarks.",
            type: "Notification"
          };
        });

        setNotificationData(formattedNotificationsData);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotificationsData();
    const interval = setInterval(fetchNotificationsData, 10000);

    return () => clearInterval(interval);
  }, [userReferenceId, usersList]);

  useEffect(() => {
    if (notificationData.length > 0) {
      setShowModal(true);
    }
  }, [notificationData]);

  const fetchTrackingData = async () => {
    try {
      if (!userReferenceId) {
        console.error("userReferenceId is missing.");
        return;
      }

      const res = await fetch(`/api/ModuleCSR/DTracking/FetchTrackingNotification?referenceId=${userReferenceId}`);
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data: TrackingItem[] = await res.json();
      const filtered = data.filter((item: TrackingItem) =>
        item.TicketConcern === "Delivery / Pickup" ||
        item.TicketConcern === "Quotation" ||
        item.TicketConcern === "Documents" ||
        item.TicketConcern === "Return Call" ||
        item.TicketConcern === "Payment Terms" ||
        item.TicketConcern === "Refund" ||
        item.TicketConcern === "Replacement" ||
        item.TicketConcern === "Site Visit" ||
        item.TicketConcern === "TDS" ||
        item.TicketConcern === "Shop Drawing" ||
        item.TicketConcern === "Dialux" ||
        item.TicketConcern === "Product Testing" ||
        item.TicketConcern === "SPF" ||
        item.TicketConcern === "Accreditation Request" ||
        item.TicketConcern === "Job Request" ||
        item.TicketConcern === "Product Recommendation" ||
        item.TicketConcern === "Product Certificate"
      );

      if (filtered.length > 0) {
        const mapped = filtered.map((item: TrackingItem) => {
          const createdAt = new Date(item.createdAt || new Date().toISOString());
          const currentTime = new Date();
          const timeDifference = currentTime.getTime() - createdAt.getTime();
          const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
          const hoursDifference = timeDifference / (1000 * 3600);

          if (item.TrackingStatus === "Open") {
            const baseNotification = {
              _id: item._id,
              userName: item.userName || "System",
              type: "DTracking Notification",
              TrackingStatus: "Open",
              createdAt: createdAt.toISOString(),
              TicketConcern: item.TicketConcern,
              CompanyName: item.CompanyName,
              status: item.status,
            };

            if (item.TicketConcern === "Delivery / Pickup" && daysDifference >= 3) {
              return {
                ...baseNotification,
                message: `The 'Delivery/Pickup' ticket is still unresolved after ${daysDifference} days.`,
              };
            }

            if (item.TicketConcern === "Quotation" && hoursDifference >= 4) {
              return {
                ...baseNotification,
                message: `You have an active 'Quotation' ticket that has been open for over 4 hours.`,
              };
            }

            if (item.TicketConcern === "Documents" && daysDifference >= 1) {
              return {
                ...baseNotification,
                message: `You have an active 'Documents' ticket that is still open after 1 day.`,
              };
            }

            if (item.TicketConcern === "Return Call" && hoursDifference >= 4) {
              return {
                ...baseNotification,
                message: `You currently have an active 'Return Call' ticket. Please take the necessary action.`,
              };
            }

            if (item.TicketConcern === "Payment Terms" && daysDifference >= 2) {
              return {
                ...baseNotification,
                message: `Your 'Payment Terms' ticket is still open and needs your attention.`,
              };
            }

            if (item.TicketConcern === "Refund" && daysDifference >= 2) {
              return {
                ...baseNotification,
                message: `Your 'Refund' ticket is still open and requires your attention.`,
              };
            }

            if (item.TicketConcern === "Replacement" && daysDifference >= 3) {
              return {
                ...baseNotification,
                message: `Your 'Replacement' ticket remains open. Please follow up.`,
              };
            }

            if (item.TicketConcern === "Site Visit" && daysDifference >= 2) {
              return {
                ...baseNotification,
                message: `Your 'Site Visit' ticket is still open and awaiting your follow-up.`,
              };
            }

            if (item.TicketConcern === "TDS" && daysDifference >= 1) {
              return {
                ...baseNotification,
                message: `Your 'TDS' ticket is still open. Please take action.`,
              };
            }

            if (item.TicketConcern === "Shop Drawing" && daysDifference >= 1) {
              return {
                ...baseNotification,
                message: `Your 'Shop Drawing' ticket is still open. Kindly address it.`,
              };
            }

            if (item.TicketConcern === "Dialux" && daysDifference >= 3) {
              return {
                ...baseNotification,
                message: `Your 'Dialux' ticket remains open. Please follow up.`,
              };
            }

            if (item.TicketConcern === "Product Testing" && daysDifference >= 2) {
              return {
                ...baseNotification,
                message: `Your 'Product Testing' ticket remains open. Kindly resolve it.`,
              };
            }

            if (item.TicketConcern === "SPF" && daysDifference >= 3) {
              return {
                ...baseNotification,
                message: `Your 'SPF' ticket remains open. Kindly resolve it.`,
              };
            }

            if (item.TicketConcern === "Accreditation Request" && daysDifference >= 1) {
              return {
                ...baseNotification,
                message: `Your 'Accreditation Request' ticket is still open. Kindly resolve it.`,
              };
            }

            if (item.TicketConcern === "Job Request" && daysDifference >= 1) {
              return {
                ...baseNotification,
                message: `Your 'Job Request' ticket is still open. Kindly resolve it.`,
              };
            }

            if (item.TicketConcern === "Product Recommendation" && daysDifference >= 1) {
              return {
                ...baseNotification,
                message: `Your 'Product Recommendation' ticket is still open. Kindly resolve it.`,
              };
            }

            if (item.TicketConcern === "Product Certificate" && daysDifference >= 1) {
              return {
                ...baseNotification,
                message: `Your 'Product Certificate' ticket is still open. Kindly resolve it.`,
              };
            }
          }

          return null;
        }).filter(Boolean); 

        const validMapped = mapped.filter(item => item !== null) as TrackingItem[];
        if (validMapped.length > 0) {
          setTrackingNotifications(validMapped);
        }
      }
    } catch (error) {
      console.error("Error fetching tracking data:", error);
    }
  };

  useEffect(() => {
    if (userReferenceId) {
      fetchTrackingData(); 

      const interval = setInterval(() => {
        fetchTrackingData();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [userReferenceId]);

  const fetchWrapUpData = async () => {
    try {
      if (!userReferenceId) {
        console.error("userReferenceId is missing.");
        return;
      }

      const res = await fetch(`/api/ModuleCSR/WrapUp/FetchWrapUpNotification?referenceId=${userReferenceId}`);

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data: Inquiries[] = await res.json();

      const validWrapUps = [
        "Customer Inquiry Sales",
        "Customer Inquiry Non-Sales",
        "Follow Up Sales",
        "After Sales",
        "Customer Complaint",
        "Follow Up Non-Sales",
      ];

      const filtered = data.filter(
        (item) =>
          validWrapUps.includes(item.WrapUp) &&
          item.Status === "Endorsed" &&
          item.NotificationStatus !== "Read"
      );

      const notifications = filtered
        .map((item) => {
          const createdAt = new Date(item.createdAt || new Date().toISOString());
          const currentTime = new Date();
          const timeDiff = currentTime.getTime() - createdAt.getTime();

          const hours = timeDiff / (1000 * 3600);
          const days = Math.floor(timeDiff / (1000 * 3600 * 24));

          let shouldNotify = false;

          switch (item.WrapUp) {
            case "Customer Inquiry Sales":
            case "Follow Up Sales":
              shouldNotify = hours >= 4;
              break;

            case "Customer Inquiry Non-Sales":
              shouldNotify = hours >= 4;
              break;

            case "After Sales":
              shouldNotify = days >= 3;
              break;

            case "Customer Complaint":
              shouldNotify = timeDiff >= 24 * 60 * 60 * 1000;
              break;

            case "Follow Up Non-Sales":
              shouldNotify = timeDiff >= 60 * 1000;
              break;

            default:
              shouldNotify = false;
          }

          if (shouldNotify) {
            return {
              _id: item._id,
              message: `The '${item.WrapUp}' ticket is still unresolved.`,
              userName: item.userName || "System",
              type: "WrapUp Notification",
              Status: item.Status,
              createdAt: createdAt.toISOString(),
              WrapUp: item.WrapUp,
              CompanyName: item.CompanyName,
              NotificationStatus: item.NotificationStatus,
            };
          }

          return null;
        })
        .filter(Boolean) as Inquiries[];

      if (notifications.length > 0) {
        setWrapUpNotifications(notifications);
      }
    } catch (error) {
      console.error("Error fetching wrap-up data:", error);
    }
  };

  useEffect(() => {
    if (userReferenceId) {
      fetchWrapUpData();

      const interval = setInterval(() => {
        fetchWrapUpData(); 
      }, 30000); 

      return () => clearInterval(interval);
    }
  }, [userReferenceId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMarkAsStatusRead = async (notifId: string) => {
    try {
      setLoadingId(notifId);

      const response = await fetch("/api/ModuleCSR/DTracking/UpdateNotifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notifId, status: "Read" }),
      });

      if (response.ok) {
        const updatedNotifications = notifications.map((notif) =>
          notif._id === notifId ? { ...notif, status: "Read" } : notif
        );
        setNotifications(updatedNotifications);
        setTimeout(() => {
          setNotifications((prev) =>
            prev.filter((notif) => notif._id !== notifId)
          );
        }, 60000);
      } else {
        const errorDetails = await response.json();
        console.error("Error updating notification status:", {
          status: response.status,
          message: errorDetails.message || "Unknown error",
          details: errorDetails,
        });
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    } finally {
      setLoadingId(null);
    }
  };

  const handleMarkAsNotifStatusRead = async (notifId: string) => {
    try {
      setLoadingId(notifId);

      const response = await fetch("/api/ModuleCSR/WrapUp/UpdateNotifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notifId, NotificationStatus: "Read" }),
      });

      if (response.ok) {
        const updatedNotifications = notifications.map((notif) =>
          notif._id === notifId ? { ...notif, NotificationStatus: "Read" } : notif
        );
        setNotifications(updatedNotifications);
        setTimeout(() => {
          setNotifications((prev) =>
            prev.filter((notif) => notif._id !== notifId)
          );
        }, 60000);
      } else {
        const errorDetails = await response.json();
        console.error("Error updating notification status:", {
          status: response.status,
          message: errorDetails.message || "Unknown error",
          details: errorDetails,
        });
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    } finally {
      setLoadingId(null);
    }
  };

  const UpdateProgressStatus = async (progressId: string) => {
    try {
      setLoadingId(progressId);
      const progressIdAsString = progressId.toString();
      console.log("Sending request to update CSR with ID:", progressIdAsString);

      const response = await fetch("/api/ModuleCSR/Task/Progress/UpdateProgress", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: [progressIdAsString],
          csrremarks: "Read",
        }),
      });

      if (response.ok) {
        setNotificationData((prev) =>
          prev.map((notif) =>
            notif.id && notif.id.toString() === progressIdAsString
              ? { ...notif, csrremarks: "Read" }
              : notif
          )
        );
       
        setNotificationData((prev) =>
          prev.filter((notif) => notif.id && notif.id.toString() !== progressIdAsString)
        );
      } else {
        const errorDetails = await response.json();
        console.error("Error updating progress csrremarks:", errorDetails);
      }
    } catch (error) {
      console.error("Error marking progress as read:", error);
    } finally {
      setLoadingId(null);
    }
  };

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

  const filteredNotifications = notificationData.filter(
    (notif) => notif.ticketreferencenumber && notif.csrremarks !== "Read"
  );

  const notif = filteredNotifications[currentNotifIndex] || null;

  useEffect(() => {
    if (showModal && notif) {
      const audio = new Audio('/alertmessage.mp3');
      audio.play().catch((err) => console.error("Audio play failed:", err));
    }
  }, [showModal, notif]);

  return (
    <div className={`sticky top-0 z-[999] flex justify-between items-center p-4 transition-all duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className="flex items-center space-x-4">
        <button onClick={onToggleSidebar} title="Show Sidebar" className="rounded-full shadow-lg block sm:hidden">
          <img src="/ecodesk.png" alt="Logo" className="h-8" />
        </button>
      </div>

      <div className="relative flex items-center text-center text-xs space-x-2" ref={dropdownRef}>
        <button
          onClick={onToggleTheme}
          className="relative flex items-center bg-gray-200 dark:bg-gray-700 rounded-full w-16 h-8 p-1 transition-all duration-300"
        >
          {/* Toggle Knob with Icon Centered */}
          <div
            className={`w-6 h-6 bg-white dark:bg-yellow-400 rounded-full shadow-md flex justify-center items-center transform transition-transform duration-300 ${isDarkMode ? "translate-x-8" : "translate-x-0"
              }`}
          >
            {isDarkMode ? (
              <CiDark size={16} className="text-gray-900 dark:text-gray-300" />
            ) : (
              <CiSun size={16} className="text-yellow-500" />
            )}
          </div>
        </button>

        {/* Notification Icon */}
        <button onClick={() => setShowSidebar((prev) => !prev)} className="p-2 relative flex items-center hover:bg-gray-200 hover:rounded-full">
          <CiBellOn size={20} className={`${shake ? "animate-shake" : ""}`} />
          {(() => {

            const taskflowCount = callbackNotification.filter(
              (notif) => notif.type === "Taskflow Notification" &&
                notif.status === "Used"
            ).length;

            const dTrackingCount = trackingNotifications.filter(
              (notif) => notif.type === "DTracking Notification" &&
                notif.TrackingStatus === "Open" &&
                notif.status !== "Read"
            ).length;

            const wrapUpCount = wrapUpNotifications.filter(
              (notif) => notif.type === "WrapUp Notification" &&
                notif.Status === "Endorsed" &&
                notif.NotificationStatus !== "Read"
            ).length;


            const ProgressCount = notificationData.filter(
              (notif) => notif.type === "Notification" &&
                notif.activitystatus &&
                notif.csrremarks !== "Read"
            ).length;

            const emailCount = emailNotifications.filter(
              (notif) => notif.status === "Pending" && notif.recepient === userEmail
            ).length;

            const totalCount = taskflowCount + dTrackingCount + wrapUpCount + emailCount + ProgressCount;

            return totalCount > 0 ? (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center">
                {totalCount}
              </span>
            ) : null;
          })()}

        </button>

        {showSidebar && (
          <NotifSidebar
            sidebarRef={sidebarRef}
            setShowSidebar={setShowSidebar}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            notificationData={notificationData}
            notifications={notifications}
            trackingNotifications={trackingNotifications}
            wrapUpNotifications={wrapUpNotifications}
            UpdateProgressStatus={UpdateProgressStatus}
            handleMarkAsStatusRead={handleMarkAsStatusRead}
            handleMarkAsNotifStatusRead={handleMarkAsNotifStatusRead}
            loadingId={loadingId}
            formatDate={formatDate}
          />

        )}

        {showModal && notif && (
          <PopUpModal
            notif={notif}
            currentNotifIndex={currentNotifIndex}
            filteredNotifications={filteredNotifications}
            loadingId={loadingId?.toString() || ""}
            UpdateProgressStatus={UpdateProgressStatus}
            setCurrentNotifIndex={setCurrentNotifIndex}
          />
        )}

      </div>
    </div>
  );
};

export default Navbar;