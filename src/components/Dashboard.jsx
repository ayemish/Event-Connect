import React from 'react';
import { Box, Typography, Container, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getCurrentVendor, getVendorEvents, getVendorServices } from '../utils/vendorUtils';
import Header from './Layout/Header';
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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom className="dashboard-welcome-heading">
            Welcome, {vendor.businessName}
          </Typography>
          <Typography variant="body1" className="dashboard-subtitle">
            Manage your events and services
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <EventPackages />
        </Box>

        <Box sx={{ mt: 4 }}>
          <ThirdPartyServices />
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;