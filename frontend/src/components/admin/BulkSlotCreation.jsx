import { useState } from 'react';
import { useGetServicesQuery } from '../../store/api/servicesApi';
import { useBulkCreateSlotsMutation } from '../../store/api/adminApi';
import Loader from '../shared/Loader';

const BulkSlotCreation = () => {
  const [formData, setFormData] = useState({
    serviceId: '',
    startDate: '',
    endDate: '',
    timeSlots: ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'],
    capacity: 5,
    daysOfWeek: [1, 2, 3, 4, 5] // Mon-Fri
  });

  const { data: servicesData, isLoading: servicesLoading } = useGetServicesQuery();
  const [bulkCreateSlots, { isLoading }] = useBulkCreateSlotsMutation();
  const services = servicesData?.data?.services || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await bulkCreateSlots(formData).unwrap();
      setFormData({
        ...formData,
        startDate: '',
        endDate: ''
      });
    } catch (error) {
      // Error handled by toast
    }
  };

  const toggleTimeSlot = (time) => {
    setFormData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.includes(time)
        ? prev.timeSlots.filter(t => t !== time)
        : [...prev.timeSlots, time]
    }));
  };

  const toggleDayOfWeek = (day) => {
    setFormData(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day]
    }));
  };

  const timeOptions = ['09:00', '10:30', '12:00', '13:30', '14:00', '15:30', '17:00', '18:30'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (servicesLoading) return (
    <div className="bg-white rounded-xl shadow-sm p-8 animate-pulse">
      <div className="h-6 bg-gray-200 rounded mb-6 w-48"></div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-40"></div>
        <div className="grid grid-cols-4 gap-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Bulk Slot Creation</h2>
        <p className="text-gray-600 mt-1">Create multiple time slots efficiently for your services</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white text-xl">
              📅
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Create Time Slots</h3>
              <p className="text-blue-100 text-sm">Generate multiple slots across date ranges</p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-8">
            {/* Service & Settings */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h4 className="text-lg font-semibold text-gray-900">Service & Settings</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.serviceId}
                    onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    required
                  >
                    <option value="">Select a service</option>
                    {services.map(service => (
                      <option key={service._id} value={service._id}>{service.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity per Slot <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    min="1"
                    placeholder="5"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0V7a3 3 0 013-3h4a3 3 0 013 3v4" />
                </svg>
                <h4 className="text-lg font-semibold text-gray-900">Date Range</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Days of Week */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0V7a3 3 0 013-3h4a3 3 0 013 3v4" />
                </svg>
                <h4 className="text-lg font-semibold text-gray-900">Days of Week</h4>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">Select which days of the week to create slots for</p>
              <div className="flex flex-wrap gap-3">
                {dayNames.map((day, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => toggleDayOfWeek(index)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      formData.daysOfWeek.includes(index)
                        ? 'bg-blue-600 text-white shadow-md transform scale-105'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="text-lg font-semibold text-gray-900">Time Slots</h4>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">Choose the time slots to create for each selected day</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {timeOptions.map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => toggleTimeSlot(time)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      formData.timeSlots.includes(time)
                        ? 'bg-blue-600 text-white shadow-md transform scale-105'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center mb-3">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="text-lg font-semibold text-blue-900">Summary</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-800">Selected Days:</span>
                  <p className="text-blue-700">{formData.daysOfWeek.length} days</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Time Slots:</span>
                  <p className="text-blue-700">{formData.timeSlots.length} slots per day</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Capacity:</span>
                  <p className="text-blue-700">{formData.capacity} per slot</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading || !formData.serviceId || !formData.startDate || !formData.endDate}
              className="inline-flex items-center px-8 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader size="sm" className="mr-2" />
                  Creating Slots...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Bulk Slots
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkSlotCreation;