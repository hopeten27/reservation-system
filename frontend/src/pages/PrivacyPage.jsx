import { Link } from 'react-router-dom';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl text-blue-100">
            Your privacy is important to us
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <p className="text-sm text-gray-500 mb-8 text-center">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-8">
            <section className="border-l-4 border-blue-500 pl-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We collect information you provide directly to us, such as when you create an account, make a booking, or contact us for support.
              </p>
              <div className="bg-blue-50 rounded-xl p-4">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Personal information (name, email address, phone number)
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Booking and payment information
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Communication preferences
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Usage data and analytics
                  </li>
                </ul>
              </div>
            </section>
            
            <section className="border-l-4 border-indigo-500 pl-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">We use the information we collect to:</p>
              <div className="bg-indigo-50 rounded-xl p-4">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    Process and manage your bookings
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    Send booking confirmations and reminders
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    Provide customer support
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    Improve our services
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    Comply with legal obligations
                  </li>
                </ul>
              </div>
            </section>
            
            <section className="border-l-4 border-purple-500 pl-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing</h2>
              <p className="text-gray-600 leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share information with trusted service providers who assist us in operating our platform.
              </p>
            </section>
            
            <section className="border-l-4 border-green-500 pl-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-600 leading-relaxed">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>
            
            <section className="border-l-4 border-orange-500 pl-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">You have the right to:</p>
              <div className="bg-orange-50 rounded-xl p-4">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    Access your personal information
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    Correct inaccurate information
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    Delete your account and personal information
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    Opt out of marketing communications
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Questions About Privacy?</h2>
          <p className="text-blue-100 mb-6">
            If you have any questions about this Privacy Policy, please contact us at privacy@reserveease.com
          </p>
          <Link to="/contact" className="bg-white text-blue-600 px-8 py-3 rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105 font-medium inline-block">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;