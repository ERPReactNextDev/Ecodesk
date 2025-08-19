import React from "react";
import { FiSearch, FiX } from "react-icons/fi";

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
}

export default function Filters({
  searchTerm,
  setSearchTerm,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: FiltersProps) {
  const handleClearAll = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center justify-between gap-4 w-full">
        {/* Search and Date Filters */}
        <div className="flex items-center gap-3 flex-1">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for Company Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-5 py-3 border border-gray-200 rounded-md text-xs shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="text-sm" />
              </button>
            )}
          </div>

          {/* Date Filters */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border px-3 py-3 rounded text-xs w-36"
              />
              {startDate && (
                <button
                  onClick={() => setStartDate("")}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                </button>
              )}
            </div>

            <span className="text-gray-400 text-xs">to</span>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border px-3 py-3 rounded text-xs w-36"
              />
              {endDate && (
                <button
                  onClick={() => setEndDate("")}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Clear All Button */}
        {(searchTerm || startDate || endDate) && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1 px-3 py-2 text-xs rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <FiX className="text-sm" />
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
