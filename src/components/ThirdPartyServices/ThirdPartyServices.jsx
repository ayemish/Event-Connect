import React from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ServiceCard from './ServiceCard';
import { useNavigate } from 'react-router-dom';
import { getVendorServices } from '../../utils/vendorUtils';
import './thirdPartyServices.css';

const ThirdPartyServices = () => {
  const navigate = useNavigate();
  const servicesToDisplay = getVendorServices();

  const handleAddClick = () => {
    navigate('/create-service');
  };

  const title = "Your Services";

  return (
    <Box sx={{ mt: 4, p: 3, bgcolor: '#23243a', borderRadius: 3, boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontFamily: 'Playfair Display, serif',
            fontWeight: 700,
            letterSpacing: 1.5,
            color: '#B8CFCE',
            fontSize: { xs: '1.5rem', md: '2rem' },
            textAlign: 'center',
          }}
        >
          Services
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          sx={{
            background: '#7F8CAA',
            color: '#EAEFEF',
            fontWeight: 700,
            borderRadius: 2,
            boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)',
            letterSpacing: 1,
            px: 3,
            py: 1.2,
            fontSize: '1.05rem',
            '&:hover': {
              background: '#B8CFCE',
              color: '#333446',
            },
          }}
        >
          Add New Service
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {servicesToDisplay.length > 0 ? (
          servicesToDisplay.map(service => (
            <Grid item key={service.id} xs={12} sm={6} md={4} lg={3}>
              <ServiceCard service={service} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary">
              No services added yet.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ThirdPartyServices;