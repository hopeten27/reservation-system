const AdminTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-2">
      <nav className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AdminTabs;