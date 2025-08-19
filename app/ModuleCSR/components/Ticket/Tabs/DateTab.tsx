import React from "react";

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

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Department */}
                <div>
                    <label className="block text-xs font-bold mb-1">Date Created</label>
                    <input
                        type="datetime-local"
                        name="createdAt"
                        value={postData.createdAt || ""}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold mb-1">TSM Acknowledge Date</label>
                    <input
                        type="datetime-local"
                        name="TsmAcknowledgeDate"
                        value={postData.TsmAcknowledgeDate || ""}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold mb-1">TSA Acknowledge Date</label>
                    <input
                        type="datetime-local"
                        name="TsaAcknowledgeDate"
                        value={postData.TsaAcknowledgeDate || ""}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold mb-1">TSM Handling Time</label>
                    <input
                        type="datetime-local"
                        name="TsmHandlingTime"
                        value={postData.TsmHandlingTime || ""}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold mb-1">TSA Handling Time</label>
                    <input
                        type="datetime-local"
                        name="TsaHandlingTime"
                        value={postData.TsaHandlingTime || ""}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>
            </div>
        </div>
    );
};

export default TicketTab;
