import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Grid,
  Card,
  CardMedia,
  Divider,
  IconButton,
  Chip
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Close as CloseIcon } from '@mui/icons-material';
import { vendorManager } from '../../utils/vendorUtils';

const CustomerPackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const allVendorsContent = vendorManager.getAllVendorsContent();
    const allEvents = allVendorsContent.reduce((acc, vendorData) => {
      if (vendorData && Array.isArray(vendorData.events)) {
        const eventsWithVendor = vendorData.events.map(event => ({
          ...event,
          vendorName: vendorData.profile?.businessName || 'Unknown Vendor'
        }));
        acc.push(...eventsWithVendor);
      }
      return acc;
    }, []);

    const foundEvent = allEvents.find(e => e.id === id);
    if (foundEvent) {
      setEvent(foundEvent);
    }
  }, [id]);

  if (!event) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">Package not found</Typography>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/customer-dashboard')}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 1300,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1, 
        bgcolor: 'rgba(0, 0, 0, 0.8)',
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/customer-dashboard')}
          sx={{ color: 'white' }}
        >
          Back to Dashboard
        </Button>
        <IconButton 
          onClick={() => navigate('/customer-dashboard')}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ 
        flex: 1,
        p: 3,
        maxWidth: '1200px',
        width: '100%',
        mx: 'auto',
        my: 2
      }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3,
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" gutterBottom>
              {event.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              By {event.vendorName}
            </Typography>
            {event.category && (
              <Chip 
                label={event.category}
                sx={{ 
                  backgroundColor: '#e3f2fd',
                  color: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#bbdefb'
                  }
                }}
              />
            )}
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardMedia
                  component="img"
                  height="400"
                  image={event.image}
                  alt={event.name}
                  sx={{ objectFit: 'cover' }}
                />
              </Card>
              {event.images && event.images.length > 1 && (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {event.images.slice(1).map((image, index) => (
                    <Grid item xs={4} key={index}>
                      <Card>
                        <CardMedia
                          component="img"
                          height="120"
                          image={image}
                          alt={`${event.name} - Image ${index + 2}`}
                          sx={{ objectFit: 'cover' }}
                        />
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" paragraph>
                  {event.description || event.details}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Event Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Venue
                    </Typography>
                    <Typography variant="body1">
                      {event.venue}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Price
                    </Typography>
                    <Typography variant="body1">
                      {event.price}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>

                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default CustomerPackageDetails; 