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
    const [emailError, setEmailError] = useState("");

    const handleEmailChange = (value: string) => {
        handleChange({ target: { name: "Email", value } });
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailError(emailRegex.test(value) || value === "" ? "" : "Invalid email address");
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ticket Ref */}
            
            {/* Company Name */}
            <div>
                <label className="block text-xs font-bold mb-1">Company Name</label>
                <input
                    name="CompanyName"
                    value={postData.CompanyName || ""}
                    onChange={handleChange}
                    placeholder="Customer Name"
                    className="border-b p-4 text-xs w-full capitalize"
                />
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
                <textarea
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
