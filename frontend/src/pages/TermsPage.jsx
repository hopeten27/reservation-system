const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Terms of Service</h1>
          <p className="text-xl text-blue-100">
            Please read these terms carefully
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <p className="text-sm text-gray-500 mb-8 text-center">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-8">
            <section className="border-l-4 border-blue-500 pl-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using ReserveEase, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>
            
            <section className="border-l-4 border-indigo-500 pl-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Use License</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Permission is granted to temporarily use ReserveEase for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <div className="bg-indigo-50 rounded-xl p-4">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    Modify or copy the materials
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    Use the materials for any commercial purpose or for any public display
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    Attempt to reverse engineer any software contained on the platform
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    Remove any copyright or other proprietary notations from the materials
                  </li>
                </ul>
              </div>
            </section>
            
            <section className="border-l-4 border-purple-500 pl-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Terms</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">When making a booking through our platform:</p>
              <div className="bg-purple-50 rounded-xl p-4">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    All bookings are subject to availability
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Payment is required at the time of booking
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Cancellation policies vary by service provider
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    You are responsible for providing accurate information
                  </li>
                </ul>
              </div>
            </section>
            
            <section className="border-l-4 border-green-500 pl-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">User Accounts</h2>
              <p className="text-gray-600 leading-relaxed">
                You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account or password.
              </p>
            </section>
            
            <section className="border-l-4 border-red-500 pl-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Prohibited Uses</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">You may not use our service:</p>
              <div className="bg-red-50 rounded-xl p-4">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    For any unlawful purpose or to solicit others to perform unlawful acts
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    To violate any international, federal, provincial, or state regulations
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    To infringe upon or violate intellectual property rights
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate
                  </li>
                </ul>
              </div>
            </section>
            
            <section className="border-l-4 border-orange-500 pl-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimer</h2>
              <p className="text-gray-600 leading-relaxed">
                The materials on ReserveEase are provided on an 'as is' basis. ReserveEase makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Questions About Terms?</h2>
          <p className="text-blue-100 mb-6">
            If you have any questions about these Terms of Service, please contact us at legal@reserveease.com
          </p>
          <a href="/contact" className="bg-white text-blue-600 px-8 py-3 rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105 font-medium inline-block">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;