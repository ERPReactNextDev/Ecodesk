interface FilterLengthProps {
  userFilter: string;
  setUserFilter: (value: string) => void;
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
  posts: { userName: string }[]; // Adjust type based on your actual post type
}

const FilterLength: React.FC<FilterLengthProps> = ({
  userFilter,
  setUserFilter,
  itemsPerPage,
  setItemsPerPage,
  posts,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-2 items-center">
        <label className="text-xs text-gray-700">
          Filter by CSR Agent:
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="ml-2 px-2 py-1 border rounded text-xs capitalize"
          >
            <option value="">All</option>
            {[...new Set(posts.map((post) => post.userName))].map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="text-xs text-gray-700">
        Show
        <select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          className="ml-2 px-2 py-1 border rounded text-xs"
        >
          {[5, 10, 20, 50, 100, 500, 1000].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        entries
      </label>
    </div>
  );
};

export default FilterLength;
