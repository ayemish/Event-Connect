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
  DialogActions,
  Chip,
  Divider
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
import BackToDashboardButton from './BackToDashboardButton';

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
    <>
      <CustomerHeader />
      <Box sx={{ minHeight: '100vh', bgcolor: '#333446', width: '100%', height: 'auto' }}>
        <Container maxWidth="lg" sx={{ py: 5, bgcolor: '#23243a', borderRadius: 4, boxShadow: '0 4px 24px 0 rgba(51,52,70,0.10)', mt: 6, mb: 4 }}>
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
              Welcome, {currentCustomer?.name || 'Customer'}
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
              Browse and book events and services
            </Typography>
          </Box>

          {/* Search and Filter Section */}
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'Playfair Display, serif',
                fontWeight: 700,
                letterSpacing: 1.5,
                color: '#B8CFCE',
                mb: 3,
                fontSize: { xs: '1.5rem', md: '2rem' },
                textAlign: 'center',
              }}
            >
              Available Event Packages
            </Typography>
            <Box sx={{ bgcolor: '#23243a', borderRadius: 3, p: 3, boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)' }}>
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
                        <SearchIcon sx={{ color: '#B8CFCE' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                      background: 'rgba(127,140,170,0.25)',
                      backdropFilter: 'blur(6px)',
                      borderRadius: '14px',
                      color: '#EAEFEF',
                      fontSize: '1.1rem',
                      boxShadow: '0 2px 12px 0 rgba(44,62,80,0.10)',
                      border: '1.5px solid #7F8CAA',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      '& fieldset': {
                        borderColor: 'transparent',
                      },
                    '&:hover': {
                        boxShadow: '0 4px 18px 0 rgba(44,62,80,0.18)',
                        borderColor: '#B8CFCE',
                      },
                      '&.Mui-focused': {
                        borderColor: '#EAEFEF',
                        boxShadow: '0 0 0 2px #B8CFCE',
                      },
                      '& input': {
                        color: '#EAEFEF',
                        fontWeight: 500,
                        '&::placeholder': {
                          color: '#B8CFCE',
                          opacity: 1,
                          fontStyle: 'italic',
                          fontSize: '1.05rem'
                        }
                      }
                    },
                    '& .MuiInputAdornment-root': {
                      color: '#B8CFCE',
                    }
                }}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                    <InputLabel sx={{ color: '#B8CFCE', fontWeight: 500, fontSize: '1.05rem' }}>Vendor</InputLabel>
                  <Select
                    value={selectedVendor}
                    label="Vendor"
                    onChange={(e) => setSelectedVendor(e.target.value)}
                      sx={{ 
                        background: 'rgba(127,140,170,0.25)',
                        backdropFilter: 'blur(6px)',
                        color: '#EAEFEF',
                        borderRadius: '14px',
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        boxShadow: '0 2px 12px 0 rgba(44,62,80,0.10)',
                        border: '1.5px solid #7F8CAA',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'transparent',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#B8CFCE',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#EAEFEF',
                        },
                        '& .MuiSvgIcon-root': {
                          color: '#B8CFCE',
                        },
                        '& .MuiSelect-select': {
                          color: '#EAEFEF',
                          fontWeight: 500,
                          py: 1.2
                        }
                      }}
                    >
                      <MenuItem value="" sx={{ color: '#333446' }}>All Vendors</MenuItem>
                    {vendors.map((vendor) => (
                        <MenuItem key={vendor} value={vendor} sx={{ color: '#333446' }}>
                        {vendor}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel sx={{ color: '#B8CFCE', fontWeight: 500, fontSize: '1.05rem' }}>Category</InputLabel>
                  <Select
                    value={selectedCategory}
                    label="Category"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                      sx={{ 
                        background: 'rgba(127,140,170,0.25)',
                        backdropFilter: 'blur(6px)',
                        color: '#EAEFEF',
                        borderRadius: '14px',
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        boxShadow: '0 2px 12px 0 rgba(44,62,80,0.10)',
                        border: '1.5px solid #7F8CAA',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'transparent',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#B8CFCE',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#EAEFEF',
                        },
                        '& .MuiSvgIcon-root': {
                          color: '#B8CFCE',
                        },
                        '& .MuiSelect-select': {
                          color: '#EAEFEF',
                          fontWeight: 500,
                          py: 1.2
                        }
                      }}
                    >
                      <MenuItem value="" sx={{ color: '#333446' }}>All Categories</MenuItem>
                    {categories.map((category) => (
                        <MenuItem key={category} value={category} sx={{ color: '#333446' }}>
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
                {/* If no events, show message */}
                {filteredEvents.length === 0 && (
                  <Typography 
                    variant="h6" 
                    align="center" 
                    sx={{ 
                      width: '100%', 
                      mt: 4,
                      color: '#EAEFEF',
                      fontFamily: 'Playfair Display, serif'
                    }}
                  >
                    {searchQuery || selectedVendor || selectedCategory 
                      ? 'No matching events found.' 
                      : 'No event packages available yet.'}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          {/* Services Section */}
              {services.length > 0 && (
            <Box sx={{ mt: 5 }}>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  color: '#B8CFCE',
                  mb: 3,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  textAlign: 'center',
                }}
              >
                  Services
                </Typography>
              <Box sx={{ bgcolor: '#23243a', borderRadius: 3, p: 3, boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)' }}>
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '1.5rem'
                }}>
              {filteredServices.map(service => (
                    <Card 
                      key={service.id} 
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(51,52,70,0.3)'
                        },
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        bgcolor: '#333446',
                        color: '#EAEFEF',
                        borderRadius: 3,
                        overflow: 'hidden',
                        border: '1px solid #7F8CAA',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.3), 0 0 15px rgba(184,207,206,0.1)'
                      }}
                    >
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
                      <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography 
                          variant="h6" 
                          component="div" 
                          gutterBottom
                          sx={{
                            fontSize: '1.1rem',
                            lineHeight: 1.3,
                            height: '2.6rem',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            color: '#EAEFEF',
                            fontWeight: 700
                          }}
                        >
                          {service.name}
                        </Typography>
                        <Stack spacing={1} sx={{ mb: 1 }}>
                          {service.vendorName && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Typography variant="body2" sx={{ color: '#B8CFCE', fontWeight: 600 }}>
                                {service.vendorName}
                              </Typography>
                            </Box>
                          )}
                          {service.category && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Chip 
                                label={service.category}
                                size="small"
                                sx={{ 
                                  backgroundColor: '#7F8CAA',
                                  color: '#EAEFEF',
                                  fontWeight: 600,
                                  '&:hover': {
                                    backgroundColor: '#B8CFCE',
                                    color: '#333446'
                                  },
                                  height: '24px'
                                }}
                              />
                            </Box>
                          )}
                          {service.price && (
                            <Typography variant="body2" sx={{ color: '#B8CFCE', fontWeight: 600 }}>
                              Price: {service.price}
                            </Typography>
                          )}
                        </Stack>
                        <Divider sx={{ my: 1, borderColor: '#7F8CAA' }} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography 
                            variant="body2" 
                            sx={{
                              color: '#EAEFEF',
                              fontSize: '0.9rem',
                              lineHeight: 1.4,
                              height: '6rem',
                              overflow: 'auto',
                              pr: 1,
                              // Custom scrollbar for dark theme
                              '&::-webkit-scrollbar': {
                                width: '6px',
                                background: '#23243a',
                                borderRadius: '4px'
                              },
                              '&::-webkit-scrollbar-thumb': {
                                background: '#7F8CAA',
                                borderRadius: '4px'
                              },
                              scrollbarColor: '#7F8CAA #23243a',
                              scrollbarWidth: 'thin',
                            }}
                          >
                            {service.description || service.details}
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 'auto', pt: 2 }}>
                          <Button 
                            variant="contained" 
                            fullWidth
                            sx={{ 
                              bgcolor: '#7F8CAA',
                              color: '#23243a',
                              fontWeight: 700,
                              fontSize: '1rem',
                              py: 1.5,
                              borderRadius: 2,
                              boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)',
                              '&:hover': {
                                bgcolor: '#B8CFCE',
                                color: '#23243a'
                              }
                            }} 
                            onClick={() => handleOpenBooking(service.id)}
                          >
                      Book
                    </Button>
                        </Box>
                  </Box>
                </Card>
              ))}
                </Box>
              </Box>
            </Box>
          )}
          </Container>
        <Dialog 
          open={bookingDialogOpen} 
          onClose={handleCloseBooking}
          PaperProps={{
            sx: {
              bgcolor: '#7F8CAA',
              borderRadius: 2
            }
          }}
        >
          <DialogTitle sx={{ color: '#EAEFEF', fontFamily: 'Playfair Display, serif' }}>
            Book Service
          </DialogTitle>
        <form onSubmit={handleBookService}>
          <DialogContent>
            <TextField
              type="date"
              label="Service Date"
              value={bookingDate}
              onChange={e => setBookingDate(e.target.value)}
                InputLabelProps={{ 
                  shrink: true,
                  sx: { color: '#B8CFCE' }
                }}
              InputProps={{ readOnly: false }}
              fullWidth
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#333446',
                    color: '#EAEFEF',
                    '& fieldset': {
                      borderColor: '#B8CFCE',
                    },
                    '&:hover fieldset': {
                      borderColor: '#EAEFEF',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#B8CFCE',
                    }
                  }
                }}
            />
            {bookingWarning && <Alert severity="warning" sx={{ mb: 2 }}>{bookingWarning}</Alert>}
            {bookingSuccess && <Alert severity="success" sx={{ mb: 2 }}>{bookingSuccess}</Alert>}
          </DialogContent>
          <DialogActions>
              <Button 
                onClick={handleCloseBooking}
                sx={{
                  color: '#B8CFCE',
                  '&:hover': {
                    bgcolor: '#333446',
                    color: '#EAEFEF'
                  }
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                type="submit"
                sx={{
                  bgcolor: '#B8CFCE',
                  color: '#333446',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: '#EAEFEF'
                  }
                }}
              >
                Book
              </Button>
          </DialogActions>
        </form>
      </Dialog>
      <CustomerFooter />
    </Box>
    </>
  );
};

export default CustomerDashboard; 