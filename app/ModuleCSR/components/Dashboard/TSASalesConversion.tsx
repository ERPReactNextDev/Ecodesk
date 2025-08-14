import React, { useEffect, useState, useMemo } from "react";
import { RiRefreshLine } from "react-icons/ri";
import Export from "./ExportTSA";

interface Metric {
    userName: string;
    ReferenceID: string;
    Traffic: string;
    Amount: any;
    QtySold: any;
    Status: string;
    createdAt: string;
    CustomerStatus: string;
    SalesAgent: string;
    TsaAcknowledgeDate?: string;
    TicketEndorsed?: string;
}

interface User {
    ReferenceID: string;
    Firstname: string;
    Lastname: string;
    Role: string;
}

interface AgentSalesConversionProps {
    ReferenceID: string;
    Role: string;
    startDate?: string;
    endDate?: string;
}

const AgentSalesConversion: React.FC<AgentSalesConversionProps> = ({
    ReferenceID,
    Role,
    startDate,
    endDate,
}) => {
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);

    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/ModuleSales/UserManagement/TerritorySalesAssociates/FetchUser");
            if (!response.ok) throw new Error("Failed to fetch users");
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };


    // Function to get Sales Agent name by ReferenceID
    const getSalesAgentName = (referenceID: string): string => {
        // Check if the user exists in the fetched users list
        const user = users.find((user) => user.ReferenceID === referenceID);
        if (user) {
            return `${user.Lastname}, ${user.Firstname}`;
        }
        // Fallback to referenceIdToNameMap if not found
        return "Unknown";
    };

    const fetchMetrics = async () => {
        try {
            const response = await fetch(
                `/api/ModuleCSR/Dashboard/AgentSalesConversion?ReferenceID=${ReferenceID}&Role=${Role}`
            );
            if (!response.ok) throw new Error("Failed to fetch metrics");

            let data = await response.json();

            // Filter if role is Staff
            if (Role === "Staff") {
                data = data.filter((m: Metric) => m.ReferenceID === ReferenceID);
            }

            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            if (start) start.setHours(0, 0, 0, 0);
            if (end) end.setHours(23, 59, 59, 999);

            const filteredData = data.filter(({ createdAt }: Metric) => {
                const created = new Date(createdAt);
                return (!start || created >= start) && (!end || created <= end);
            });

            setMetrics(filteredData);
        } catch (error) {
            console.error("Error fetching metrics:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch users and metrics on component mount or dependencies change
    useEffect(() => {
        fetchUsers();
        fetchMetrics();
    }, [ReferenceID, Role, startDate, endDate]);


    // ✅ Group by ReferenceID
    const groupedMetrics = useMemo(() => {
        return metrics.reduce((acc, metric) => {
            if (!acc[metric.SalesAgent]) {
                acc[metric.SalesAgent] = [];
            }
            acc[metric.SalesAgent].push(metric);
            return acc;
        }, {} as Record<string, Metric[]>);
    }, [metrics]);

    const getMinutesDifference = (start?: string, end?: string) => {
        if (!start || !end) return 0;
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffMs = endDate.getTime() - startDate.getTime();
        return diffMs > 0 ? Math.floor(diffMs / (1000 * 60)) : 0; // total minutes
    };

    const formatMinutesToHM = (minutes: number) => {
        if (minutes <= 0) return "N/A";
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    // ✅ Calculate totals per agent
    const calculateAgentTotals = (agentMetrics: Metric[]) => {
        return agentMetrics.reduce(
            (acc, metric) => {
                const amount = parseFloat(metric.Amount) || 0;
                const qtySold = parseFloat(metric.QtySold) || 0;
                const isSale = metric.Traffic === "Sales";
                const isConverted = metric.Status === "Converted Into Sales";

                acc.sales += isSale ? 1 : 0;
                acc.nonSales += !isSale ? 1 : 0;
                acc.totalAmount += amount;
                acc.totalQtySold += qtySold;
                acc.totalConversionToSale += isConverted ? 1 : 0;

                // ✅ TSA Response Time in minutes
                const minutesDiff = getMinutesDifference(metric.TicketEndorsed, metric.TsaAcknowledgeDate);
                if (minutesDiff > 0) {
                    acc.totalTsaResponseTime += minutesDiff; // total minutes
                    acc.tsaCount += 1;
                }

                // Customer Status counts
                switch (metric.CustomerStatus) {
                    case "New Client":
                        acc.newClientCount += 1;
                        if (isConverted) acc.newClientConvertedAmount += amount;
                        break;
                    case "New Non-Buying":
                        acc.newNonBuyingCount += 1;
                        if (isConverted) acc.newNonBuyingConvertedAmount += amount;
                        break;
                    case "Existing Active":
                        acc.existingActiveCount += 1;
                        if (isConverted) acc.existingActiveConvertedAmount += amount;
                        break;
                    case "Existing Inactive":
                        acc.existingInactiveCount += 1;
                        if (isConverted) acc.existingInactiveConvertedAmount += amount;
                        break;
                    default:
                        break;
                }

                return acc;
            },
            {
                sales: 0,
                nonSales: 0,
                totalAmount: 0,
                totalQtySold: 0,
                totalConversionToSale: 0,
                newClientCount: 0,
                newNonBuyingCount: 0,
                existingActiveCount: 0,
                existingInactiveCount: 0,
                newClientConvertedAmount: 0,
                newNonBuyingConvertedAmount: 0,
                existingActiveConvertedAmount: 0,
                existingInactiveConvertedAmount: 0,
                totalTsaResponseTime: 0, // total in minutes
                tsaCount: 0
            }
        );
    };

    // ✅ Format amount with Peso sign
    const formatAmountWithPeso = (amount: any) => {
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount)) {
            return "₱0.00";
        }
        return `₱${parsedAmount
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
    };

    // ✅ Calculate overall totals for tfoot
    const totals = useMemo(() => {
        return Object.values(groupedMetrics).reduce(
            (acc, agentMetrics) => {
                const totals = calculateAgentTotals(agentMetrics);

                acc.sales += totals.sales;
                acc.nonSales += totals.nonSales;
                acc.totalAmount += totals.totalAmount;
                acc.totalQtySold += totals.totalQtySold;
                acc.totalConversionToSale += totals.totalConversionToSale;
                acc.newClientCount += totals.newClientCount;
                acc.newNonBuyingCount += totals.newNonBuyingCount;
                acc.existingActiveCount += totals.existingActiveCount;
                acc.existingInactiveCount += totals.existingInactiveCount;
                acc.newClientConvertedAmount += totals.newClientConvertedAmount;
                acc.newNonBuyingConvertedAmount += totals.newNonBuyingConvertedAmount;
                acc.existingActiveConvertedAmount += totals.existingActiveConvertedAmount;
                acc.existingInactiveConvertedAmount += totals.existingInactiveConvertedAmount;

                acc.totalATU += totals.totalConversionToSale > 0 ? totals.totalQtySold / totals.totalConversionToSale : 0;
                acc.totalATV += totals.totalConversionToSale > 0 ? totals.totalAmount / totals.totalConversionToSale : 0;
                acc.totalConversionPercentage += totals.sales > 0 ? (totals.totalConversionToSale / totals.sales) * 100 : 0;

                acc.agentCount += 1;
                return acc;
            },
            {
                sales: 0,
                nonSales: 0,
                totalAmount: 0,
                totalQtySold: 0,
                totalConversionToSale: 0,
                newClientCount: 0,
                newNonBuyingCount: 0,
                existingActiveCount: 0,
                existingInactiveCount: 0,
                newClientConvertedAmount: 0,
                newNonBuyingConvertedAmount: 0,
                existingActiveConvertedAmount: 0,
                existingInactiveConvertedAmount: 0,
                totalATU: 0,
                totalATV: 0,
                totalConversionPercentage: 0,
                totalTsaResponseTime: 0,
                agentCount: 0,
            }
        );
    }, [groupedMetrics]);

    // ✅ Final Averages for % Conversion, ATU, and ATV
    return (
        <div className="overflow-x-auto max-h-screen overflow-y-auto">
            {loading ? (
                <div className="flex justify-center items-center h-full w-full">
                    <div className="flex justify-center items-center w-30 h-30">
                        <RiRefreshLine size={30} className="animate-spin" />
                    </div>
                </div>
            ) : (
                <>
                    <Export
                        groupedMetrics={groupedMetrics}
                        calculateAgentTotals={calculateAgentTotals}
                        getSalesAgentName={getSalesAgentName}
                    />

                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-100 sticky top-0">
                            <tr className="text-xs text-left whitespace-nowrap border-l-4 border-emerald-400">
                                <th className="px-6 py-4 font-semibold text-gray-700">Agent Name</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Sales</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Non-Sales</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Amount</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">QTY Sold</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Conversion to Sale</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">% Conversion Inquiry to Sales</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">New Client</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">New Non-Buying</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Existing Active</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Existing Inactive</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">New Client (Converted To Sales)</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">New Non-Buying (Converted To Sales)</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Existing Active (Converted To Sales)</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Existing Inactive (Converted To Sales)</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">TSA Response Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {Object.keys(groupedMetrics).length > 0 ? (
                                Object.keys(groupedMetrics).map((refId, index) => {
                                    const agentMetrics = groupedMetrics[refId];
                                    const totals = calculateAgentTotals(agentMetrics);

                                    // ✅ Calculate Conversion % 
                                    const conversionPercentage =
                                        totals.sales === 0
                                            ? "0.00%"
                                            : `${((totals.totalConversionToSale / totals.sales) * 100).toFixed(2)}%`;

                                    return (
                                        <tr key={index} className="border-b whitespace-nowrap">
                                            <td className="px-6 py-4 text-xs capitalize">
                                                {getSalesAgentName(agentMetrics[0].SalesAgent)}
                                            </td>
                                            <td className="px-6 py-4 text-xs">{totals.sales}</td>
                                            <td className="px-6 py-4 text-xs">{totals.nonSales}</td>
                                            <td className="px-6 py-4 text-xs">
                                                {formatAmountWithPeso(totals.totalAmount)}
                                            </td>
                                            <td className="px-6 py-4 text-xs">{totals.totalQtySold}</td>
                                            <td className="px-6 py-4 text-xs">{totals.totalConversionToSale}</td>
                                            <td className="px-6 py-4 text-xs">{conversionPercentage}</td>
                                            <td className="px-6 py-4 text-xs">{totals.newClientCount}</td>
                                            <td className="px-6 py-4 text-xs">{totals.newNonBuyingCount}</td>
                                            <td className="px-6 py-4 text-xs">{totals.existingActiveCount}</td>
                                            <td className="px-6 py-4 text-xs">{totals.existingInactiveCount}</td>
                                            <td className="px-6 py-4 text-xs">{formatAmountWithPeso(totals.newClientConvertedAmount)}</td>
                                            <td className="px-6 py-4 text-xs">{formatAmountWithPeso(totals.newNonBuyingConvertedAmount)}</td>
                                            <td className="px-6 py-4 text-xs">{formatAmountWithPeso(totals.existingActiveConvertedAmount)}</td>
                                            <td className="px-6 py-4 text-xs">{formatAmountWithPeso(totals.existingInactiveConvertedAmount)}</td>
                                            <td className="px-6 py-4 text-xs">
                                                {totals.tsaCount > 0
                                                    ? formatMinutesToHM(Math.round(totals.totalTsaResponseTime / totals.tsaCount))
                                                    : "N/A"}
                                            </td>



                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={14} className="p-2 text-center text-gray-500 text-xs">
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-200 text-xs font-bold text-left">
                                <td className="px-6 py-4 text-xs">Total</td>
                                <td className="px-6 py-4 text-xs">{totals.sales}</td>
                                <td className="px-6 py-4 text-xs">{totals.nonSales}</td>
                                <td className="px-6 py-4 text-xs">{formatAmountWithPeso(totals.totalAmount)}</td>
                                <td className="px-6 py-4 text-xs">{totals.totalQtySold}</td>
                                <td className="px-6 py-4 text-xs">{totals.totalConversionToSale}</td>
                                <td className="px-6 py-4 text-xs">
                                    {totals.sales === 0
                                        ? "0.00%"
                                        : `${((totals.totalConversionToSale / totals.sales) * 100).toFixed(2)}%`}
                                </td>
                                <td className="px-6 py-4 text-xs">{totals.newClientCount}</td>
                                <td className="px-6 py-4 text-xs">{totals.newNonBuyingCount}</td>
                                <td className="px-6 py-4 text-xs">{totals.existingActiveCount}</td>
                                <td className="px-6 py-4 text-xs">{totals.existingInactiveCount}</td>
                                <td className="px-6 py-4 text-xs">
                                    {formatAmountWithPeso(totals.newClientConvertedAmount)}
                                </td>
                                <td className="px-6 py-4 text-xs">
                                    {formatAmountWithPeso(totals.newNonBuyingConvertedAmount)}
                                </td>
                                <td className="px-6 py-4 text-xs">
                                    {formatAmountWithPeso(totals.existingActiveConvertedAmount)}
                                </td>
                                <td className="px-6 py-4 text-xs">
                                    {formatAmountWithPeso(totals.existingInactiveConvertedAmount)}
                                </td>
                                <td className="px-6 py-4 text-xs">
                                    {totals.agentCount > 0
                                        ? formatMinutesToHM(Math.round(totals.totalTsaResponseTime / totals.agentCount))
                                        : "N/A"}
                                </td>
                            </tr>
                        </tfoot>

                    </table>
                </>
            )}
        </div>
    );
};

export default AgentSalesConversion;
