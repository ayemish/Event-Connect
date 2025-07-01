import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Container,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { addVendorEvent } from '../../utils/vendorUtils';

const EVENT_CATEGORIES = [
  'Wedding',
  'Birthday',
  'Corporate',
  'Conference',
  'Exhibition',
  'Concert',
  'Sports',
  'Festival',
  'Other'
];

const CreateEvent = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    venue: '',
    price: '',
    category: '',
    images: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            file,
            preview: reader.result
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(images => {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...images]
      }));
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addVendorEvent(formData);
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
            Create New Event
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
                  Event Details
                </Typography>
                <Divider sx={{ mb: 3, borderColor: '#7F8CAA' }} />
                <Grid container spacing={3} justifyContent="center">
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="Event Name"
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
                      label="Event Description"
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
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel id="category-label" sx={{ color: '#B8CFCE' }}>Category</InputLabel>
                      <Select
                        labelId="category-label"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        label="Category"
                        required
                        sx={{ 
                          bgcolor: 'rgba(184,207,206,0.05)',
                          borderRadius: 2,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          color: '#EAEFEF',
                          '& .MuiOutlinedInput-notchedOutline': {
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
                          '& .MuiSvgIcon-root': {
                            color: '#B8CFCE',
                          },
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              bgcolor: '#333446',
                              color: '#EAEFEF',
                              '& .MuiMenuItem-root': {
                                '&:hover': {
                                  bgcolor: '#7F8CAA',
                                },
                              },
                            },
                          },
                        }}
                      >
                        {EVENT_CATEGORIES.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="Venue"
                      name="venue"
                      value={formData.venue}
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
                  Event Images
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
                    Upload Images
                    <input
                      type="file"
                      hidden
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                  <Grid container spacing={2} justifyContent="center">
                    {formData.images.map((image, index) => (
                      <Grid item key={index}>
                        <Card sx={{ 
                          position: 'relative', 
                          width: 150, 
                          height: 150,
                          bgcolor: '#23243a',
                          border: '1px solid #7F8CAA'
                        }}>
                          <CardMedia
                            component="img"
                            image={image.preview}
                            alt={`Preview ${index + 1}`}
                            sx={{ height: '100%', objectFit: 'cover' }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => removeImage(index)}
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
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
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
                  Create Event
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default CreateEvent; 