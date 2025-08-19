import React, { useState, useEffect } from "react";
import Select from "react-select";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";

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
    const [isInput, setIsInput] = useState(false);
    const [companies, setCompanies] = useState<any[]>([]);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await fetch("/api/Backend/Ticket/companies");
                const data = await res.json();
                setCompanies(data);
            } catch (err) {
                console.error("Error fetching companies:", err);
            }
        };
        fetchCompanies();
    }, []);

    const CompanyOptions = companies.map((c) => ({
        value: c.CompanyName,
        label: c.CompanyName
    }));

    const handleCompanyChange = async (selectedOption: any) => {
        const selectedCompany = selectedOption ? selectedOption.value : "";

        if (!selectedCompany) {
            // Reset all related fields kapag walang company na selected
            handleChange({ target: { name: "CompanyName", value: "" } });
            handleChange({ target: { name: "CustomerName", value: "" } });
            handleChange({ target: { name: "Gender", value: "" } });
            handleChange({ target: { name: "ContactNumber", value: "" } });
            handleChange({ target: { name: "Email", value: "" } });
            handleChange({ target: { name: "CustomerSegment", value: "" } });
            handleChange({ target: { name: "CityAddress", value: "" } });
            return;
        }

        handleChange({ target: { name: "CompanyName", value: selectedCompany } });

        try {
            const res = await fetch(
                `/api/Backend/Ticket/companies?CompanyName=${encodeURIComponent(selectedCompany)}`
            );
            if (!res.ok) return;
            const details = await res.json();

            handleChange({ target: { name: "CustomerName", value: details.CustomerName || "" } });
            handleChange({ target: { name: "Gender", value: details.Gender || "" } });
            handleChange({ target: { name: "ContactNumber", value: details.ContactNumber || "" } });
            handleChange({ target: { name: "Email", value: details.Email || "" } });
            handleChange({ target: { name: "CustomerSegment", value: details.CustomerSegment || "" } });
            handleChange({ target: { name: "CityAddress", value: details.CityAddress || "" } });
        } catch (err) {
            console.error("Error fetching company details:", err);
        }
    };

    const inputClass = "border-b p-4 text-xs w-full capitalize";
    const selectClass = "border-b p-4 text-xs w-full";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Record */}
            <div>
                <label className="block text-xs font-bold mb-1">Date Record</label>
                <input
                    type="datetime-local"
                    name="DateRecord"
                    value={postData.DateRecord || ""}
                    onChange={handleChange}
                    placeholder="Date Record"
                    className="border-b p-4 text-xs w-full"
                />
            </div>

            {/* Company Name */}
            <div>
                <label className="block text-xs font-bold mb-1">Company Name</label>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => setIsInput(!isInput)}
                        className="text-xs px-3 py-2 border rounded hover:bg-blue-500 hover:text-white transition"
                    >
                        <HiOutlineSwitchHorizontal size={15} />
                    </button>
                    {isInput ? (
                        <input
                            type="text"
                            name="CompanyName"
                            value={postData.CompanyName || ""}
                            onChange={handleChange}
                            className="border-b p-4 text-xs w-full capitalize"
                            placeholder="Enter Company Name"
                        />
                    ) : (
                        <Select
                            options={CompanyOptions}
                            onChange={handleCompanyChange}
                            className="pt-4 pb-4 text-xs w-full"
                            placeholder="Select Company"
                            isClearable
                        />
                    )}
                </div>
            </div>

            {/* Customer Name */}
            <div>
                <label className="block text-xs font-bold mb-1">Customer Name</label>
                <input
                    name="CustomerName"
                    value={postData.CustomerName || ""}
                    onChange={handleChange}
                    placeholder="Customer Name"
                    className="border-b p-4 text-xs w-full"
                />
            </div>

            {/* Contact Number */}
            <div>
                <label className="block text-xs font-bold mb-1">Contact Number</label>
                <input
                    name="ContactNumber"
                    value={postData.ContactNumber || ""}
                    onChange={handleChange}
                    placeholder="Contact Number"
                    className="border-b p-4 text-xs w-full"
                />
            </div>
        </div>
    );
};

export default AccountTab;
