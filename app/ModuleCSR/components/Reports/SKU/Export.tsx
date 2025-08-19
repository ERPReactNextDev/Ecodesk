"use client";

import React from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { FaFileExport } from "react-icons/fa6";

interface ExportProps {
  currentPosts: any[];
  managerMap?: Record<string, string>;
  agentMap?: Record<string, string>;
}

const Export: React.FC<ExportProps> = ({ currentPosts, managerMap = {}, agentMap = {} }) => {
  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Your App Name";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("SKU Data");

    // All columns from your table
    worksheet.columns = [
      { header: "Date", key: "createdAt", width: 20 },
      { header: "Company Name", key: "CompanyName", width: 25 },
      { header: "Item Category", key: "Remarks", width: 25 },
      { header: "Item Code", key: "ItemCode", width: 25 },
      { header: "Item Description", key: "ItemDescription", width: 25 },
      { header: "Quantity", key: "Quantity", width: 20 },
      { header: "Inquiry", key: "Inquiries", width: 25 },
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
        createdAt: post.createdAt ? new Date(post.TicketReceived).toLocaleString() : "-",
        CompanyName: post.CompanyName || "-",
        Remarks: post.Remarks || "-",
        ItemCode: post.ItemCode || "-",
        ItemDescription: post.ItemDescription || "-",
        Quantity: post.Quantity || "-",
        Inquiries: post.Inquiries || "-",
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
      `SKU_Listing_Data_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  return (
    <button
      onClick={handleExport}
      disabled={currentPosts.length === 0}
      className={`flex items-center justify-center gap-2 px-3 py-3 text-xs font-semibold rounded-lg transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${currentPosts.length === 0
          ? "bg-gray-300 text-gray-500 cursor-not-allowed flex"
          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md"
        }
        active:scale-[0.98] transform transition-transform`}
    >
      <FaFileExport size={15} /> Export
    </button>
  );
};

export default Export;
