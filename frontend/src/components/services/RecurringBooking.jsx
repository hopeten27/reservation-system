import { useState } from 'react';
import { useCreateRecurringBookingMutation } from '../../store/api/recurringApi';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const RecurringBooking = ({ serviceId, availableSlots }) => {
  const [createRecurringBooking, { isLoading: isCreating }] = useCreateRecurringBookingMutation();
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState('weekly');
  const [duration, setDuration] = useState('4');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [startDate, setStartDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const recurringData = {
        serviceId,
        frequency,
        totalSessions: parseInt(duration),
        dayOfWeek: parseInt(selectedDay),
        time: selectedTime,
        startDate
      };
      
      const result = await createRecurringBooking(recurringData).unwrap();
      
      // Redirect to payment
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: result.data.paymentIntent.clientSecret
      });
      
      if (error) {
        console.error('Payment error:', error);
      }
    } catch (error) {
      console.error('Recurring booking error:', error);
    }
  };

  const getDayName = (dayNumber) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber];
  };

  const getAvailableTimes = () => {
    if (!selectedDay) return [];
    
    // Get unique times for the selected day
    const times = availableSlots
      .filter(slot => new Date(slot.date).getDay() === parseInt(selectedDay))
      .map(slot => new Date(slot.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
      .filter((time, index, arr) => arr.indexOf(time) === index);
    
    return times;
  };

  if (!isRecurring) {
    return (
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center">
            🔄
          </div>
          <div>
            <h3 className="font-semibold text-purple-800">Recurring Bookings</h3>
            <p className="text-sm text-purple-600">
              Book regular weekly sessions and save time
            </p>
          </div>
        </div>

        <div className="bg-purple-100 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-purple-800 mb-2">Benefits of Recurring Bookings:</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Secure your preferred time slot every week</li>
            <li>• 10% discount on recurring bookings</li>
            <li>• Automatic booking - no need to remember</li>
            <li>• Cancel or modify anytime</li>
          </ul>
        </div>

        <button
          onClick={() => setIsRecurring(true)}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
        >
          Set Up Recurring Booking
        </button>
      </div>
    );
  }

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-purple-800">Set Up Recurring Booking</h3>
        <button
          onClick={() => setIsRecurring(false)}
          className="text-purple-600 hover:text-purple-800 text-sm"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="weekly">Weekly</option>
              <option value="biweekly">Every 2 Weeks</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="4">4 sessions</option>
              <option value="8">8 sessions</option>
              <option value="12">12 sessions</option>
              <option value="16">16 sessions</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Day of Week
          </label>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          >
            <option value="">Select a day</option>
            {[0, 1, 2, 3, 4, 5, 6].map(day => (
              <option key={day} value={day}>{getDayName(day)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Time
          </label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          >
            <option value="">Select a time</option>
            {getAvailableTimes().map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>

        <div className="bg-purple-100 rounded-lg p-4">
          <h4 className="font-medium text-purple-800 mb-2">Booking Summary:</h4>
          <div className="text-sm text-purple-700 space-y-1">
            <div>• {duration} {frequency} sessions</div>
            <div>• Every {selectedDay && getDayName(parseInt(selectedDay))} at {selectedTime}</div>
            <div>• Starting {startDate && new Date(startDate).toLocaleDateString()}</div>
            <div>• 10% recurring discount applied</div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isCreating}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
        >
          {isCreating ? 'Creating...' : 'Create Recurring Booking'}
        </button>
      </form>
    </div>
  );
};

export default RecurringBooking;