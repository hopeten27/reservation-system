import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
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
import PaymentSuccessPage from '../pages/PaymentSuccessPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import SupportPage from '../pages/SupportPage';
import PrivacyPage from '../pages/PrivacyPage';
import TermsPage from '../pages/TermsPage';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

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
          <Route path="payment-success" element={
            <ProtectedRoute>
              <Elements stripe={stripePromise}>
                <PaymentSuccessPage />
              </Elements>
            </ProtectedRoute>
          } />
          <Route path="dashboard" element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;