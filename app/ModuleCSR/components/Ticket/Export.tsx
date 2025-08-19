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
      { header: "Ticket No", key: "TicketReferenceNumber", width: 20 },
      { header: "Ticket Received", key: "TicketReceived", width: 25 },
      { header: "Ticket Endorsed", key: "TicketEndorsed", width: 25 },
      { header: "Company Name", key: "CompanyName", width: 25 },
      { header: "Customer Name", key: "CustomerName", width: 25 },
      { header: "Contact Number", key: "ContactNumber", width: 20 },
      { header: "Email", key: "Email", width: 25 },
      { header: "Gender", key: "Gender", width: 15 },
      { header: "Customer Segment", key: "CustomerSegment", width: 20 },
      { header: "City Address", key: "CityAddress", width: 25 },
      { header: "Traffic", key: "Traffic", width: 15 },
      { header: "Channel", key: "Channel", width: 15 },
      { header: "Wrap-Up", key: "WrapUp", width: 20 },
      { header: "Source", key: "Source", width: 20 },
      { header: "SO Number", key: "SONumber", width: 20 },
      { header: "SO Amount", key: "SOAmount", width: 15 },
      { header: "Quantity", key: "Quantity", width: 10 },
      { header: "PO Number", key: "PONumber", width: 20 },
      { header: "SO Date", key: "SODate", width: 20 },
      { header: "Payment Terms", key: "PaymentTerms", width: 20 },
      { header: "PO Source", key: "POSource", width: 20 },
      { header: "PO Status", key: "POStatus", width: 20 },
      { header: "Payment Date", key: "PaymentDate", width: 20 },
      { header: "Delivery Date", key: "DeliveryDate", width: 20 },
      { header: "Customer Type", key: "CustomerType", width: 20 },
      { header: "Customer Status", key: "CustomerStatus", width: 20 },
      { header: "Status", key: "Status", width: 15 },
      { header: "Department", key: "Department", width: 20 },
      { header: "Sales Manager", key: "SalesManager", width: 25 },
      { header: "Sales Agent", key: "SalesAgent", width: 25 },
      { header: "Remarks", key: "Remarks", width: 30 },
      { header: "Inquiry / Concern", key: "Inquiries", width: 30 },
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
        TicketReferenceNumber: post.TicketReferenceNumber,
        TicketReceived: post.TicketReceived ? new Date(post.TicketReceived).toLocaleString() : "-",
        TicketEndorsed: post.TicketEndorsed ? new Date(post.TicketEndorsed).toLocaleString() : "-",
        CompanyName: post.CompanyName || "-",
        CustomerName: post.CustomerName || "-",
        ContactNumber: post.ContactNumber || "-",
        Email: post.Email || "-",
        Gender: post.Gender || "-",
        CustomerSegment: post.CustomerSegment || "-",
        CityAddress: post.CityAddress || "-",
        Traffic: post.Traffic || "-",
        Channel: post.Channel || "-",
        WrapUp: post.WrapUp || "-",
        Source: post.Source || "-",
        SONumber: post.SONumber || "-",
        SOAmount: post.SOAmount || "-",
        Quantity: post.Quantity || "-",
        PONumber: post.PONumber || "-",
        SODate: post.SODate || "-",
        PaymentTerms: post.PaymentTerms || "-",
        POSource: post.POSource || "-",
        POStatus: post.POStatus || "-",
        PaymentDate: post.PaymentDate ? new Date(post.PaymentDate).toLocaleDateString() : "-",
        DeliveryDate: post.DeliveryDate ? new Date(post.DeliveryDate).toLocaleDateString() : "-",
        CustomerType: post.CustomerType || "-",
        CustomerStatus: post.CustomerStatus || "-",
        Status: post.Status || "-",
        Department: post.Department || "-",
        SalesManager: managerMap[post.SalesManager] || "-",
        SalesAgent: agentMap[post.SalesAgent] || "-",
        Remarks: post.Remarks || "-",
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
      `Ticket_Data_${new Date().toISOString().slice(0, 10)}.xlsx`
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
