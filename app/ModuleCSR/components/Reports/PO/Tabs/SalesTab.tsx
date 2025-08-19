import React, { useState, useEffect } from "react";

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

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* PO Number */}
                <div>
                    <label className="block text-xs font-bold mb-1">PO Number</label>
                    <input
                        name="PONumber"
                        value={postData.PONumber || ""}
                        onChange={handleChange}
                        className="border-b p-4 text-xs w-full uppercase"
                    />
                </div>

                {/* PO Amount */}
                <div>
                    <label className="block text-xs font-bold mb-1">PO Amount</label>
                    <input
                        type="number"
                        name="POAmount"
                        value={postData.POAmount || ""}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                {/* PO Status */}
                <div>
                    <label className="block text-xs font-bold mb-1">PO Remarks</label>
                    <textarea
                        name="PORemarks"
                        value={postData.PORemarks || ""}
                        onChange={handleChange}
                        className="border-b p-4 text-xs w-full capitalize"
                    />
                </div>

                {/* SO Number */}
                <div>
                    <label className="block text-xs font-bold mb-1">SO Number</label>
                    <input
                        name="SONumber"
                        value={postData.SONumber || ""}
                        onChange={handleChange}
                        className="border-b p-4 text-xs w-full uppercase"
                    />
                </div>

                {/* SO Date */}
                <div>
                    <label className="block text-xs font-bold mb-1">SO Date</label>
                    <input
                        type="datetime-local"
                        name="SODate"
                        value={postData.SODate || ""}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                {/* Payment Terms */}
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

                {/* Payment Date */}
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

                {/* Delivery Date */}
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
            </div>

        </div>
    );
};

export default SalesTab;
