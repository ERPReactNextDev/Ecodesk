import React, { useState, useEffect } from "react";
import Select from "react-select";

interface OptionType {
    value: string;
    label: string;
}

interface SalesTabProps {
    postData: any;
    handleChange: (
        e:
            | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
            | { target: { name: string; value: any } }
    ) => void;
}

const SalesTab: React.FC<SalesTabProps> = ({ postData, handleChange }) => {
    const inputClass = "border-b p-4 text-xs w-full capitalize";
    const selectClass = "border-b p-4 text-xs w-full";
    const [salesAgents, setSalesAgents] = useState<OptionType[]>([]);
    const [salesManagers, setSalesManagers] = useState<OptionType[]>([]);

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

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Ticket Type */}
                <div>
                    <label className="block text-xs font-bold mb-1">Ticket Type</label>
                    <select
                        name="TicketType"
                        value={postData.TicketType || ""}
                        onChange={handleChange}
                        className={selectClass}
                    >
                        <option value="">Select Type</option>
                        <option value="After Sales">After Sales</option>
                        <option value="Follow Up">Follow Up</option>
                        <option value="Complaint">Complaint</option>
                        <option value="Technical">Technical</option>
                        <option value="Pricing">Pricing</option>
                        <option value="Documentation">Documentation</option>
                        <option value="Product">Product</option>
                    </select>
                </div>

                {/* Ticket Concern */}
                <div>
                    <label className="block text-xs font-bold mb-1">Ticket Concern</label>
                    <select
                        name="TicketConcern"
                        value={postData.TicketConcern || ""}
                        onChange={handleChange}
                        className={selectClass}
                    >
                        <option value="">Select Ticket Concern</option>
                        <option value="Delivery / Pickup">Delivery / Pickup</option>
                        <option value="Quotation">Quotation</option>
                        <option value="Documents">Documents</option>
                        <option value="Return Call">Return Call</option>
                        <option value="Payment">Payment</option>
                        <option value="Refund">Refund</option>
                        <option value="Replacement">Replacement</option>
                        <option value="Site Visit">Site Visit</option>
                        <option value="TDS">TDS</option>
                        <option value="Shop Drawing">Shop Drawing</option>
                        <option value="Dialux">Dialux</option>
                        <option value="Product Testing">Product Testing</option>
                        <option value="SPF">SPF</option>
                        <option value="Replacement To Supplier">Replacement To Supplier</option>
                        <option value="Accreditation Request">Accreditation Request</option>
                        <option value="Job Request">Job Request</option>
                        <option value="Product Recommendation">Product Recommendation</option>
                        <option value="Payment Terms">Payment Terms</option>
                        <option value="Wrong Order">Wrong Order</option>
                        <option value="Repair">Repair</option>
                        <option value="Product Certificate">Product Certificate</option>
                    </select>
                </div>

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
                        <option value="Accounting">Accounting</option>
                        <option value="E-Commerce">E-Commerce</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Procurement">Procurement</option>
                        <option value="Sales">Sales</option>
                        <option value="Warehouse">Warehouse Operations</option>
                    </select>
                </div>

                {/* Endorsed Date */}
                <div>
                    <label className="block text-xs font-bold mb-1">Endorsed Date</label>
                    <input
                        type="datetime-local"
                        name="EndorsedDate"
                        value={postData.EndorsedDate || ""}
                        onChange={handleChange}
                        placeholder="Endorsed Date"
                        className="border-b p-4 text-xs w-full"
                    />
                </div>

                {/* Closed Date */}
                <div>
                    <label className="block text-xs font-bold mb-1">Closed Date</label>
                    <input
                        type="datetime-local"
                        name="ClosedDate"
                        value={postData.ClosedDate || ""}
                        onChange={handleChange}
                        placeholder="Closed Date"
                        className="border-b p-4 text-xs w-full"
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="block text-xs font-bold mb-1">Status</label>
                    <select
                        name="Status"
                        value={postData.Status || ""}
                        onChange={handleChange}
                        className={selectClass}
                    >
                        <option value="">Select Status</option>
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>

                {/* Sales Agent */}
                <div>
                    <label className="block text-xs font-bold mb-1">Sales Agent</label>
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

                {/* Remarks */}
                <div>
                    <label className="block text-xs font-bold mb-1">Remarks</label>
                    <textarea
                        name="Remarks"
                        value={postData.Remarks || ""}
                        onChange={handleChange}
                        className={selectClass}
                        rows={3}
                    ></textarea>
                </div>

                {/* Nature of Concern */}
                <div>
                    <label className="block text-xs font-bold mb-1">Nature of Concern</label>
                    <textarea
                        name="NatureConcern"
                        value={postData.NatureConcern || ""}
                        onChange={handleChange}
                        className={selectClass}
                        rows={3}
                    ></textarea>
                </div>
            </div>

        </div>
    );
};

export default SalesTab;
