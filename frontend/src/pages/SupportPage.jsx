import { Link } from 'react-router-dom';

const SupportPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Support Center</h1>
          <p className="text-xl text-blue-100">
            Find answers to your questions
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-white font-bold text-sm">Q</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">How do I make a booking?</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Simply browse our services, select your preferred time slot, and complete the booking process. You'll receive a confirmation email with all the details.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-white font-bold text-sm">Q</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">Can I cancel or reschedule my booking?</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Yes, you can cancel or reschedule your booking from your account dashboard. Please note our cancellation policy for any applicable fees.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-white font-bold text-sm">Q</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">How do I create an account?</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Click on the "Login" button in the top navigation and select "Sign up" to create a new account. You'll need to provide your email and create a password.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-white font-bold text-sm">Q</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">What payment methods do you accept?</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We accept all major credit cards including Visa, MasterCard, and American Express. Payments are processed securely through Stripe.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-white font-bold text-sm">Q</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">How do I contact customer support?</h3>
                  <p className="text-gray-600 leading-relaxed">
                    You can reach our support team via email at support@reserveease.com or call us at +1 (555) 123-4567 during business hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Need More Help?</h2>
          <p className="text-blue-100 mb-6 text-lg">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="bg-white text-blue-600 px-8 py-3 rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105 font-medium">
              Contact Support
            </Link>
            <a href="mailto:support@reserveease.com" className="border-2 border-white text-white px-8 py-3 rounded-xl hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105 font-medium">
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;