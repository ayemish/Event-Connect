import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CreateEvent from './components/EventPackages/CreateEvent';
import PackageDetails from './components/EventPackages/PackageDetails';
import ServiceDetails from './components/ThirdPartyServices/ServiceDetails';
import CreateService from './components/ThirdPartyServices/CreateService';
import LandingPage from './components/LandingPage';
import CustomerDashboard from './components/CustomerDashboard';
import VendorLogin from './components/Auth/VendorLogin';
import VendorSignup from './components/Auth/VendorSignup';
import CustomerPackageDetails from './components/EventPackages/CustomerPackageDetails';
import Notifications from './components/Notifications';
import Login from './components/Login';
import Signup from './components/Signup';
import { AuthProvider, useAuth } from './context/AuthContext';
import MyEvents from './components/MyEvents';
import ConfirmEvent from './components/EventPackages/ConfirmEvent';
import EventConfirmationDetails from './components/EventPackages/EventConfirmationDetails';
import BookServiceOnly from './components/BookServiceOnly';
import MyBookedServices from './components/MyBookedServices';
import ServiceBookings from './components/ServiceBookings';
import SendInvitations from './components/SendInvitations';
import SendInvitationCard from './components/SendInvitationCard';
import CustomerNotifications from './components/CustomerNotifications';
import VendorFeedback from './components/VendorFeedback';
import Payments from './components/Payments';
import './styles/main.css';
import Header from './components/Layout/Header';
import { useLocation } from 'react-router-dom';

// Protected Route component for vendors
const ProtectedRoute = ({ children }) => {
  const vendor = JSON.parse(localStorage.getItem('vendor'));
  if (!vendor?.isAuthenticated) {
    return <Navigate to="/vendor-login" />;
  }
  return children;
};

// Protected Route component for customers
const ProtectedCustomerRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

function AppRoutes() {
  return (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/vendor-login" element={<VendorLogin />} />
          <Route path="/vendor-signup" element={<VendorSignup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Customer Routes */}
      <Route path="/customer-dashboard" element={
        <ProtectedCustomerRoute>
          <CustomerDashboard />
        </ProtectedCustomerRoute>
      } />
      <Route path="/customer-package/:id" element={
        <ProtectedCustomerRoute>
          <CustomerPackageDetails />
        </ProtectedCustomerRoute>
      } />
      <Route path="/my-events" element={
        <ProtectedCustomerRoute>
          <MyEvents />
        </ProtectedCustomerRoute>
      } />
      <Route path="/my-booked-services" element={
        <ProtectedCustomerRoute>
          <MyBookedServices />
        </ProtectedCustomerRoute>
      } />
      <Route path="/confirm-event/:eventId" element={
        <ProtectedCustomerRoute>
          <ConfirmEvent />
        </ProtectedCustomerRoute>
      } />
      <Route path="/book-service" element={
        <ProtectedCustomerRoute>
          <BookServiceOnly />
        </ProtectedCustomerRoute>
      } />
      <Route path="/customer-notifications" element={<CustomerNotifications />} />
          
      {/* Protected Vendor Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/create-event" element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          } />
          <Route path="/package/:id" element={
            <ProtectedRoute>
              <PackageDetails />
            </ProtectedRoute>
          } />
          <Route path="/service/:serviceId" element={
            <ProtectedRoute>
              <ServiceDetails />
            </ProtectedRoute>
          } />
          <Route path="/create-service" element={
            <ProtectedRoute>
              <CreateService />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
          <Route path="/event-confirmation/:eventId/:customerId/:date" element={
            <ProtectedRoute>
              <EventConfirmationDetails />
            </ProtectedRoute>
          } />
          <Route path="/service-bookings" element={
            <ProtectedRoute>
              <ServiceBookings />
            </ProtectedRoute>
          } />
          <Route path="/send-invitations" element={
            <ProtectedRoute>
              <SendInvitations />
            </ProtectedRoute>
          } />
          <Route path="/send-invitations/:eventId/:customerId/:date" element={
            <ProtectedRoute>
              <SendInvitationCard />
            </ProtectedRoute>
          } />
          <Route path="/vendor-feedback" element={<VendorFeedback />} />
          <Route path="/payments" element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          } />
        </Routes>
  );
}

function AppContent() {
  const location = useLocation();
  // Show header only on vendor-side pages
  const vendorPaths = [
    '/dashboard',
    '/notifications',
    '/service-bookings',
    '/send-invitations',
    '/vendor-feedback',
  ];
  // Also match dynamic vendor pages
  const isVendorPage = vendorPaths.some(path => location.pathname.startsWith(path)) ||
    location.pathname.startsWith('/event-confirmation') ||
    location.pathname.startsWith('/package') ||
    location.pathname.startsWith('/service/');
  
  // Show customer header on customer-side pages
  const customerPaths = [
    '/customer-dashboard',
    '/customer-package',
    '/my-events',
    '/my-booked-services',
    '/confirm-event',
    '/book-service',
    '/customer-notifications',
  ];
  const isCustomerPage = customerPaths.some(path => location.pathname.startsWith(path));
  
  return (
    <div className="app">
      {isVendorPage && <Header />}
      <AppRoutes />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;