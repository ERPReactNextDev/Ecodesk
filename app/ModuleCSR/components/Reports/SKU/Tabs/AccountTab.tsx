import React, { useState, useEffect } from "react";
import Select from "react-select";

interface OptionType {
    value: string;
    label: string;
}

interface AccountTabProps {
    postData: any;
    handleChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: any } }
    ) => void;
}

const AccountTab: React.FC<AccountTabProps> = ({ postData, handleChange }) => {
    const [salesAgents, setSalesAgents] = useState<OptionType[]>([]);

    useEffect(() => {
        const fetchTSA = async () => {
            try {
                const res = await fetch(
                    "/api/tsa?Roles=Territory Sales Associate,E-Commerce Staff"
                );
                const data = await res.json();
                const options: OptionType[] = data.map((user: any) => ({
                    value: user.ReferenceID,
                    label: `${user.Firstname} ${user.Lastname}`,
                }));
                setSalesAgents(options);
            } catch (err) {
                console.error("Error fetching agents:", err);
            }
        };

        fetchTSA();
    }, []);

    const handleAgentChange = (selectedOption: OptionType | null) => {
        handleChange({
            target: { name: "SalesAgent", value: selectedOption ? selectedOption.value : "" },
        });
        handleChange({
            target: { name: "SalesAgentName", value: selectedOption ? selectedOption.label : "" },
        });
    };

    const inputClass = "border-b p-4 text-xs w-full capitalize";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Name */}
            <div>
                <label className="block text-xs font-bold mb-1">
                    Company Name
                </label>
                <input
                    name="CompanyName"
                    value={postData.CompanyName || ""}
                    onChange={handleChange}
                    placeholder="CompanyName"
                    className="border-b p-4 text-xs w-full"
                    readOnly
                />
            </div>

            {/* Item Category */}
            <div>
                <label className="block text-xs font-bold mb-1">Item Category</label>
                <select
                    name="Remarks"
                    value={postData.Remarks || ""}
                    onChange={handleChange}
                    className="border-b p-4 text-xs w-full capitalize"
                >
                    <option value="">Select Category</option>
                    <option value="No Stocks / Insufficient Stocks">No Stocks / Insufficient Stocks</option>
                    <option value="Non Standard Item">Non Standard Item</option>
                    <option value="Item Not Carried">Item Not Carried</option>
                </select>
            </div>

            {/* ItemCode */}
            <div>
                <label className="block text-xs font-bold mb-1">Item Code</label>
                <input
                    name="ItemCode"
                    value={postData.ItemCode || ""}
                    onChange={handleChange}
                    placeholder="Item Code"
                    className="border-b p-4 text-xs w-full"
                />
            </div>

            {/* Item Description */}
            <div>
                <label className="block text-xs font-bold mb-1">Quantity</label>
                <input
                    type="number"
                    name="Quantity"
                    value={postData.Quantity || ""}
                    onChange={handleChange}
                    placeholder="Quantity"
                    className="border-b p-4 text-xs w-full"
                />
            </div>

            {/* Item Description */}
            <div>
                <label className="block text-xs font-bold mb-1">Item Description</label>
                <textarea
                    name="ItemDescription"
                    value={postData.ItemDescription || ""}
                    onChange={handleChange}
                    className="border-b p-4 text-xs w-full"
                />
            </div>

            {/* Agent */}
            <div>
                <label className="block text-xs font-bold mb-1">Agent</label>
                <Select
                    options={salesAgents}
                    value={salesAgents.find(
                        (option) => option.value === postData.SalesAgent
                    ) || null}
                    onChange={handleAgentChange}
                    placeholder="Select Agent"
                    isSearchable
                    className="text-xs capitalize"
                />
                <input
                    type="hidden"
                    name="SalesAgentName"
                    value={postData.SalesAgentName || ""}
                    onChange={handleChange}
                    className={inputClass}
                />
            </div>

            {/* Inquiries */}
            <div>
                <label className="block text-xs font-bold mb-1">Inquiries</label>
                <textarea
                    name="Inquiries"
                    value={postData.Inquiries || ""}
                    onChange={handleChange}
                    className="border-b p-4 text-xs w-full"
                />
            </div>

        </div>
    );
};

export default AccountTab;
