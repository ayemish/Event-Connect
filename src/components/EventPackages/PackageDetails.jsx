import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Grid,
  TextField,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Edit as EditIcon, ArrowBack as ArrowBackIcon, Close as CloseIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getCurrentVendor, getVendorEvents, updateVendorData } from '../../utils/vendorUtils';

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedEvent, setEditedEvent] = useState(null);

  useEffect(() => {
    const vendorEvents = getVendorEvents();
    const foundEvent = vendorEvents.find(e => e.id === id);
    if (foundEvent) {
      setEvent(foundEvent);
      setEditedEvent(foundEvent);
    }
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    setIsDeleting(true);
  };

  const handleConfirmDelete = () => {
    const vendorData = getCurrentVendor();
    if (!vendorData) return;

    const updatedEvents = getVendorEvents().filter(event => event.id !== id);
    updateVendorData({ events: updatedEvents });
    navigate('/dashboard');
  };

  const handleCancelDelete = () => {
    setIsDeleting(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    const vendorData = getCurrentVendor();
    if (!vendorData) return;

    const updatedEvents = getVendorEvents().map(event => 
      event.id === editedEvent.id ? editedEvent : event
    );
    updateVendorData({ events: updatedEvents });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedEvent(event);
    setIsEditing(false);
  };

  if (!event) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">Package not found</Typography>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/dashboard')}
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
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" gutterBottom>
              {event.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Event ID: {event.id}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                startIcon={<EditIcon />}
                onClick={handleEdit}
                sx={{ mr: 2 }}
              >
                Edit Package
              </Button>
              <Button 
                variant="contained" 
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                Delete Package
              </Button>
            </Box>
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
                          height="100"
                          image={image.preview}
                          alt={`Additional image ${index + 2}`}
                          sx={{ objectFit: 'cover' }}
                        />
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Event Description</Typography>
              <Typography variant="body1" paragraph>
                {event.description}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
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
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }
        }}
      >
        <DialogTitle>Edit Package</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Package Name"
                  name="name"
                  value={editedEvent?.name || ''}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  value={editedEvent?.description || ''}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isDeleting}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Are you sure you want to delete this event package? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PackageDetails; 