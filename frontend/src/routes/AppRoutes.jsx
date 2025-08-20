import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ServiceDetailsPage from '../pages/ServiceDetailsPage';
import BookingPage from '../pages/BookingPage';
import BookingsPage from '../pages/BookingsPage';
import AdminDashboard from '../pages/AdminDashboard';
import AdvancedServicesPage from '../pages/AdvancedServicesPage';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="services/:id" element={<ServiceDetailsPage />} />
          <Route path="advanced-services" element={<AdvancedServicesPage />} />
          <Route path="book/:slotId" element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          } />
          <Route path="bookings" element={
            <ProtectedRoute>
              <BookingsPage />
            </ProtectedRoute>
          } />
          <Route path="dashboard" element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;