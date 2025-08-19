import React from "react";
import { FiX } from "react-icons/fi";

interface FiltersProps {
  filters: Record<string, string>;
  currentPosts: Record<string, any>[];
  handleFilterChange: (key: string, value: string) => void;
}

const Filters: React.FC<FiltersProps> = ({ filters, currentPosts, handleFilterChange }) => {
  const handleClearAll = () => {
    Object.keys(filters).forEach((key) => handleFilterChange(key, ""));
  };

  return (
    <div className="p-4 bg-gray-50 border-b">
      {/* Top Row: Clear All button */}
      <div className="flex justify-end mb-3">
        {Object.values(filters).some((val) => val) && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <FiX className="text-sm" />
            Clear All
          </button>
        )}
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {Object.keys(filters).map((key) => {
          // Get unique non-empty values for this filter key
          const uniqueValues = Array.from(
            new Set(
              currentPosts
                .map((post) => (post as any)[key])
                .filter((val) => val !== null && val !== undefined && val !== "")
            )
          );

          return (
            <div key={key} className="flex flex-col">
              <label className="text-xs text-gray-600 capitalize mb-1">{key}</label>
              <select
                value={filters[key] || ""}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                className="border rounded px-3 py-2 text-xs"
              >
                <option value="">All</option>
                {uniqueValues.map((val) => (
                  <option key={val} value={val} className="text-xs">
                    {val}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Filters;
