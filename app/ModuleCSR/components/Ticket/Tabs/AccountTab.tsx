import React, { useState, useEffect } from "react";
import Select from "react-select";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";

interface AccountTabProps {
    postData: any;
    handleChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: any } }
    ) => void;
}

const AccountTab: React.FC<AccountTabProps> = ({ postData, handleChange }) => {
    const [isInput, setIsInput] = useState(false);
    const [companies, setCompanies] = useState<any[]>([]);
    const [emailError, setEmailError] = useState("");

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

    const handleEmailChange = (value: string) => {
        handleChange({ target: { name: "Email", value } });
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailError(emailRegex.test(value) || value === "" ? "" : "Invalid email address");
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ticket Ref */}
            <div>
                <label className="block text-xs font-bold mb-1">
                    Ticket Reference Number
                </label>
                <input
                    name="TicketReferenceNumber"
                    value={postData.TicketReferenceNumber || ""}
                    onChange={handleChange}
                    placeholder="Ticket Reference Number"
                    className="border-b p-4 text-xs w-full"
                    readOnly
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
                    className="border-b p-4 text-xs w-full capitalize"
                />
            </div>

            {/* Gender */}
            <div>
                <label className="block text-xs font-bold mb-1">Gender</label>
                <select
                    name="Gender"
                    value={postData.Gender || ""}
                    onChange={handleChange}
                    className="border-b p-4 text-xs w-full"
                >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
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

            {/* Email */}
            <div>
                <label className="block text-xs font-bold mb-1">Email</label>
                <input
                    type="email"
                    name="Email"
                    value={postData.Email || ""}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder="Email"
                    className="border-b p-4 text-xs w-full"
                />
                {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
            </div>

            {/* Client Segment */}
            <div>
                <label className="block text-xs font-bold mb-1">Client Segment</label>
                <Select
                    id="CustomerSegment"
                    value={
                        postData.CustomerSegment
                            ? { value: postData.CustomerSegment, label: postData.CustomerSegment }
                            : null
                    }
                    onChange={(selectedOption) =>
                        handleChange({
                            target: { name: "CustomerSegment", value: selectedOption ? selectedOption.value : "" }
                        })
                    }
                    options={[
                        { value: "Agriculture, Hunting and Forestry", label: "Agriculture, Hunting and Forestry" },
                        { value: "Fishing", label: "Fishing" },
                        { value: "Mining", label: "Mining" },
                        { value: "Manufacturing", label: "Manufacturing" },
                        { value: "Electricity, Gas and Water", label: "Electricity, Gas and Water" },
                        { value: "Construction", label: "Construction" },
                        { value: "Wholesale and Retail", label: "Wholesale and Retail" },
                        { value: "Hotels and Restaurants", label: "Hotels and Restaurants" },
                        { value: "Transport, Storage and Communication", label: "Transport, Storage and Communication" },
                        { value: "Finance and Insurance", label: "Finance and Insurance" },
                        { value: "Real State and Rentings", label: "Real State and Rentings" },
                        { value: "Education", label: "Education" },
                        { value: "Health and Social Work", label: "Health and Social Work" },
                        { value: "Personal Services", label: "Personal Services" },
                        { value: "Government Offices", label: "Government Offices" },
                        { value: "Data Center", label: "Data Center" },
                    ]}
                    className="pt-4 pb-4 text-xs w-full"
                    placeholder="Select Segment"
                    isClearable
                />
            </div>

            {/* City Address */}
            <div>
                <label className="block text-xs font-bold mb-1">City Address</label>
                <input
                    name="CityAddress"
                    value={postData.CityAddress || ""}
                    onChange={handleChange}
                    placeholder="City Address"
                    className="border-b p-4 text-xs w-full capitalize"
                />
            </div>
        </div>
    );
};

export default AccountTab;
