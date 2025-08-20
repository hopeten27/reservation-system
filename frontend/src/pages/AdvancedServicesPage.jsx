import { useState, useMemo } from 'react';
import { useGetServicesQuery } from '../store/api/servicesApi';
import { useGetSlotsQuery } from '../store/api/slotsApi';
import ServiceFilters from '../components/services/ServiceFilters';
import CalendarView from '../components/services/CalendarView';
import ReviewsSection from '../components/services/ReviewsSection';
import DiscountSection from '../components/services/DiscountSection';
import WaitlistSection from '../components/services/WaitlistSection';
import RecurringBooking from '../components/services/RecurringBooking';
import Loader from '../components/shared/Loader';
import ErrorState from '../components/shared/ErrorState';

const AdvancedServicesPage = () => {
  const [filters, setFilters] = useState({});
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'calendar'
  const [appliedDiscount, setAppliedDiscount] = useState(null);

  const { data: servicesData, isLoading: servicesLoading } = useGetServicesQuery();
  const { data: slotsData, isLoading: slotsLoading } = useGetSlotsQuery();

  const services = servicesData?.data?.services || [];
  const slots = slotsData?.data?.slots || [];

  // Filter services based on applied filters
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      // Search filter
      if (filters.search && !service.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (filters.category && service.category !== filters.category) {
        return false;
      }
      
      // Price range filter
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.includes('+') 
          ? [parseInt(filters.priceRange), Infinity]
          : filters.priceRange.split('-').map(Number);
        if (service.price < min || service.price > max) {
          return false;
        }
      }
      
      // Duration filter
      if (filters.duration) {
        const duration = parseInt(filters.duration);
        if (duration === 90 && service.durationMinutes < 90) return false;
        if (duration !== 90 && service.durationMinutes !== duration) return false;
      }
      
      // Date filter - check if service has available slots on selected date
      if (filters.date) {
        const hasSlots = slots.some(slot => 
          slot.service === service._id &&
          new Date(slot.date).toISOString().split('T')[0] === filters.date &&
          slot.capacity > slot.bookedCount
        );
        if (!hasSlots) return false;
      }
      
      return true;
    });
  }, [services, filters, slots]);

  const categories = [...new Set(services.map(s => s.category))];

  const handleSlotSelect = (slot) => {
    // Navigate to booking page with selected slot
    window.location.href = `/book/${slot._id}`;
  };

  const handleApplyDiscount = async (couponCode) => {
    // Mock discount validation
    const discounts = {
      'SAVE10': { code: 'SAVE10', percentage: 10 },
      'WELCOME20': { code: 'WELCOME20', percentage: 20 },
      'FIRST15': { code: 'FIRST15', percentage: 15 }
    };
    
    if (couponCode === null) {
      setAppliedDiscount(null);
      return;
    }
    
    const discount = discounts[couponCode];
    if (!discount) {
      throw new Error('Invalid coupon code');
    }
    
    setAppliedDiscount(discount);
  };

  const handleAddReview = async (reviewData) => {
    // Mock review submission
    console.log('Adding review:', reviewData);
    // In real app, this would call an API
  };

  const handleJoinWaitlist = async (waitlistData) => {
    // Mock waitlist join
    console.log('Joining waitlist:', waitlistData);
    // In real app, this would call an API
  };

  const handleCreateRecurring = async (recurringData) => {
    // Mock recurring booking creation
    console.log('Creating recurring booking:', recurringData);
    // In real app, this would call an API
  };

  if (servicesLoading || slotsLoading) return <Loader className="py-12" />;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Services</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Grid View
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-lg ${viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Calendar View
          </button>
        </div>
      </div>

      <ServiceFilters 
        onFiltersChange={setFilters}
        categories={categories}
      />

      {viewMode === 'calendar' ? (
        <CalendarView
          slots={slots}
          onSlotSelect={handleSlotSelect}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      ) : (
        <div className="space-y-4">
          {filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No services match your filters</p>
            </div>
          ) : (
            filteredServices.map(service => (
              <div 
                key={service._id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer transition-all hover:shadow-md"
                onClick={() => window.location.href = `/services/${service._id}`}
              >
                <div className="flex">
                  {service.image?.url && (
                    <div className="w-48 h-32 flex-shrink-0">
                      <img
                        src={service.image.url}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {service.name}
                        </h3>
                        <p className="text-gray-600 mb-3">{service.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>⏱️ {service.durationMinutes} min</span>
                          <span>🏷️ {service.category}</span>
                          <span>⭐ 4.8 (24 reviews)</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-gray-900">
                          ${service.price}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Click to view details
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedServicesPage;