import React, { useState, useEffect } from 'react';
import Select from 'react-select';

interface FormFieldsProps {
    userName: string; setuserName: (value: string) => void;
    UserID: string; setUserID: (value: string) => void;
    CompanyName: string; setCompanyName: (value: string) => void;
    Remarks: string; setRemarks: (value: string) => void;
    ItemCode: string; setItemCode: (value: string) => void;
    ItemDescription: string; setItemDescription: (value: string) => void;
    QtySold: string; setQtySold: (value: string) => void;
    SalesAgent: string; setSalesAgent: (value: string) => void;
    SalesAgentName: string; setSalesAgentName: (value: string) => void;
    editPost?: any;
}

type OptionType = {
    value: string;
    label: string;
};

const SkuFormFields: React.FC<FormFieldsProps> = ({
    userName, setuserName,
    UserID, setUserID,
    CompanyName, setCompanyName,
    Remarks, setRemarks,
    ItemCode, setItemCode,
    ItemDescription, setItemDescription,
    QtySold, setQtySold,
    SalesAgent, setSalesAgent,
    SalesAgentName, setSalesAgentName,
    editPost
}) => {

    const [salesManagers, setSalesManagers] = useState<OptionType[]>([]);
    const [salesAgents, setSalesAgents] = useState<OptionType[]>([]);

    useEffect(() => {
        const fetchTSM = async () => {
            try {
                const response = await fetch("/api/tsm?Roles=Territory Sales Manager,Ecommerce Manager, HR Manager, Manager, E-Commerce Staff");
                if (!response.ok) throw new Error("Failed to fetch managers");

                const data = await response.json();

                const options: OptionType[] = data.map((user: any) => ({
                    value: user.ReferenceID,
                    label: `${user.Firstname} ${user.Lastname}`,
                }));
                setSalesManagers(options);
            } catch (error) {
                console.error("Error fetching managers:", error);
            }
        };

        const fetchTSA = async () => {
            try {
                const response = await fetch("/api/tsa?Roles=Territory Sales Associate,E-Commerce Staff");
                if (!response.ok) throw new Error("Failed to fetch agents");

                const data = await response.json();

                const options: OptionType[] = data.map((user: any) => ({
                    value: user.ReferenceID,
                    label: `${user.Firstname} ${user.Lastname}`,
                }));
                setSalesAgents(options);
            } catch (error) {
                console.error("Error fetching agents:", error);
            }
        };

        fetchTSM();
        fetchTSA();
    }, []);

    return (
        <>
            <div className="mb-4">
                <input type="hidden" id="Username" value={userName} onChange={(e) => setuserName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" disabled />
                <input type="hidden" id="UserID" value={UserID} onChange={(e) => setUserID(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" disabled />
            </div>
            <div className="mb-4">
                <label className="block text-xs font-bold mb-2" htmlFor="CompanyName">Company Name</label>
                <input type="text" id="CompanyName" value={CompanyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" readOnly />
            </div>
            <div className="mb-4">
                <label className="block text-xs font-bold mb-2" htmlFor="Remarks">Item Category</label>
                <select id="Remarks" value={Remarks} onChange={(e) => setRemarks(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs">
                    <option value="No Stocks / Insufficient Stocks">No Stocks / Insufficient Stocks</option>
                    <option value="Item Not Carried">Item Not Carried</option>
                    <option value="Non Standard Item">Non Standard Item</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-xs font-bold mb-2" htmlFor="ContactNumber">ItemCode</label>
                <input type="text" id="ItemCode" value={ItemCode} onChange={(e) => setItemCode(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
            </div>
            <div className="mb-4">
                <label className="block text-xs font-bold mb-2" htmlFor="ItemDescription">Item Description</label>
                <textarea id="ItemDescription" value={ItemDescription} onChange={(e) => setItemDescription(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" rows={4}></textarea>
            </div>
            <div className="mb-4">
                <label className="block text-xs font-bold mb-2" htmlFor="QtySold">QTY</label>
                <input type="number" id="QtySold" value={QtySold} onChange={(e) => setQtySold(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
            </div>
            <div className="mb-4">
                <label className="block text-xs font-bold mb-2" htmlFor="SalesAgent">Sales Agent</label>
                <Select
                    options={salesAgents}
                    value={salesAgents.find((option) => option.value === SalesAgent) || null}
                    onChange={(selected: OptionType | null) => {
                        setSalesAgent(selected?.value || ""); // Set the selected agent's ReferenceID
                        // Find the full name of the selected agent and update the SalesAgentName field
                        const selectedAgent = salesAgents.find((agent) => agent.value === selected?.value);
                        setSalesAgentName(selectedAgent ? `${selectedAgent.label}` : ""); // Update SalesAgentName
                    }}
                    placeholder="Select Agent"
                    isSearchable
                    className="text-xs capitalize"
                />
            </div>
        </>
    );
};

export default SkuFormFields;
