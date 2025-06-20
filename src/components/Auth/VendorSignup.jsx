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

const VendorSignup = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Get existing vendors from the new manager, or fallback to old structure for migration
    const allVendorsContent = vendorManager.getAllData();
    const existingVendors = Object.values(allVendorsContent).map(data => data.profile);

    // Check if email already exists
    if (existingVendors.some(vendor => vendor?.email === formData.email)) {
      setError('An account with this email already exists');
      return;
    }

    // Create new vendor object (profile data)
    const newVendorProfile = {
      id: Date.now().toString(), // Simple unique ID for the vendor
      fullName: formData.fullName,
      businessName: formData.businessName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password, // Storing password for consistency with current localStorage, consider hashing in real app
    };

    // Add new vendor to the VendorContentManager, which also initializes their content data
    vendorManager.addOrUpdateVendorProfile(newVendorProfile.id, newVendorProfile);

    // Set current vendor session
    const currentVendorSession = {
      id: newVendorProfile.id,
      isAuthenticated: true,
      businessName: newVendorProfile.businessName
    };
    localStorage.setItem('vendor', JSON.stringify(currentVendorSession));

    // Navigate to dashboard
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
        background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
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
          <Typography
            component="h1"
            variant="h4"
            sx={{
              mb: 3,
              color: '#1976d2',
              fontWeight: 'bold'
            }}
          >
            Vendor Sign Up
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="fullName"
              label="Full Name"
              name="fullName"
              autoComplete="name"
              autoFocus
              value={formData.fullName}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="businessName"
              label="Business Name"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="phone"
              label="Phone Number"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
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
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
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
                background: 'linear-gradient(45deg, #1976d2 30%, #64b5f6 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0 30%, #42a5f5 90%)',
                }
              }}
            >
              Sign Up
            </Button>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  to="/vendor-login"
                  style={{
                    color: '#1976d2',
                    textDecoration: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default VendorSignup; 