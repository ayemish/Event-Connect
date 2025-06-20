import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  TextField, 
  InputAdornment, 
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  AppBar,
  Toolbar,
  Paper,
  Alert,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CustomerHeader from './CustomerHeader';
import CustomerFooter from './CustomerFooter';
import CustomerPackageCard from './EventPackages/CustomerPackageCard';
import { useNavigate } from 'react-router-dom';
import { vendorManager } from '../utils/vendorUtils';
import { useAuth } from '../context/AuthContext';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import defaultServiceImg from '../assets/react.svg';

const CustomerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [serviceInvitees, setServiceInvitees] = useState('');
  const [serviceWarning, setServiceWarning] = useState('');
  const [serviceSuccess, setServiceSuccess] = useState('');
  const [bookingServiceId, setBookingServiceId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingWarning, setBookingWarning] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { currentCustomer, logout } = useAuth();

  useEffect(() => {
    const allVendorsContent = vendorManager.getAllVendorsContent();
    console.log('allVendorsContent:', allVendorsContent); // Log the data source

    const allDataWithIds = vendorManager.getAllData();
    console.log('allDataWithIds:', allDataWithIds); // Log the data source

    const allEvents = allVendorsContent.reduce((acc, vendorData) => {
      Object.entries(allDataWithIds).forEach(([vendorId, vendorContent]) => {
        if (vendorContent && Array.isArray(vendorContent.events)) {
          const eventsWithVendorInfo = vendorContent.events.map(event => ({
            ...event,
            vendorId: vendorId,
            vendorName: vendorContent.profile?.businessName || 'Unknown Vendor'
          }));
          acc.push(...eventsWithVendorInfo);
        }
      });
      return acc;
    }, []);

    // Deduplicate events based on event.id
    const uniqueEvents = Array.from(new Map(allEvents.map(event => [event.id, event])).values());
    console.log('uniqueEvents:', uniqueEvents); // Log the deduplicated events

    setEvents(uniqueEvents);

    const uniqueVendors = [...new Set(allEvents.map(event => event.vendorName))];
    const uniqueCategories = [...new Set(allEvents.map(event => event.category).filter(Boolean))];
    setVendors(uniqueVendors);
    setCategories(uniqueCategories);

    // Gather all available services from all vendors
    const allVendorsData = vendorManager.getAllData();
    const allServices = [];
    Object.entries(allVendorsData).forEach(([vendorId, vendorData]) => {
      if (vendorData.services && Array.isArray(vendorData.services)) {
        vendorData.services.forEach(service => {
          allServices.push({ ...service, vendorId });
        });
      }
    });
    setServices(allServices);
    console.log('allServices:', allServices); // Log the services being set
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Filter events based on search query, vendor, and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.category && event.category.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesVendor = !selectedVendor || event.vendorName === selectedVendor;
    const matchesCategory = !selectedCategory || event.category === selectedCategory;

    return matchesSearch && matchesVendor && matchesCategory;
  });

  const handleOpenBooking = (serviceId) => {
    setBookingServiceId(serviceId);
    setBookingDate('');
    setBookingWarning('');
    setBookingSuccess('');
    setBookingDialogOpen(true);
  };

  const handleCloseBooking = () => {
    setBookingDialogOpen(false);
    setBookingServiceId('');
    setBookingDate('');
    setBookingWarning('');
    setBookingSuccess('');
  };

  const handleBookService = (e) => {
    e.preventDefault();
    setBookingWarning('');
    setBookingSuccess('');
    if (!bookingServiceId) {
      setBookingWarning('Please select a service.');
      return;
    }
    if (!bookingDate) {
      setBookingWarning('Please select a date for your service.');
      return;
    }
    const service = services.find(s => s.id === bookingServiceId);
    if (!service) {
      setBookingWarning('Service not found.');
      return;
    }
    // Save as a service-only confirmation (eventId = 'SERVICE_ONLY_' + service.id)
    const vendorId = service.vendorId;
    const eventId = 'SERVICE_ONLY_' + service.id;
    const customerId = currentCustomer?.id || 'anonymous_customer';
    const customerName = currentCustomer?.name || 'Anonymous Customer';
    // Check for duplicate booking on the same date (by any customer)
    const allData = vendorManager.getAllData();
    const vendorData = allData[vendorId];
    if (vendorData && vendorData.confirmations) {
      const alreadyBooked = vendorData.confirmations.some(
        conf => conf.eventId === eventId && conf.date === bookingDate
      );
      if (alreadyBooked) {
        setBookingWarning('This service is already booked for the selected date. Please choose another date.');
        return;
      }
    }
    vendorManager.addEventConfirmation(vendorId, eventId, customerId, customerName, bookingDate, '', [service.id]);
    setBookingSuccess('Service booked successfully!');
    setTimeout(() => {
      setBookingDialogOpen(false);
      setBookingServiceId('');
      setBookingDate('');
      setBookingWarning('');
      setBookingSuccess('');
    }, 1200);
  };

  const filteredServices = services;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#fff', // white background
      }}
    >
      {/* <CustomerHeader /> */}
      {/* Main content area with robust sticky footer layout */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" sx={{ bgcolor: '#2c3e50' }}>
          <Toolbar>
            <Button
              color="inherit"
              startIcon={<ArrowBackIcon />}
              onClick={handleLogout}
              sx={{ mr: 2 }}
            >
              Logout
            </Button>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Customer Dashboard
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ ml: 2 }}
              onClick={() => navigate('/my-booked-services')}
            >
              My Booked Services
            </Button>
            <Button
              variant="outlined"
              color="primary"
              sx={{ ml: 2 }}
              onClick={() => navigate('/my-events')}
            >
              My Events
            </Button>
            <Button
              startIcon={<NotificationsIcon />}
              variant="outlined"
              color="primary"
              sx={{ ml: 2 }}
              onClick={() => navigate('/customer-notifications')}
            >
              Notifications
            </Button>
          </Toolbar>
        </AppBar>
        {/* This Box ensures the Container fills the remaining space */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Container sx={{ flex: 1, py: 4 }}>
            <Typography variant="h4" component="h1" align="center" sx={{ mb: 4 }}>
              Available Event Packages
            </Typography>
            {/* Search and Filter Section */}
            <Stack spacing={2} sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search events by name, description, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    '&:hover': {
                      '& > fieldset': { borderColor: 'primary.main' },
                    },
                  },
                }}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Vendor</InputLabel>
                  <Select
                    value={selectedVendor}
                    label="Vendor"
                    onChange={(e) => setSelectedVendor(e.target.value)}
                    sx={{ backgroundColor: 'white' }}
                  >
                    <MenuItem value="">All Vendors</MenuItem>
                    {vendors.map((vendor) => (
                      <MenuItem key={vendor} value={vendor}>
                        {vendor}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedCategory}
                    label="Category"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    sx={{ backgroundColor: 'white' }}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Stack>

            <Box className="packages-grid" sx={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {/* Show events */}
              {filteredEvents.map((event) => (
                <CustomerPackageCard 
                  key={event.id} 
                  packageData={event}
                />
              ))}
              {/* Services heading if there are any services */}
              {services.length > 0 && (
                <Typography variant="h5" sx={{ gridColumn: '1/-1', mt: 2, mb: 1, color: '#1976d2', fontWeight: 700 }}>
                  Services
                </Typography>
              )}
              {/* Show services as cards with Book button */}
              {filteredServices.map(service => (
                <Card key={service.id} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={
                      !service.image ||
                      service.image.trim().toLowerCase().includes('placeholder.com')
                        ? defaultServiceImg
                        : service.image
                    }
                    alt={service.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{service.name}</Typography>
                    <Typography variant="body2" color="text.secondary">Price: {service.price}</Typography>
                    <Button variant="contained" sx={{ mt: 2 }} onClick={() => handleOpenBooking(service.id)}>
                      Book
                    </Button>
                  </Box>
                </Card>
              ))}
              {/* If no events or services, show message */}
              {filteredEvents.length === 0 && services.length === 0 && (
                <Typography variant="h6" align="center" sx={{ width: '100%', mt: 4 }}>
                  {searchQuery || selectedVendor || selectedCategory 
                    ? 'No matching events or services found.' 
                    : 'No event packages or services available yet.'}
                </Typography>
              )}
            </Box>
          </Container>
        </Box>
      </Box>
      <Dialog open={bookingDialogOpen} onClose={handleCloseBooking}>
        <DialogTitle>Book Service</DialogTitle>
        <form onSubmit={handleBookService}>
          <DialogContent>
            <TextField
              type="date"
              label="Service Date"
              value={bookingDate}
              onChange={e => setBookingDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: false }}
              fullWidth
              sx={{ mb: 3 }}
            />
            {bookingWarning && <Alert severity="warning" sx={{ mb: 2 }}>{bookingWarning}</Alert>}
            {bookingSuccess && <Alert severity="success" sx={{ mb: 2 }}>{bookingSuccess}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseBooking}>Cancel</Button>
            <Button variant="contained" color="primary" type="submit">Book</Button>
          </DialogActions>
        </form>
      </Dialog>
      <CustomerFooter />
    </Box>
  );
};

export default CustomerDashboard; 