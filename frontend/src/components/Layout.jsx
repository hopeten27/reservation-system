import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
      
      <Footer />
      
      {/* Toast Container - will be implemented later */}
      <div id="toast-container" className="fixed top-4 right-4 z-50 space-y-2">
        {/* Toasts will be rendered here */}
      </div>
    </div>
  );
};

export default Layout;