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
    <Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(123, 146, 168, 0.7)', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" color="primary">
          {title}
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleAddClick}
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