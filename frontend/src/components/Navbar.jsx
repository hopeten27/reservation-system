import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../store/api/authApi';
import { clearAuth } from '../store/slices/authSlice';

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearAuth());
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">
                BookingApp
              </h1>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Navigation Links */}
            <div className="hidden md:flex space-x-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/advanced-services"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Services
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/bookings"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    My Bookings
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/dashboard"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
              )}
            </div>



            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100">
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

export default Navbar;