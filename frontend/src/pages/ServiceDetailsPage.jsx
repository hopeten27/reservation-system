import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetServiceQuery } from '../store/api/servicesApi';
import { useGetSlotsByServiceQuery } from '../store/api/slotsApi';
import Loader from '../components/shared/Loader';
import ErrorState from '../components/shared/ErrorState';
import DiscountSection from '../components/services/DiscountSection';
import RecurringBooking from '../components/services/RecurringBooking';
import WaitlistSection from '../components/services/WaitlistSection';
import ReviewsSection from '../components/services/ReviewsSection';

const ServiceDetailsPage = () => {
  const { id } = useParams();
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const { data: serviceData, isLoading, error } = useGetServiceQuery(id);
  const { data: slotsData } = useGetSlotsByServiceQuery(id);
  
  const service = serviceData?.data?.service;
  const slots = slotsData?.data?.slots || [];
  
  const handleDiscountApplied = (discount) => {
    setAppliedDiscount(discount);
  };

  if (isLoading) return <Loader className="py-12" />;
  if (error) return <ErrorState message="Service not found" />;
  if (!service) return <ErrorState message="Service not found" />;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
      {/* Service Header */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.name}</h1>
            <p className="text-gray-600 text-lg">{service.description}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary-600">
              ${appliedDiscount 
                ? appliedDiscount.finalAmount.toFixed(2)
                : service.price
              }
              {appliedDiscount && (
                <span className="text-lg text-gray-500 line-through ml-2">${service.price}</span>
              )}
            </div>
            <div className="text-gray-500">{service.durationMinutes} minutes</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            service.isActive 
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {service.isActive ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>

      {/* Available Slots */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Time Slots</h2>
        
        {slots.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No available slots at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {slots.map((slot) => (
              <div key={slot._id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                <div className="text-lg font-semibold text-gray-900">
                  {new Date(slot.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                <div className="text-gray-600">
                  {new Date(slot.date).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  {slot.capacity - slot.bookedCount} spots available
                </div>
                
                {slot.status === 'open' && slot.bookedCount < slot.capacity ? (
                  <Link
                    to={`/book/${slot._id}`}
                    className="mt-3 w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md font-medium transition-colors text-center block"
                  >
                    Book Now
                  </Link>
                ) : (
                  <button
                    disabled
                    className="mt-3 w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md font-medium cursor-not-allowed"
                  >
                    Fully Booked
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

          {/* Reviews Section */}
          <ReviewsSection
            serviceId={service._id}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <DiscountSection
            serviceId={service._id}
            originalPrice={service.price}
            onDiscountApplied={handleDiscountApplied}
          />

          <RecurringBooking
            serviceId={service._id}
            availableSlots={slots}
          />

          <WaitlistSection
            serviceId={service._id}
            availableSlots={slots}
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;