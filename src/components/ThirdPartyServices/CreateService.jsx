import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper,
  IconButton,
  Card,
  CardMedia,
  Divider,
  Container,
  useTheme
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { addVendorService } from '../../utils/vendorUtils';

const CreateService = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { eventId } = useParams(); // Get eventId if creating an event-specific service

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: { file, preview: reader.result }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const serviceData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image: formData.image?.preview || '',
    };

    addVendorService(serviceData);
    navigate('/dashboard');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
      py: 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Container maxWidth={false} disableGutters sx={{ width: '100%' }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 4,
          gap: 2,
          justifyContent: 'center'
        }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(eventId ? `/event/${eventId}` : '/')}
            variant="contained"
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              color: theme.palette.primary.main,
              '&:hover': {
                bgcolor: 'white'
              }
            }}
          >
            Back
          </Button>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            Create New Service {eventId && `for Event ${eventId}`}
          </Typography>
        </Box>

        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            width: '100%',
            mx: 'auto'
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom color="primary" align="center">
                  Service Details
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3} justifyContent="center">
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="Service Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  </Grid>

                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom color="primary" align="center">
                  Service Image
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<AddPhotoAlternateIcon />}
                    sx={{ mb: 2 }}
                  >
                    Upload Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                  {formData.image && (
                    <Card sx={{ position: 'relative', maxWidth: 300 }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={formData.image.preview}
                        alt="Service Preview"
                        sx={{ objectFit: 'cover' }}
                      />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'rgba(255, 255, 255, 0.8)',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.9)'
                          }
                        }}
                        onClick={removeImage}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Card>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ 
                      py: 2,
                      px: 6,
                      fontSize: '1.1rem',
                      background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                      boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    Create Service
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default CreateService; 