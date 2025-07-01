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
import AddIcon from '@mui/icons-material/Add';
import { addVendorService } from '../../utils/vendorUtils';

const CreateService = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { eventId } = useParams();

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
      bgcolor: '#23243a',
      py: 4,
      position: 'relative'
    }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/dashboard')}
        variant="contained"
        sx={{ 
          position: 'absolute',
          top: { xs: '1rem', md: '2rem' },
          left: { xs: '1rem', md: '2rem' },
          bgcolor: '#7F8CAA',
          color: '#EAEFEF',
          fontWeight: 700,
          borderRadius: 2,
          boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)',
          letterSpacing: 1,
          px: 3,
          py: 1.2,
          '&:hover': {
            bgcolor: '#B8CFCE',
            color: '#333446',
          },
        }}
      >
        Back to Dashboard
      </Button>
      <Container maxWidth="md" sx={{ px: 2 }}>
        <Box sx={{ 
          textAlign: 'center',
          mb: 4
        }}>
          <Typography 
            variant="h2" 
            component="h1"
            sx={{ 
              fontFamily: 'Playfair Display, serif',
              fontWeight: 900,
              letterSpacing: 2,
              color: '#EAEFEF',
              fontSize: { xs: '2rem', md: '3rem' },
              display: 'inline-block'
            }}
          >
            Create New Service
          </Typography>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');
          `}</style>
        </Box>

        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            bgcolor: '#333446',
            color: '#EAEFEF',
            borderRadius: 3,
            boxShadow: '0 4px 24px 0 rgba(51,52,70,0.10)'
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography 
                  variant="h3" 
                  gutterBottom 
                  align="center"
                  sx={{
                    fontFamily: 'Playfair Display, serif',
                    fontWeight: 700,
                    color: '#B8CFCE',
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    mb: 2
                  }}
                >
                  Service Details
                </Typography>
                <Divider sx={{ mb: 3, borderColor: '#7F8CAA' }} />
                <Grid container spacing={3} justifyContent="center">
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="Service Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      sx={{ 
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'rgba(184,207,206,0.05)',
                          borderRadius: 2,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          '& fieldset': {
                            border: 'none',
                          },
                          '&:hover': {
                            bgcolor: 'rgba(184,207,206,0.08)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          },
                          '&.Mui-focused': {
                            bgcolor: 'rgba(184,207,206,0.1)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#B8CFCE',
                        },
                        '& .MuiInputBase-input': {
                          color: '#EAEFEF',
                        },
                      }}
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
                      sx={{ 
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'rgba(184,207,206,0.05)',
                          borderRadius: 2,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          '& fieldset': {
                            border: 'none',
                          },
                          '&:hover': {
                            bgcolor: 'rgba(184,207,206,0.08)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          },
                          '&.Mui-focused': {
                            bgcolor: 'rgba(184,207,206,0.1)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#B8CFCE',
                        },
                        '& .MuiInputBase-input': {
                          color: '#EAEFEF',
                        },
                      }}
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'rgba(184,207,206,0.05)',
                          borderRadius: 2,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          '& fieldset': {
                            border: 'none',
                          },
                          '&:hover': {
                            bgcolor: 'rgba(184,207,206,0.08)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          },
                          '&.Mui-focused': {
                            bgcolor: 'rgba(184,207,206,0.1)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#B8CFCE',
                        },
                        '& .MuiInputBase-input': {
                          color: '#EAEFEF',
                        },
                      }}
                    />
                  </Grid>

                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Typography 
                  variant="h3" 
                  gutterBottom 
                  align="center"
                  sx={{
                    fontFamily: 'Playfair Display, serif',
                    fontWeight: 700,
                    color: '#B8CFCE',
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    mb: 2
                  }}
                >
                  Service Image
                </Typography>
                <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<AddPhotoAlternateIcon />}
                    sx={{ 
                      mb: 2,
                      borderColor: '#7F8CAA',
                      color: '#B8CFCE',
                      '&:hover': {
                        borderColor: '#B8CFCE',
                        bgcolor: 'rgba(184,207,206,0.1)',
                      },
                    }}
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
                    <Card sx={{ 
                      position: 'relative', 
                      width: 150, 
                      height: 150,
                      bgcolor: '#23243a',
                      border: '1px solid #7F8CAA'
                    }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={formData.image.preview}
                        alt="Service Preview"
                        sx={{ objectFit: 'cover', height: '100%' }}
                      />
                      <IconButton
                        size="small"
                        onClick={removeImage}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          bgcolor: 'rgba(169,92,104,0.9)',
                          color: '#EAEFEF',
                          '&:hover': {
                            bgcolor: '#a95c68',
                          }
                        }}
                      >
                        <DeleteIcon />
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
                    startIcon={<AddIcon />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      background: '#7F8CAA',
                      color: '#EAEFEF',
                      fontWeight: 700,
                      borderRadius: 2,
                      boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)',
                      letterSpacing: 1,
                      '&:hover': {
                        background: '#B8CFCE',
                        color: '#333446',
                      },
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