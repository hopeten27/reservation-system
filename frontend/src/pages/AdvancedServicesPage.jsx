import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useServices } from '../hooks/useServices';
import Loader from '../components/shared/Loader';
import ErrorState from '../components/shared/ErrorState';

const AdvancedServicesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');

  const { data: servicesData, isLoading, error } = useServices();
  const services = servicesData?.data?.services || [];

  // Filter and sort services
  const filteredServices = useMemo(() => {
    let filtered = services.filter(service => {
      const matchesSearch = !searchTerm || 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || service.category === selectedCategory;
      
      const matchesPrice = !priceRange || (() => {
        if (priceRange === '0-50') return service.price <= 50;
        if (priceRange === '50-100') return service.price > 50 && service.price <= 100;
        if (priceRange === '100+') return service.price > 100;
        return true;
      })();
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
    
    // Sort services
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'duration': return a.durationMinutes - b.durationMinutes;
        default: return a.name.localeCompare(b.name);
      }
    });
    
    return filtered;
  }, [services, searchTerm, selectedCategory, priceRange, sortBy]);

  const categories = [...new Set(services.map(s => s.category))];

  if (isLoading) return <Loader className="py-12" />;
  if (error) return <ErrorState message="Failed to load services" />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover and book professional services tailored to your needs
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Filter Services</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Any Price</option>
                  <option value="0-50">$0 - $50</option>
                  <option value="50-100">$50 - $100</option>
                  <option value="100+">$100+</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                  <option value="duration">Duration</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setPriceRange('');
                  setSortBy('name');
                }}
                className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 border-2 border-gray-200 rounded-lg hover:bg-gray-200 hover:border-gray-300 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* View Toggle & Results Count */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-600">
                {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Services Grid/List */}
            {filteredServices.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 9.34c-.665-.995-1.824-2.34-3-2.34s-2.335 1.345-3 2.34m12 6.66a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-4'
              }>
                {filteredServices.map(service => (
                  viewMode === 'grid' ? (
                    <Link
                      key={service._id}
                      to={`/services/${service._id}`}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                    >
                      {service.image?.url && (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={service.image.url}
                            alt={service.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {service.name}
                          </h3>
                          <span className="text-xl font-bold text-blue-600">
                            ${service.price}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {service.description}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{service.durationMinutes} min</span>
                          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                            {service.category}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <Link
                      key={service._id}
                      to={`/services/${service._id}`}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex group"
                    >
                      {service.image?.url && (
                        <div className="w-48 h-32 flex-shrink-0">
                          <img
                            src={service.image.url}
                            alt={service.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                              {service.name}
                            </h3>
                            <p className="text-gray-600 mb-3">{service.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>⏱️ {service.durationMinutes} min</span>
                              <span>🏷️ {service.category}</span>
                            </div>
                          </div>
                          <div className="text-right ml-6">
                            <div className="text-2xl font-bold text-blue-600">
                              ${service.price}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              View Details
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedServicesPage;