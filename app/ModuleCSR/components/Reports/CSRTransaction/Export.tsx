"use client";

import React from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { FaFileExport } from "react-icons/fa6";

interface ExportProps {
  currentPosts: any[];
}

const Export: React.FC<ExportProps> = ({ currentPosts }) => {
  const handleExport = async () => {
    if (!currentPosts || currentPosts.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Your App Name";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("CSR Transactions");

    // Define columns, kasama ang Agent at Manager full names
    worksheet.columns = [
      { header: "Ticket Ref", key: "ticketreferencenumber", width: 20 },
      { header: "Company Name", key: "companyname", width: 25 },
      { header: "Date Created", key: "date_created", width: 20 },
      { header: "Contact Person", key: "contact_person", width: 25 },
      { header: "Contact Number", key: "contactnumber", width: 20 },
      { header: "Email", key: "emailaddress", width: 25 },
      { header: "Wrap Up", key: "wrapup", width: 25 },
      { header: "Inquiry", key: "inquiries", width: 25 },
      { header: "Remarks", key: "remarks", width: 25 },
      { header: "Agent Name", key: "agent_fullname", width: 25 },
      { header: "Manager Name", key: "manager_fullname", width: 25 },
      { header: "Start Date", key: "startdate", width: 20 },
      { header: "End Date", key: "enddate", width: 20 },
    ];

    // Header style
    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4472C4" },
      };
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    // Add data rows
    currentPosts.forEach((post) => {
      worksheet.addRow({
        ticketreferencenumber: post.ticketreferencenumber || "-",
        companyname: post.companyname || "-",
        date_created: post.date_created || "-",
        contact_person: post.contact_person || "-",
        contactnumber: post.contactnumber || "-",
        emailaddress: post.emailaddress || "-",
        wrapup: post.wrapup || "-",
        inquiries: post.inquiries || "-",
        remarks: post.remarks || "-",
        agent_fullname: `${post.AgentFirstname || ""} ${post.AgentLastname || ""}`.trim(),
        manager_fullname: `${post.ManagerFirstname || ""} ${post.ManagerLastname || ""}`.trim(),
        startdate: post.startdate || "-",
        enddate: post.enddate || "-",
      });
    });

    // Apply borders to data rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      }
    });

    // Save Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer]),
      `CSR_Transactions_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  return (
    <button
      onClick={handleExport}
      disabled={currentPosts.length === 0}
      className={`flex items-center justify-center gap-2 px-3 py-3 text-xs font-semibold rounded-lg transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${currentPosts.length === 0
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md"
        }
        active:scale-[0.98] transform transition-transform`}
    >
      <FaFileExport size={15} /> Export
    </button>
  );
};

export default Export;
