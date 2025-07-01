import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getCurrentVendor, getVendorEvents, getVendorServices, vendorManager } from '../utils/vendorUtils';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import EventPackages from './EventPackages/EventPackages';
import ThirdPartyServices from './ThirdPartyServices/ThirdPartyServices';
import '../styles/dashboard.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Dashboard = () => {
  const navigate = useNavigate();
  const vendor = getCurrentVendor();
  const events = getVendorEvents();
  const services = getVendorServices();

  if (!vendor) {
    navigate('/vendor-login');
    return null;
  }

  const payments = vendorManager.getVendorPayments(vendor.id);
  const totalEvents = payments.filter(p => !p.eventId.startsWith('SERVICE_ONLY_')).length;
  const totalServices = payments.filter(p => p.eventId.startsWith('SERVICE_ONLY_')).length;
  const totalRevenue = payments.filter(p => p.paymentStatus === 'Clear').reduce((sum, p) => {
    if (typeof p.totalCost !== 'undefined') return sum + Number(p.totalCost);
    if (p.eventId.startsWith('SERVICE_ONLY_')) {
      const serviceId = p.selectedServices && p.selectedServices[0];
      const service = vendorManager.getVendorContent(vendor.id)?.services?.find(s => s.id === serviceId);
      return sum + (service ? Number(service.price) : 0);
    }
    const base = Number(p.price) || 0;
    const add = Number(p.additionalCost) || 0;
    return sum + base + add;
  }, 0);
  const pendingPayments = payments.filter(p => p.paymentStatus !== 'Clear').length;

  const paymentMethodData = Object.entries(
    payments
      .filter(p => p.paymentStatus === 'Clear' && p.paymentMethod)
      .reduce((acc, p) => {
        acc[p.paymentMethod] = (acc[p.paymentMethod] || 0) + 1;
        return acc;
      }, {})
  ).map(([name, value]) => ({ name, value }));

  const COLORS = {
    'Cash': '#3a3b5a',
    'Online': '#4b4c6a',
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#333446', p: 0 }}>
      <Container maxWidth="lg" sx={{ py: 5, bgcolor: '#23243a', borderRadius: 4, boxShadow: '0 4px 24px 0 rgba(51,52,70,0.10)', mt: 6, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 4, flexWrap: 'wrap' }}>
          <Box sx={{ bgcolor: '#333446', borderRadius: 2, px: 4, py: 2, minWidth: 180, textAlign: 'center', boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)' }}>
            <Typography variant="subtitle2" sx={{ color: '#B8CFCE', fontWeight: 600 }}>Total Events</Typography>
            <Typography variant="h5" sx={{ color: '#EAEFEF', fontWeight: 900 }}>{totalEvents}</Typography>
          </Box>
          <Box sx={{ bgcolor: '#333446', borderRadius: 2, px: 4, py: 2, minWidth: 180, textAlign: 'center', boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)' }}>
            <Typography variant="subtitle2" sx={{ color: '#B8CFCE', fontWeight: 600 }}>Total Services</Typography>
            <Typography variant="h5" sx={{ color: '#EAEFEF', fontWeight: 900 }}>{totalServices}</Typography>
          </Box>
          <Box sx={{ bgcolor: '#333446', borderRadius: 2, px: 4, py: 2, minWidth: 180, textAlign: 'center', boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)' }}>
            <Typography variant="subtitle2" sx={{ color: '#B8CFCE', fontWeight: 600 }}>Total Revenue</Typography>
            <Typography variant="h5" sx={{ color: '#EAEFEF', fontWeight: 900 }}>{totalRevenue}</Typography>
          </Box>
          <Box sx={{ bgcolor: '#333446', borderRadius: 2, px: 4, py: 2, minWidth: 180, textAlign: 'center', boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)' }}>
            <Typography variant="subtitle2" sx={{ color: '#B8CFCE', fontWeight: 600 }}>Pending Payments</Typography>
            <Typography variant="h5" sx={{ color: '#EAEFEF', fontWeight: 900 }}>{pendingPayments}</Typography>
          </Box>
        </Box>

        {/* Centralized Payment Methods Pie Chart */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Box sx={{ bgcolor: '#333446', borderRadius: 2, p: 3, width: { xs: '100%', sm: 400 }, boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)' }}>
            <Typography variant="h6" sx={{ color: '#B8CFCE', fontWeight: 600, mb: 2, textAlign: 'center' }}>
              Payment Methods
            </Typography>
            {paymentMethodData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography sx={{ textAlign: 'center', color: '#B8CFCE', mt: 10 }}>No payment data available</Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ mb: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 900,
              letterSpacing: 2,
              color: '#EAEFEF',
              textShadow: '0 4px 24px #333446',
              mb: 2,
              fontSize: { xs: '2rem', md: '2.5rem' },
              px: 2,
              py: 1,
              borderRadius: 2,
              background: 'none',
              textAlign: 'center',
            }}
          >
            Welcome, {vendor.businessName}
          </Typography>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');
          `}</style>
          <Typography
            variant="h6"
            sx={{
              color: '#B8CFCE',
              fontWeight: 400,
              mb: 2,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              textAlign: 'center',
              letterSpacing: 1
            }}
          >
            Manage your events and services
          </Typography>
        </Box>

        <Box sx={{ mt: 5 }}>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'Playfair Display, serif',
                fontWeight: 700,
                letterSpacing: 1.5,
                color: '#B8CFCE',
                mb: 2,
                fontSize: { xs: '1.5rem', md: '2rem' },
                textAlign: 'center',
              }}
            >
              Event Packages
            </Typography>
          </Box>
          <Box sx={{ bgcolor: '#23243a', borderRadius: 3, p: 3, boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)' }}>
            <EventPackages />
          </Box>
        </Box>

        <Box sx={{ mt: 5 }}>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'Playfair Display, serif',
                fontWeight: 700,
                letterSpacing: 1.5,
                color: '#B8CFCE',
                mb: 2,
                fontSize: { xs: '1.5rem', md: '2rem' },
                textAlign: 'center',
              }}
            >
                Services
            </Typography>
          </Box>
          <Box sx={{ bgcolor: '#23243a', borderRadius: 3, p: 3, boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)' }}>
            <ThirdPartyServices />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;