import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  CardMedia,
  Card
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { getCurrentVendor, getVendorData, updateVendorData } from '../../utils/vendorUtils';

const ServiceDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedService, setEditedService] = useState(null);

  useEffect(() => {
    const vendorData = getVendorData();
    if (!vendorData) {
      navigate('/vendor-login');
      return;
    }
    const foundService = vendorData.services.find(s => s.id === serviceId);

    if (foundService) {
      setService(foundService);
      setEditedService(foundService);
    } else {
      navigate('/dashboard'); // Service not found, redirect to dashboard
    }
  }, [serviceId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    setIsDeleting(true);
  };

  const handleConfirmDelete = () => {
    const vendorData = getVendorData();
    if (!vendorData) return;

    const updatedServices = vendorData.services.filter(service => service.id !== serviceId);
    updateVendorData({ services: updatedServices });
    navigate('/dashboard');
  };

  const handleCancelDelete = () => {
    setIsDeleting(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedService(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    const vendorData = getVendorData();
    if (!vendorData) return;

    const updatedServices = vendorData.services.map(service => 
      service.id === editedService.id ? editedService : service
    );
    updateVendorData({ services: updatedServices });
    setService(editedService); // Update local state immediately
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedService(service); // Revert changes
    setIsEditing(false);
  };

  if (!service) {
    return null;
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
          onClick={() => navigate('/dashboard')}
          sx={{ color: 'white' }}
        >
          Back to Dashboard
        </Button>
        <IconButton 
          onClick={() => navigate('/dashboard')}
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
            bgcolor: '#23243a',
            color: '#EAEFEF',
            borderRadius: 3,
            boxShadow: '0 4px 24px 0 rgba(51,52,70,0.10)'
          }}
        >
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <Box>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: 900,
                  letterSpacing: 2,
                  color: '#EAEFEF',
                  mb: 1,
                  fontSize: { xs: '1.8rem', md: '2.5rem' },
                }}
              >
                {service.name}
              </Typography>
              <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');
              `}</style>
            </Box>
            <Box sx={{ mt: { xs: 2, md: 0 }, display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                startIcon={<EditIcon />}
                onClick={handleEdit}
                sx={{
                  background: '#7F8CAA',
                  color: '#EAEFEF',
                  fontWeight: 700,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)',
                  letterSpacing: 1,
                  px: 3,
                  py: 1.2,
                  '&:hover': {
                    background: '#B8CFCE',
                    color: '#333446',
                  },
                }}
              >
                Edit Service
              </Button>
              <Button 
                variant="contained" 
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                sx={{
                  background: '#a95c68',
                  color: '#EAEFEF',
                  fontWeight: 700,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)',
                  letterSpacing: 1,
                  px: 3,
                  py: 1.2,
                  '&:hover': {
                    background: '#c27d8a',
                    color: '#333446',
                  },
                }}
              >
                Delete Service
              </Button>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ bgcolor: '#333446', color: '#EAEFEF' }}>
                <CardMedia
                  component="img"
                  height="400"
                  image={service.image || 'https://via.placeholder.com/400'}
                  alt={service.name}
                  sx={{ objectFit: 'cover' }}
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ color: '#B8CFCE', fontWeight: 700 }}>Description</Typography>
              <Typography variant="body1" paragraph>
                {service.description}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom sx={{ color: '#B8CFCE', fontWeight: 700 }}>Price</Typography>
              <Typography variant="body1" paragraph>
                Rs {service.price}
              </Typography>


            
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Dialog 
        open={isEditing} 
        onClose={handleCancel} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#23243a',
            color: '#EAEFEF',
            borderRadius: 3
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: 'Playfair Display, serif', color: '#B8CFCE', fontWeight: 700, fontSize: '1.8rem' }}>Edit Service</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Service Name"
                  name="name"
                  value={editedService?.name || ''}
                  onChange={handleChange}
                  sx={{ input: { color: '#EAEFEF' }, label: { color: '#B8CFCE' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  value={editedService?.description || ''}
                  onChange={handleChange}
                  sx={{ textarea: { color: '#EAEFEF' }, label: { color: '#B8CFCE' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={editedService?.price || ''}
                  onChange={handleChange}
                  sx={{ input: { color: '#EAEFEF' }, label: { color: '#B8CFCE' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Image URL"
                  name="image"
                  value={editedService?.image || ''}
                  onChange={handleChange}
                  sx={{ input: { color: '#EAEFEF' }, label: { color: '#B8CFCE' } }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} sx={{ color: '#B8CFCE' }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" sx={{ background: '#7F8CAA', color: '#EAEFEF', '&:hover': { background: '#B8CFCE', color: '#333446' } }}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isDeleting}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            bgcolor: '#23243a',
            color: '#EAEFEF',
            borderRadius: 3
          }
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontFamily: 'Playfair Display, serif', color: '#B8CFCE', fontWeight: 700 }}>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description" sx={{ color: '#EAEFEF' }}>
            Are you sure you want to delete this service? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} sx={{ color: '#B8CFCE' }}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus sx={{ background: '#a95c68', '&:hover': { background: '#c27d8a' } }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServiceDetails; 