import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../store/api/authApi';
import { clearAuth } from '../store/slices/authSlice';
import Logo from './Logo';
import { useState } from 'react';

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearAuth());
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <Logo />
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex space-x-6">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors px-3 py-2"
              >
                Home
              </Link>
              <Link
                to="/advanced-services"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors px-3 py-2"
              >
                Services
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/bookings"
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors px-3 py-2"
                  >
                    My Bookings
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/dashboard"
                      className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors px-3 py-2"
                    >
                      Dashboard
                    </Link>
                  )}
                  <div className="relative">
                    <button 
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors flex items-center space-x-1 px-3 py-2"
                    >
                      <span>{user?.name || user?.email}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                        <button 
                          onClick={() => {
                            handleLogout();
                            setShowDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors ml-2"
                >
                  Login
                </Link>
              )}
            </div>

            <button className="md:hidden p-2 text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Close dropdown when clicking outside
if (typeof window !== 'undefined') {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      // This will be handled by React's event system
    }
  });
}

export default Navbar;