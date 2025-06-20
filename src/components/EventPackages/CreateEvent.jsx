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
  Divider,
  Container,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem
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
            onClick={() => navigate('/')}
            variant="contained"
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              color: theme.palette.primary.main,
              '&:hover': {
                bgcolor: 'white'
              }
            }}
          >
            Back to Dashboard
          </Button>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            Create New Event
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
                  Event Details
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3} justifyContent="center">
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="Event Name"
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
                      label="Event Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel id="category-label">Category</InputLabel>
                      <Select
                        labelId="category-label"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        label="Category"
                        required
                        sx={{ 
                          height: '56px',
                          '& .MuiSelect-select': {
                            height: '56px !important',
                            display: 'flex',
                            alignItems: 'center'
                          }
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
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom color="primary" align="center">
                  Event Images
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<AddPhotoAlternateIcon />}
                    sx={{ mb: 2 }}
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
                        <Card sx={{ position: 'relative', width: 150, height: 150 }}>
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
                              bgcolor: 'rgba(255, 255, 255, 0.8)',
                              '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.9)'
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
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.2)'
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