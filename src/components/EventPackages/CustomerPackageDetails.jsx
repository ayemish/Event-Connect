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
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        height: 'auto',
        bgcolor: '#333446',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1, 
        bgcolor: '#23243a',
        p: 2,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderBottom: '1px solid #7F8CAA'
      }}>
        <IconButton 
          onClick={() => navigate('/customer-dashboard')}
          sx={{ color: '#B8CFCE', '&:hover': { color: '#EAEFEF', bgcolor: '#333446' } }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ 
        flex: 1,
        p: { xs: 1, md: 3 },
        maxWidth: '1200px',
        width: '100%',
        mx: 'auto',
        my: 2
      }}>
        <Paper 
          elevation={4} 
          sx={{ 
            p: { xs: 2, md: 4 },
            bgcolor: '#23243a',
            color: '#EAEFEF',
            borderRadius: 4,
            boxShadow: '0 4px 24px 0 rgba(51,52,70,0.10)'
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" gutterBottom sx={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, color: '#EAEFEF', letterSpacing: 1 }}>
              {event.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#B8CFCE', fontWeight: 500 }} gutterBottom>
              By {event.vendorName}
            </Typography>
            {event.category && (
              <Chip 
                label={event.category}
                sx={{ 
                  backgroundColor: '#7F8CAA',
                  color: '#EAEFEF',
                  fontWeight: 600,
                  letterSpacing: 1,
                  '&:hover': {
                    backgroundColor: '#B8CFCE',
                    color: '#333446'
                  },
                  height: '28px',
                  fontSize: '1rem',
                  mt: 1
                }}
              />
            )}
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ bgcolor: '#333446', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                <CardMedia
                  component="img"
                  height="340"
                  image={event.image}
                  alt={event.name}
                  sx={{ objectFit: 'cover', borderRadius: 3 }}
                />
              </Card>
              {event.images && event.images.length > 1 && (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {event.images.slice(1).map((image, index) => (
                    <Grid item xs={4} key={index}>
                      <Card sx={{ bgcolor: '#333446', borderRadius: 2 }}>
                        <CardMedia
                          component="img"
                          height="90"
                          image={image}
                          alt={`${event.name} - Image ${index + 2}`}
                          sx={{ objectFit: 'cover', borderRadius: 2 }}
                        />
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#B8CFCE', fontFamily: 'Playfair Display, serif', fontWeight: 700 }}>
                  Description
                </Typography>
                <Typography variant="body1" paragraph sx={{ color: '#EAEFEF', fontWeight: 400, lineHeight: 1.7 }}>
                  {event.description || event.details}
                </Typography>
              </Box>

              <Divider sx={{ my: 3, borderColor: '#7F8CAA' }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#B8CFCE', fontFamily: 'Playfair Display, serif', fontWeight: 700 }}>
                  Event Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" sx={{ color: '#B8CFCE', fontWeight: 600 }}>
                      Venue
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#EAEFEF' }}>
                      {event.venue}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" sx={{ color: '#B8CFCE', fontWeight: 600 }}>
                      Price
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#EAEFEF' }}>
                      {event.price}
                    </Typography>
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