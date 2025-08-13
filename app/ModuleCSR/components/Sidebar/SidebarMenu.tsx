import React from "react";
import Link from "next/link";
import { RxCaretDown, RxCaretLeft } from "react-icons/rx";
import { FaRegCircle } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";

interface SubItem {
    title: string;
    href: string;
    description?: string;
}

interface MenuItem {
    title: string;
    icon: any;
    subItems: SubItem[];
}

interface SidebarMenuProps {
    collapsed: boolean;
    openSections: Record<string, boolean>;
    handleToggle: (title: string) => void;
    menuItems: MenuItem[];
    userId: string | null;
    pendingInquiryCount?: number;
    pendingInactiveCount?: number;
    pendingDeleteCount?: number;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
    collapsed,
    openSections,
    handleToggle,
    menuItems,
    userId,
    pendingInquiryCount = 0,
    pendingInactiveCount = 0,
    pendingDeleteCount = 0,
}) => {
    const myProfileItem = {
        title: "My Profile",
        icon: CiSettings,
        subItems: [
            {
                title: "Update Profile",
                href: `/ModuleCSR/CSR/Profile${userId ? `?id=${encodeURIComponent(userId)}` : ""}`,
            },
        ],
    };

    const Badge = ({ count }: { count: number }) =>
        count > 0 && (
            <span className="ml-2 text-[10px] bg-red-500 rounded-full px-2 py-[1px] text-white font-medium shadow-sm">
                {count}
            </span>
        );

    return (
        <div className="flex flex-col flex-grow overflow-y-auto text-xs p-2 space-y-1">
            {/* --- My Profile Section --- */}
            <div className="w-full">
                <button
                    onClick={() => handleToggle(myProfileItem.title)}
                    className={`flex items-center w-full p-3 rounded-md hover:bg-emerald-500 hover:text-white transition-all duration-200 ${
                        collapsed ? "justify-center" : ""
                    }`}
                >
                    <myProfileItem.icon size={18} />
                    {!collapsed && <span className="ml-3 font-medium">{myProfileItem.title}</span>}
                    {!collapsed && (
                        <span className="ml-auto">
                            {openSections[myProfileItem.title] ? <RxCaretDown size={16} /> : <RxCaretLeft size={16} />}
                        </span>
                    )}
                </button>

                <div
                    className={`overflow-hidden transition-all duration-300 ${
                        openSections[myProfileItem.title] ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    {!collapsed &&
                        openSections[myProfileItem.title] &&
                        myProfileItem.subItems.map((subItem, subIndex) => (
                            <Link
                                key={subIndex}
                                href={subItem.href}
                                className="flex items-center w-full p-3 pl-6 bg-gray-100 hover:bg-emerald-500 hover:text-white rounded-md mt-1 transition-colors duration-200"
                            >
                                <FaRegCircle size={8} className="mr-2" />
                                {subItem.title}
                            </Link>
                        ))}
                </div>
            </div>

            {/* --- Dashboard --- */}
            <Link
                href={`/ModuleCSR/CSR/Dashboard/${userId ? `?id=${encodeURIComponent(userId)}` : ""}`}
                className="flex items-center w-full p-3 bg-emerald-500 text-white rounded-md hover:shadow-lg transition-all duration-200"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 3h4v4H3V3zm5 0h4v4H8V3zm5 0h4v4h-4V3zM3 8h4v4H3V8zm5 0h4v4H8V8zm5 0h4v4h-4V8zM3 13h4v4H3v-4zm5 0h4v4H8v-4zm5 0h4v4h-4v-4z" />
                </svg>
                {!collapsed && <span className="font-medium">Dashboard</span>}
            </Link>

            {/* --- Other Menu Items --- */}
            {menuItems
                .filter((item) => item.title !== "My Profile")
                .map((item, index) => (
                    <div key={index} className="w-full">
                        <button
                            onClick={() => handleToggle(item.title)}
                            className={`flex items-center w-full p-3 rounded-md hover:bg-emerald-500 hover:text-white transition-all duration-200 ${
                                collapsed ? "justify-center" : ""
                            }`}
                        >
                            <item.icon size={18} />
                            {!collapsed && <span className="ml-3 font-medium">{item.title}</span>}
                            {!collapsed && (
                                <span className="ml-auto">
                                    {openSections[item.title] ? <RxCaretDown size={16} /> : <RxCaretLeft size={16} />}
                                </span>
                            )}
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-300 ${
                                openSections[item.title] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                            }`}
                        >
                            {!collapsed &&
                                openSections[item.title] &&
                                item.subItems.map((subItem, subIndex) => (
                                    <Link
                                        key={subIndex}
                                        href={subItem.href}
                                        className="flex flex-col p-3 pl-6 bg-gray-100 hover:bg-emerald-500 hover:text-white rounded-md mt-1 transition-colors duration-200"
                                    >
                                        <div className="flex items-center">
                                            <FaRegCircle size={8} className="mr-2" />
                                            <span>{subItem.title}</span>
                                        </div>
                                        {subItem.description && (
                                            <p className="mt-1 text-[10px] opacity-80 leading-tight">{subItem.description}</p>
                                        )}
                                    </Link>
                                ))}
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default SidebarMenu;
