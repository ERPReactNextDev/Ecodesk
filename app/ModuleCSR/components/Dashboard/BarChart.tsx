"use client";

import React, { useEffect, useState, useMemo } from "react";
import { RiRefreshLine } from "react-icons/ri";
import { CiExport } from "react-icons/ci";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, } from "recharts";

interface Metric {
  createdAt: string;
  Channel: string;
  Traffic: string;
  ReferenceID: string;
  CustomerName?: string;
  CompanyName?: string;
}

interface MetricTableProps {
  ReferenceID: string;
  month?: number;
  year?: number;
  Role: string;
  startDate?: string;
  endDate?: string;
}

const CHANNELS = [
  "Google Maps", "Website", "FB Main", "FB ES Home", "Viber", "Text Message",
  "Instagram", "Voice Call", "Email", "Whatsapp", "Shopify"
];

const COLORS = [
  "#3A7D44", "#27445D", "#71BBB2", "#578FCA", "#9966FF", "#FF9F40",
  "#C9CBCF", "#8B0000", "#008080", "#FFD700", "#DC143C"
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg px-4 py-2 text-xs text-gray-700">
        <p className="font-semibold">{label}</p>
        <p>Count: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const MetricTable: React.FC<MetricTableProps> = ({
  ReferenceID, Role, startDate, endDate
}) => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const url = `/api/ModuleCSR/Dashboard/Metrics?ReferenceID=${ReferenceID}&Role=${Role}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch metrics");
        let data: Metric[] = await res.json();

        if (Role === "Staff") {
          data = data.filter(m => m.ReferenceID === ReferenceID);
        }

        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);

        const filtered = data.filter(({ createdAt }) => {
          const created = new Date(createdAt);
          return (!start || created >= start) && (!end || created <= end);
        });

        setMetrics(filtered);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [ReferenceID, Role, startDate, endDate]);

  const grouped = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const { Channel } of metrics) {
      if (!CHANNELS.includes(Channel)) continue;
      counts[Channel] = (counts[Channel] || 0) + 1;
    }
    return Object.entries(counts).map(([channel, count]) => ({
      name: channel,
      value: count,
    }));
  }, [metrics]);

  const handleExportCSV = () => {
    const csvRows = [
      ["Channel", "Created At", "Customer Name", "Company Name"]
    ];

    metrics.forEach(m => {
      csvRows.push([
        m.Channel,
        new Date(m.createdAt).toLocaleString(),
        m.CustomerName || "N/A",
        m.CompanyName || "N/A"
      ]);
    });

    const blob = new Blob([csvRows.map(row => row.join(",")).join("\n")], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "EcoDesk_Metrics.csv";
    link.click();
  };

  const filteredDataByChannel = (channel: string) =>
    metrics.filter(m => m.Channel === channel);

  return (
    <div className="bg-white w-full h-auto">
      {loading ? (
        <div className="flex justify-center items-center w-full h-full">
          <RiRefreshLine size={30} className="animate-spin text-gray-600" />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-left text-sm font-semibold">Channel</h3>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1 border mb-2 bg-white text-black text-xs px-4 py-2 shadow-sm rounded hover:bg-orange-500 hover:text-white transition"
            >
              <CiExport size={16} /> Export
            </button>
          </div>

          <div className="w-full h-[400px] text-[12px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={grouped}
                margin={{ top: 20, right: 30, left: 0, bottom: 30 }}
                onClick={(e) => {
                  if (e && e.activeLabel) {
                    setSelectedChannel(e.activeLabel);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={60} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {grouped.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      cursor="pointer"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 mt-4 text-xs">
            {grouped.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name}
              </div>
            ))}
          </div>

          <div className="text-xs font-medium mt-2 text-right">Total Records: {metrics.length}</div>

          {selectedChannel && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-[999]">
              <div className="bg-white p-4 rounded-lg shadow-md w-[90%] max-w-xl">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-md font-semibold">Channel: {selectedChannel}</h4>
                  <button
                    onClick={() => setSelectedChannel(null)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Close
                  </button>
                </div>
                <ul className="text-sm max-h-[300px] overflow-y-auto space-y-1">
                  {filteredDataByChannel(selectedChannel).map((item, idx) => (
                    <li key={idx} className="border-b py-1">
                      <strong>Company:</strong> {item.CompanyName || "N/A"}<br />
                      <strong>Customer:</strong> {item.CustomerName || "N/A"}<br />
                      <strong>Date:</strong> {new Date(item.createdAt).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MetricTable;
