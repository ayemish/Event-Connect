import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
  Alert
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { vendorManager } from '../../utils/vendorUtils';

const VendorLogin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Get all vendors from the VendorContentManager
    const allVendorsContent = vendorManager.getAllData();
    const vendors = Object.values(allVendorsContent).map(data => data.profile);
    
    // Find vendor with matching email
    const vendor = vendors.find(v => v.email === formData.email);

    if (!vendor) {
      setError('No account found with this email');
      return;
    }

    // Check if password matches
    if (vendor.password !== formData.password) {
      setError('Invalid password');
      return;
    }

    // If both email and password match, set the current vendor in session storage
    const currentVendorSession = {
      id: vendor.id,
      isAuthenticated: true,
      businessName: vendor.businessName
    };
    localStorage.setItem('vendor', JSON.stringify(currentVendorSession));
    
    // Use vendorManager to ensure vendor content data is initialized or updated
    vendorManager.addOrUpdateVendorProfile(vendor.id, vendor);
    
    navigate('/dashboard');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          variant="contained"
          sx={{
            mb: 3,
            bgcolor: '#2c3e50',
            '&:hover': {
              bgcolor: '#34495e'
            }
          }}
        >
          Back to Landing Page
        </Button>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Vendor Login
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.2)'
              }}
            >
              Sign In
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Don't have an account?
              </Typography>
              <MuiLink component={Link} to="/vendor-signup" variant="body2">
                Sign up as a vendor
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default VendorLogin; 