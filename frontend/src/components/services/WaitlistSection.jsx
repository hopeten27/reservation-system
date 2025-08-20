import { useState } from 'react';
import { useJoinWaitlistMutation, useGetWaitlistStatusQuery } from '../../store/api/waitlistApi';

const WaitlistSection = ({ serviceId, availableSlots = [] }) => {
  const [joinWaitlist, { isLoading: isJoining }] = useJoinWaitlistMutation();
  const { data: waitlistData } = useGetWaitlistStatusQuery(serviceId);
  
  const isOnWaitlist = waitlistData?.data?.isOnWaitlist || false;
  const waitlistPosition = waitlistData?.data?.position;
  
  // Check if service has available slots
  const hasAvailableSlots = availableSlots.some(slot => 
    slot.status === 'open' && slot.bookedCount < slot.capacity
  );
  
  // Don't show waitlist if there are available slots
  if (hasAvailableSlots) {
    return null;
  }
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleJoinWaitlist = async (e) => {
    e.preventDefault();
    
    try {
      await joinWaitlist({
        serviceId,
        email,
        phone
      }).unwrap();
      setEmail('');
      setPhone('');
    } catch (error) {
      // Error handled by toast middleware
    }
  };

  if (isOnWaitlist) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            ⏳
          </div>
          <div>
            <h3 className="font-semibold text-yellow-800">You're on the Waitlist!</h3>
            <p className="text-sm text-yellow-600">
              Position #{waitlistPosition} - We'll notify you when a spot opens up
            </p>
          </div>
        </div>
        
        <div className="bg-yellow-100 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-2">What happens next?</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• We'll email you when a spot becomes available</li>
            <li>• You'll have 30 minutes to book before we move to the next person</li>
            <li>• You can leave the waitlist anytime</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
          📋
        </div>
        <div>
          <h3 className="font-semibold text-orange-800">All Slots Fully Booked</h3>
          <p className="text-sm text-orange-600">
            Join our waitlist to be notified when spots become available
          </p>
        </div>
      </div>

      <form onSubmit={handleJoinWaitlist} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <button
          type="submit"
          disabled={isJoining}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
        >
          {isJoining ? 'Joining Waitlist...' : 'Join Waitlist'}
        </button>
      </form>

      <div className="mt-4 pt-4 border-t border-orange-200">
        <div className="text-sm text-orange-700">
          <strong>Waitlist Benefits:</strong>
          <ul className="mt-2 space-y-1">
            <li>• Priority booking when spots open</li>
            <li>• Email & SMS notifications</li>
            <li>• No commitment - leave anytime</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WaitlistSection;