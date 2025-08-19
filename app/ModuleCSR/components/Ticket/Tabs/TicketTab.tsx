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
    const inputClass = "border-b p-4 text-xs w-full";
    const selectClass = "border-b p-4 text-xs w-full";

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

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Traffic */}
                <div>
                    <label className="block text-xs font-bold mb-1">Traffic</label>
                    <select
                        name="Traffic"
                        value={postData.Traffic || ""}
                        onChange={handleChange}
                        className={selectClass}
                    >
                        <option value="">Select Traffic</option>
                        <option value="Sales">Sales</option>
                        <option value="Non-Sales">Non-Sales</option>
                    </select>
                </div>

                {/* Ticket Received */}
                <div>
                    <label className="block text-xs font-bold mb-1">Ticket Received</label>
                    <input
                        type="datetime-local"
                        name="TicketReceived"
                        value={postData.TicketReceived || ""}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                {/* Ticket Endorsed */}
                <div>
                    <label className="block text-xs font-bold mb-1">Ticket Endorsed</label>
                    <input
                        type="datetime-local"
                        name="TicketEndorsed"
                        value={postData.TicketEndorsed || ""}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                {/* Channel */}
                <div>
                    <label className="block text-xs font-bold mb-1">Channel</label>
                    <select
                        name="Channel"
                        value={postData.Channel || ""}
                        onChange={handleChange}
                        className={selectClass}
                    >
                        <option value="">Select Channel</option>
                        <option value="Google Maps">Google Maps</option>
                        <option value="Website">Website</option>
                        <option value="FB Main">FB Main</option>
                        <option value="FB ES Home">FB ES Home</option>
                        <option value="Viber">Viber</option>
                        <option value="Text Message">Text Message</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Voice Call">Voice Call</option>
                        <option value="Email">Email</option>
                        <option value="Whatsapp">Whatsapp</option>
                        <option value="Shopify">Shopify</option>
                    </select>
                </div>

                {/* Wrap-up */}
                <div>
                    <label className="block text-xs font-bold mb-1">Wrap-up</label>
                    <select
                        name="WrapUp"
                        value={postData.WrapUp || ""}
                        onChange={handleChange}
                        className={selectClass}
                    >
                        <option value="">Select Wrap Up</option>
                        <option value="Customer Order">Customer Order</option>
                        <option value="Customer Inquiry Sales">Customer Inquiry Sales</option>
                        <option value="Customer Inquiry Non-Sales">Customer Inquiry Non-Sales</option>
                        <option value="Follow Up Sales">Follow Up Sales</option>
                        <option value="After Sales">After Sales</option>
                        <option value="Customer Complaint">Customer Complaint</option>
                        <option value="Customer Feedback/Recommendation">Customer Feedback/Recommendation</option>
                        <option value="Job Applicants">Job Applicants</option>
                        <option value="Supplier/Vendor Product Offer">Supplier/Vendor Product Offer</option>
                        <option value="Follow Up Non-Sales">Follow Up Non-Sales</option>
                        <option value="Internal Whistle Blower">Internal Whistle Blower</option>
                        <option value="Threats/Extortion/Intimidation">Threats/Extortion/Intimidation</option>
                        <option value="Supplier Accreditation Request">Supplier Accreditation Request</option>
                        <option value="Internal Concern">Internal Concern</option>
                        <option value="Others">Others</option>
                    </select>
                </div>

                {/* Source */}
                <div>
                    <label className="block text-xs font-bold mb-1">Source</label>
                    <select
                        name="Source"
                        value={postData.Source || ""}
                        onChange={handleChange}
                        className={selectClass}
                    >
                        <option value="">Select Source</option>
                        <option value="FB Ads">FB Ads</option>
                        <option value="Viber Community / Viber">Viber Community / Viber</option>
                        <option value="Whatsapp Community / Whatsapp">Whatsapp Community / Whatsapp</option>
                        <option value="SMS">SMS</option>
                        <option value="Website">Website</option>
                        <option value="Word of Mouth">Word of Mouth</option>
                        <option value="Quotation Docs">Quotation Docs</option>
                        <option value="Google Search">Google Search</option>
                        <option value="Site Visit">Site Visit</option>
                        <option value="Agent Call">Agent Call</option>
                        <option value="Catalogue">Catalogue</option>
                        <option value="Shopee">Shopee</option>
                        <option value="Lazada">Lazada</option>
                        <option value="Tiktok">Tiktok</option>
                        <option value="WorldBex">Worldbex</option>
                        <option value="PhilConstruct">PhilConstruct</option>
                        <option value="Conex">Conex</option>
                        <option value="Product Demo">Product Demo</option>
                    </select>
                </div>

                {/* Customer Type */}
                <div>
                    <label className="block text-xs font-bold mb-1">Customer Type</label>
                    <select
                        name="CustomerType"
                        value={postData.CustomerType || ""}
                        onChange={handleChange}
                        className={selectClass}
                    >
                        <option value="">Select Type</option>
                        <option value="B2B">B2B</option>
                        <option value="B2C">B2C</option>
                        <option value="B2G">B2G</option>
                        <option value="Gentrade">Gentrade</option>
                        <option value="Modern Trade">Modern Trade</option>
                    </select>
                </div>

                {/* Customer Status */}
                <div>
                    <label className="block text-xs font-bold mb-1">Customer Status</label>
                    <select
                        name="CustomerStatus"
                        value={postData.CustomerStatus || ""}
                        onChange={handleChange}
                        className={selectClass}
                    >
                        <option value="">Select Customer Status</option>
                        <option value="New Client">New Client</option>
                        <option value="New Non-Buying">New Non-Buying</option>
                        <option value="Existing Active">Existing Active</option>
                        <option value="Existing Inactive">Existing Inactive</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold mb-1">Ticket Status</label>
                    <select
                        name="Status"
                        value={postData.Status || ""}
                        onChange={handleChange}
                        className={selectClass}
                    >
                        <option value="">Select Ticket Status</option>
                        <option value="Closed">Closed</option>
                        <option value="Endorsed">Endorsed</option>
                        <option value="Converted Into Sales">Converted Into Sales</option>
                    </select>
                </div>
            </div>

            {/* Conditional fields */}
            {postData.Status === "Converted Into Sales" && (
                <div className="pt-8">
                    <span className="text-xs bg-blue-200 font-bold p-2 border-2 border-dashed border-blue-500 rounded">Additional Fields</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-0 p-4 border-2 border-dashed border-blue-500 rounded-lg bg-blue-50">
                        <div>
                            <label className="block text-xs font-bold mb-1 text-red-500">SO Number *</label>
                            <input
                                name="SONumber"
                                value={postData.SONumber || ""}
                                onChange={handleChange}
                                className={`${inputClass} uppercase`}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold mb-1 text-red-500">SO Amount *</label>
                            <input
                                type="number"
                                name="SOAmount"
                                value={postData.SOAmount || ""}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold mb-1 text-red-500">Quantity *</label>
                            <input
                                type="number"
                                name="Quantity"
                                value={postData.Quantity || ""}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>
                    </div>
                </div>
            )}

            {postData.WrapUp === "Job Applicants" && (
                <div className="pt-8">
                    <span className="text-xs bg-blue-200 font-bold p-2 border-2 border-dashed border-blue-500 rounded">Additional Fields</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-0 p-4 border-2 border-dashed border-blue-500 rounded-lg bg-blue-50">
                        <div>
                            <label className="block text-xs font-bold mb-1">Job Applicants</label>
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketTab;
