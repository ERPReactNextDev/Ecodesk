import React, { useState, useEffect } from "react";
import Select from "react-select";

interface OptionType {
    value: string;
    label: string;
}

interface TicketTabProps {
    postData: any;
    handleChange: (
        e:
            | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
            | { target: { name: string; value: any } }
    ) => void;
}

const TicketTab: React.FC<TicketTabProps> = ({ postData, handleChange }) => {
    const [salesManagers, setSalesManagers] = useState<OptionType[]>([]);
    const [salesAgents, setSalesAgents] = useState<OptionType[]>([]);

    useEffect(() => {
        const fetchTSM = async () => {
            try {
                const res = await fetch(
                    "/api/tsm?Roles=Territory Sales Manager,Ecommerce Manager,HR Manager,Manager,E-Commerce Staff"
                );
                const data = await res.json();
                const options: OptionType[] = data.map((user: any) => ({
                    value: user.ReferenceID,
                    label: `${user.Firstname} ${user.Lastname}`,
                }));
                setSalesManagers(options);
            } catch (err) {
                console.error("Error fetching managers:", err);
            }
        };

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

        fetchTSM();
        fetchTSA();
    }, []);

    const handleManagerChange = (selectedOption: OptionType | null) => {
        handleChange({
            target: { name: "SalesManager", value: selectedOption ? selectedOption.value : "" },
        });
    };

    const handleAgentChange = (selectedOption: OptionType | null) => {
        handleChange({
            target: { name: "SalesAgent", value: selectedOption ? selectedOption.value : "" },
        });
        handleChange({
            target: { name: "SalesAgentName", value: selectedOption ? selectedOption.label : "" },
        });
    };

    const inputClass = "border-b p-4 text-xs w-full capitalize";
    const selectClass = "border-b p-4 text-xs w-full";

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Department */}
                <div>
                    <label className="block text-xs font-bold mb-1">Department</label>
                    <select
                        name="Department"
                        value={postData.Department || ""}
                        onChange={handleChange}
                        className={selectClass}
                    >
                        <option value="">Select Department</option>
                        <option value="Admin">Administration</option>
                        <option value="Accounting">Accounting</option>
                        <option value="E-Commerce">E-Commerce</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Procurement">Procurement</option>
                        <option value="Sales">Sales</option>
                        <option value="Warehouse Operations">Warehouse Operations</option>
                    </select>
                </div>

                {/* Manager */}
                <div>
                    <label className="block text-xs font-bold mb-1">Manager</label>
                    <Select
                        options={salesManagers}
                        value={salesManagers.find(
                            (option) => option.value === postData.SalesManager
                        ) || null}
                        onChange={handleManagerChange}
                        placeholder="Select Manager"
                        isSearchable
                        className="text-xs capitalize"
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

                {/* Remarks */}
                <div>
                    <label className="block text-xs font-bold mb-1">Remarks</label>
                    <select
                        name="Remarks"
                        value={postData.Remarks || ""}
                        onChange={handleChange}
                        className={selectClass}
                    >
                        <option value="">Select Remarks</option>
                        <option value="No Stocks / Insufficient Stocks">No Stocks / Insufficient Stocks</option>
                        <option value="Item Not Carried">Item Not Carried</option>
                        <option value="Quotation For Approval">Quotation For Approval</option>
                        <option value="Customer Requested Cancellation">Customer Requested Cancellation</option>
                        <option value="Accreditation / Partnership">Accreditation / Partnership</option>
                        <option value="For Spf">For Spf</option>
                        <option value="No Response From Client">No Response From Client</option>
                        <option value="Assisted">Assisted</option>
                        <option value="Disapproved Quotation">Disapproved Quotation</option>
                        <option value="For Site Visit">For Site Visit</option>
                        <option value="Non Standard Item">Non Standard Item</option>
                        <option value="PO Received">PO Received</option>
                        <option value="Not Converted to Sales">Not Converted to Sales</option>
                        <option value="For Occular Inspection">For Occular Inspection</option>
                        <option value="Sold">Sold</option>
                    </select>
                </div>
            </div>
            {/* Conditional Quotation Fields */}
            {postData.Remarks === "Quotation For Approval" && (
                <div className="pt-8">
                    <span className="text-xs bg-blue-200 font-bold p-2 border-2 border-dashed border-blue-500 rounded">Additional Fields</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-0 p-4 border-2 border-dashed border-blue-500 rounded-lg bg-blue-50">
                        <div>
                            <label className="block text-xs font-bold mb-1">
                                Quotation Reference Number
                            </label>
                            <input
                                name="QuotationNumber"
                                value={postData.QuotationNumber || ""}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold mb-1">Quotation Amount</label>
                            <input
                                type="number"
                                name="QuotationAmount"
                                value={postData.QuotationAmount || ""}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>
                    </div>
                </div>
            )}

            {["No Stocks / Insufficient Stocks", "Item Not Carried", "Non Standard Item"].includes(postData.Remarks) && (
                <div className="pt-8">
                    <span className="text-xs bg-blue-200 font-bold p-2 border-2 border-dashed border-blue-500 rounded">Additional Fields</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-0 p-4 border-2 border-dashed border-blue-500 rounded-lg bg-blue-50">
                        <div>
                            <label className="block text-xs font-bold mb-1">Item Code</label>
                            <input
                                name="ItemCode"
                                value={postData.ItemCode || ""}
                                onChange={handleChange}
                                className={`${inputClass} uppercase`}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold mb-1">Item Description</label>
                            <input
                                name="ItemDescription"
                                value={postData.ItemDescription || ""}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>
                    </div>
                </div>
            )}

            {postData.Remarks === "PO Received" && (
                <div className="pt-8">
                    <span className="text-xs bg-blue-200 font-bold p-2 border-2 border-dashed border-blue-500 rounded">Additional Fields</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-0 p-4 border-2 border-dashed border-blue-500 rounded-lg bg-blue-50">
                        <div>
                            <label className="block text-xs font-bold mb-1">
                                PO Number
                            </label>
                            <input
                                name="PONumber"
                                value={postData.PONumber || ""}
                                onChange={handleChange}
                                className={`${inputClass} uppercase`}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold mb-1">
                                SO Date
                            </label>
                            <input
                                type="datetime-local"
                                name="SODate"
                                value={postData.SODate || ""}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold mb-1">Payment Terms</label>
                            <select
                                name="PaymentTerms"
                                value={postData.PaymentTerms || ""}
                                onChange={handleChange}
                                className={selectClass}
                            >
                                <option value="">Select Payment Terms</option>
                                <option value="Cash">Cash</option>
                                <option value="30 Days Terms">30 Days Terms</option>
                                <option value="Bank Deposit">Bank Deposit</option>
                                <option value="Dated Check">Dated Check</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold mb-1">PO Source</label>
                            <select
                                name="POSource"
                                value={postData.POSource || ""}
                                onChange={handleChange}
                                className={selectClass}
                            >
                                <option value="">Select Source</option>
                                <option value="CS Email">CS Email</option>
                                <option value="Sales Email">Sales Email</option>
                                <option value="Sales Agent">Sales Agent</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold mb-1">
                                Payment Date
                            </label>
                            <input
                                type="datetime-local"
                                name="PaymentDate"
                                value={postData.PaymentDate || ""}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold mb-1">
                                Delivery Date
                            </label>
                            <input
                                type="datetime-local"
                                name="DeliveryDate"
                                value={postData.DeliveryDate || ""}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold mb-1">
                                Remarks
                            </label>
                            <textarea
                                name="POStatus"
                                value={postData.POStatus || ""}
                                onChange={handleChange}
                                className={inputClass}
                                rows={5}>

                            </textarea>
                        </div>
                    </div>
                </div>
            )}

            {(postData.Remarks !== "PO Received" && postData.WrapUp !== "Job Applicants") && (
                <div className="pt-8">
                    <span className="text-xs bg-blue-200 font-bold p-2 border-2 border-dashed border-blue-500 rounded">Additional Fields</span>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-0 p-4 border-2 border-dashed border-blue-500 rounded-lg bg-blue-50">
                        <div>
                            <label className="block text-xs font-bold mb-1">
                                Inquiry / Concern
                            </label>
                            <textarea
                                name="Inquiries"
                                value={postData.Inquiries || ""}
                                onChange={handleChange}
                                className={inputClass}
                                rows={5}>

                            </textarea>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketTab;
