import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useService } from '../hooks/useServices';
import { useGetSlotsByServiceQuery } from '../store/api/slotsApi';
import { useGetBookingsQuery } from '../store/api/bookingsApi';
import Loader from '../components/shared/Loader';
import ErrorState from '../components/shared/ErrorState';
import DiscountSection from '../components/services/DiscountSection';
import RecurringBooking from '../components/services/RecurringBooking';
import WaitlistSection from '../components/services/WaitlistSection';
import ReviewsSection from '../components/services/ReviewsSection';

const ServiceDetailsPage = () => {
  const { id } = useParams();
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { data: serviceData, isLoading, error } = useService(id);
  const { data: slotsData } = useGetSlotsByServiceQuery(id);
  const { data: bookingsData } = useGetBookingsQuery(undefined, { skip: !isAuthenticated });
  
  const service = serviceData?.data?.service;
  const slots = slotsData?.data?.slots || [];
  const userBookings = bookingsData?.data?.bookings || [];
  
  // Get booked slot IDs for this user
  const bookedSlotIds = userBookings
    .filter(booking => ['confirmed', 'pending'].includes(booking.status))
    .map(booking => booking.slot?._id)
    .filter(Boolean);
  
  const handleDiscountApplied = (discount) => {
    setAppliedDiscount(discount);
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
            <div className="flex flex-col lg:flex-row">
              <div className="flex-1 p-8">
                <div className="h-8 bg-gray-200 rounded mb-3 w-64"></div>
                <div className="h-6 bg-gray-200 rounded mb-6 w-full"></div>
                <div className="flex gap-4 mb-6">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-20 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="lg:w-96 lg:flex-shrink-0">
                <div className="h-64 lg:h-full bg-gray-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-8 animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-8 w-48"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-lg p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2 w-32"></div>
                    <div className="h-8 bg-gray-200 rounded mb-4 w-20"></div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4 w-32"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  if (error) return <ErrorState message="Service not found" />;
  if (!service) return <ErrorState message="Service not found" />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Content Section */}
              <div className="flex-1 p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{service.name}</h1>
                <p className="text-lg text-gray-600 mb-6">{service.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    service.isActive 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {service.isActive ? 'Available' : 'Unavailable'}
                  </span>
                  <span className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {service.durationMinutes} minutes
                  </span>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 inline-block">
                  <div className="text-3xl font-bold text-gray-900">
                    ${appliedDiscount 
                      ? appliedDiscount.finalAmount.toFixed(2)
                      : service.price
                    }
                    {appliedDiscount && (
                      <span className="text-lg text-gray-500 line-through ml-2">${service.price}</span>
                    )}
                  </div>
                  <div className="text-gray-500 text-sm mt-1">per session</div>
                </div>
              </div>
              
              {/* Image Section - Only show if service has images */}
              {(service.image?.url || (service.additionalImages && service.additionalImages.length > 0)) && (
                <div className="lg:w-[500px] lg:flex-shrink-0">
                <div className="space-y-4">
                  {/* Main Image */}
                  {service.image?.url && (
                    <div className="h-64 relative overflow-hidden rounded-2xl">
                      <img
                        src={service.image.url}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  )}
                  
                  {/* Additional Images Gallery */}
                  {service.additionalImages && service.additionalImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {service.additionalImages.slice(0, 6).map((image, index) => (
                        <div key={index} className="group relative overflow-hidden rounded-lg aspect-square">
                          <img
                            src={image.url}
                            alt={`${service.name} - ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                          {index === 5 && service.additionalImages.length > 6 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                +{service.additionalImages.length - 5}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {/* Available Slots */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Available Time Slots</h2>
                  <p className="text-gray-600 mt-1">Select your preferred appointment time</p>
                </div>
                <div className="text-sm text-gray-500">
                  {slots.length} slot{slots.length !== 1 ? 's' : ''} available
                </div>
              </div>
              
              {slots.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0V7a3 3 0 013-3h4a3 3 0 013 3v4" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No available slots</h3>
                  <p className="text-gray-500">Check back later for new appointment times</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {slots.map((slot) => {
                    const isBooked = bookedSlotIds.includes(slot._id);
                    const isFull = slot.bookedCount >= slot.capacity;
                    const isAvailable = slot.status === 'open' && !isFull && !isBooked;
                    
                    return (
                      <div key={slot._id} className={`relative border-2 rounded-lg p-6 transition-all duration-200 ${
                        isBooked 
                          ? 'border-green-200 bg-green-50'
                          : isAvailable 
                            ? 'border-gray-200 hover:border-blue-300 hover:shadow-md cursor-pointer'
                            : 'border-gray-200 bg-gray-50'
                      }`}>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="text-lg font-semibold text-gray-900">
                              {new Date(slot.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="text-2xl font-bold text-gray-900 mt-1">
                              {new Date(slot.date).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-medium ${
                              slot.capacity - slot.bookedCount > 3 
                                ? 'text-green-600' 
                                : slot.capacity - slot.bookedCount > 0 
                                  ? 'text-yellow-600' 
                                  : 'text-red-600'
                            }`}>
                              {slot.capacity - slot.bookedCount} spots left
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              of {slot.capacity} total
                            </div>
                          </div>
                        </div>
                        
                        {isBooked ? (
                          <button
                            disabled
                            className="w-full bg-green-100 text-green-800 py-3 px-4 rounded-lg font-medium cursor-not-allowed flex items-center justify-center border border-green-200"
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Already Booked
                          </button>
                        ) : isAvailable ? (
                          <Link
                            to={`/book/${slot._id}`}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors text-center block"
                          >
                            Book This Slot
                          </Link>
                        ) : (
                          <button
                            disabled
                            className="w-full bg-gray-100 text-gray-500 py-3 px-4 rounded-lg font-medium cursor-not-allowed border border-gray-200"
                          >
                            {isFull ? 'Fully Booked' : 'Unavailable'}
                          </button>
                        )}
                      </div>
                    );
                  })}
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
    </div>
  );
};

export default ServiceDetailsPage;