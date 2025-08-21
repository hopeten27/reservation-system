import { useState } from 'react';
import { useGetServicesQuery } from '../../store/api/servicesApi';
import { useBulkCreateSlotsMutation } from '../../store/api/adminApi';

const BulkSlotCreation = () => {
  const [formData, setFormData] = useState({
    serviceId: '',
    startDate: '',
    endDate: '',
    timeSlots: ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'],
    capacity: 5,
    daysOfWeek: [1, 2, 3, 4, 5] // Mon-Fri
  });

  const { data: servicesData } = useGetServicesQuery();
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

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Bulk Create Time Slots</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service
            </label>
            <select
              value={formData.serviceId}
              onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Service</option>
              {services.map(service => (
                <option key={service._id} value={service._id}>{service.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity per Slot
            </label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Days of Week
          </label>
          <div className="flex flex-wrap gap-2">
            {dayNames.map((day, index) => (
              <button
                key={index}
                type="button"
                onClick={() => toggleDayOfWeek(index)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  formData.daysOfWeek.includes(index)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Slots
          </label>
          <div className="grid grid-cols-4 gap-2">
            {timeOptions.map(time => (
              <button
                key={time}
                type="button"
                onClick={() => toggleTimeSlot(time)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formData.timeSlots.includes(time)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
        >
          {isLoading ? 'Creating Slots...' : 'Create Bulk Slots'}
        </button>
      </form>
    </div>
  );
};

export default BulkSlotCreation;