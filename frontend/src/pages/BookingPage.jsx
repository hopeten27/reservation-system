import { useParams } from 'react-router-dom';

const BookingPage = () => {
  const { slotId } = useParams();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Complete Your Booking
          </h1>
          
          {/* Service Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Service Details
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white">Yoga Class</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Relaxing yoga session for all levels
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Duration: 60 minutes</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">$50</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Time Slot
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-900 dark:text-white font-medium">
                    December 25, 2024
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    10:00 AM - 11:00 AM
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Slot ID: {slotId}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Booking Information
              </h2>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Special Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Any special requirements or notes..."
                  />
                </div>

                <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-medium text-gray-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">$50</span>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-md font-semibold transition-colors"
                  >
                    Confirm Booking
                  </button>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    You can cancel up to 24 hours before the appointment
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;