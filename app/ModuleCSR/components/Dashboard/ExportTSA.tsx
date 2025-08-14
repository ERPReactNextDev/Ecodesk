import React from "react";
import ExcelJS from "exceljs";
import { CiExport } from "react-icons/ci";

interface ExportProps {
  groupedMetrics: any;
  calculateAgentTotals: (metrics: any) => any;
  getSalesAgentName: (agentId: string) => string;
}

const Export: React.FC<ExportProps> = ({ groupedMetrics, calculateAgentTotals, getSalesAgentName }) => {

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("TSA Traffic to Sales Conversion");

    worksheet.columns = [
      { header: 'Agent Name', key: 'agentName', width: 25 },
      { header: 'Sales', key: 'sales', width: 10 },
      { header: 'Non-Sales', key: 'nonSales', width: 10 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'QTY Sold', key: 'qtySold', width: 10 },
      { header: 'Conversion to Sale', key: 'conversionToSale', width: 20 },
      { header: '% Conversion Inquiry to Sales', key: 'conversionPercentage', width: 25 },
      { header: 'New Client', key: 'newClientCount', width: 15 },
      { header: 'New Non-Buying', key: 'newNonBuyingCount', width: 18 },
      { header: 'Existing Active', key: 'existingActiveCount', width: 18 },
      { header: 'Existing Inactive', key: 'existingInactiveCount', width: 20 },
      { header: 'New Client (Converted To Sales)', key: 'newClientConvertedAmount', width: 30 },
      { header: 'New Non-Buying (Converted To Sales)', key: 'newNonBuyingConvertedAmount', width: 35 },
      { header: 'Existing Active (Converted To Sales)', key: 'existingActiveConvertedAmount', width: 35 },
      { header: 'Existing Inactive (Converted To Sales)', key: 'existingInactiveConvertedAmount', width: 35 },
    ];

    Object.keys(groupedMetrics).forEach((refId) => {
      const agentMetrics = groupedMetrics[refId];
      const totals = calculateAgentTotals(agentMetrics);
      const conversionPercentage =
        totals.sales === 0
          ? "0.00%"
          : `${((totals.totalConversionToSale / totals.sales) * 100).toFixed(2)}%`;

      worksheet.addRow({
        agentName: getSalesAgentName(agentMetrics[0].SalesAgent),
        sales: totals.sales,
        nonSales: totals.nonSales,
        amount: totals.totalAmount,
        qtySold: totals.totalQtySold,
        conversionToSale: totals.totalConversionToSale,
        conversionPercentage,
        newClientCount: totals.newClientCount,
        newNonBuyingCount: totals.newNonBuyingCount,
        existingActiveCount: totals.existingActiveCount,
        existingInactiveCount: totals.existingInactiveCount,
        newClientConvertedAmount: totals.newClientConvertedAmount,
        newNonBuyingConvertedAmount: totals.newNonBuyingConvertedAmount,
        existingActiveConvertedAmount: totals.existingActiveConvertedAmount,
        existingInactiveConvertedAmount: totals.existingInactiveConvertedAmount
      });
    });

    worksheet.addRow({}); // spacer

    // Compute overall totals
    const allMetrics = Object.values(groupedMetrics).flat();
    const totals = calculateAgentTotals(allMetrics);
    const totalsRow = worksheet.addRow({
      agentName: 'Total',
      sales: totals.sales,
      nonSales: totals.nonSales,
      amount: totals.totalAmount,
      qtySold: totals.totalQtySold,
      conversionToSale: totals.totalConversionToSale,
      conversionPercentage:
        totals.sales === 0
          ? "0.00%"
          : `${((totals.totalConversionToSale / totals.sales) * 100).toFixed(2)}%`,
      newClientCount: totals.newClientCount,
      newNonBuyingCount: totals.newNonBuyingCount,
      existingActiveCount: totals.existingActiveCount,
      existingInactiveCount: totals.existingInactiveCount,
      newClientConvertedAmount: totals.newClientConvertedAmount,
      newNonBuyingConvertedAmount: totals.newNonBuyingConvertedAmount,
      existingActiveConvertedAmount: totals.existingActiveConvertedAmount,
      existingInactiveConvertedAmount: totals.existingInactiveConvertedAmount
    });

    totalsRow.font = { bold: true };

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "TSATrafficSalesConversion.xlsx";
      link.click();
    });
  };

  return (
    <>
      <h2 className="text-sm font-semibold mb-4 text-left">TSA Sales</h2>
      <button
        onClick={exportToExcel}
        className="flex items-center gap-1 border mb-2 bg-white text-black text-xs px-4 py-2 shadow-sm rounded hover:bg-orange-500 hover:text-white transition"
      >
        <CiExport size={16} /> Export
      </button>
    </>
  );
};

export default Export;
