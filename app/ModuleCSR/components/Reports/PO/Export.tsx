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

    const worksheet = workbook.addWorksheet("Ticket Data");

    // All columns from your table
    worksheet.columns = [
      { header: "CSR Agent", key: "userName", width: 20 },
      { header: "Company Name", key: "CompanyName", width: 25 },
      { header: "PO Number", key: "PONumber", width: 25 },
      { header: "PO Amount", key: "POAmount", width: 25 },
      { header: "SO Number", key: "SONumber", width: 25 },
      { header: "SO Date", key: "SODate", width: 20 },
      { header: "Sales Agent", key: "SalesAgent", width: 25 },
      { header: "Payment Terms", key: "PaymentTerms", width: 15 },
      { header: "Payment Date", key: "PaymentDate", width: 20 },
      { header: "Delivery Date", key: "DeliveryDate", width: 25 },
      { header: "PO Status", key: "POStatus", width: 15 },
      { header: "PO Remarks", key: "PORemarks", width: 15 },
      { header: "PO Source", key: "POSource", width: 20 },
      { header: "Source", key: "Source", width: 20 },
      { header: "Date", key: "createdAt", width: 20 },
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
        userName: post.userName,
        CompanyName: post.CompanyName || "-",
        PONumber: post.PONumber || "-",
        POAmount: post.POAmount || "-",
        SONumber: post.SONumber || "-",
        SODate: post.SODate || "-",
        SalesAgent: post.SalesAgent || "-",
        PaymentTerms: post.PaymentTerms || "-",
        PaymentDate: post.PaymentDate || "-",
        DeliveryDate: post.DeliveryDate || "-",
        POStatus: post.POStatus || "-",
        PORemarks: post.PORemarks || "-",
        createdAt: post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "-",
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
      `PO_Data_${new Date().toISOString().slice(0, 10)}.xlsx`
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
