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
  Alert,
  Grid
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { vendorManager } from '../../utils/vendorUtils';

const VendorSignup = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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
      firstName: formData.firstName,
      lastName: formData.lastName,
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
        bgcolor: '#23243a',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');
        `}</style>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          variant="contained"
          sx={{
            mb: 3,
            bgcolor: '#7F8CAA',
            color: '#EAEFEF',
            fontWeight: 700,
            borderRadius: 2,
            boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)',
            letterSpacing: 1,
            '&:hover': {
              bgcolor: '#B8CFCE',
              color: '#333446',
            }
          }}
        >
          Back to Landing Page
        </Button>
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
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontFamily: 'Playfair Display, serif',
                fontWeight: 900,
                letterSpacing: 1,
                color: '#EAEFEF',
                fontSize: { xs: '1.8rem', md: '2.2rem' },
                mb: 3,
                textAlign: 'center'
              }}
            >
              Vendor Sign Up
            </Typography>
            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2, bgcolor: 'rgba(169,92,104,0.3)', color: '#EAEFEF' }}>
                {error}
              </Alert>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(184,207,206,0.05)',
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      '& fieldset': { border: 'none' },
                      '&:hover': { bgcolor: 'rgba(184,207,206,0.08)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
                      '&.Mui-focused': { bgcolor: 'rgba(184,207,206,0.1)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' },
                    },
                    '& .MuiInputLabel-root': { color: '#B8CFCE' },
                    '& .MuiInputBase-input': { color: '#EAEFEF' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(184,207,206,0.05)',
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      '& fieldset': { border: 'none' },
                      '&:hover': { bgcolor: 'rgba(184,207,206,0.08)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
                      '&.Mui-focused': { bgcolor: 'rgba(184,207,206,0.1)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' },
                    },
                    '& .MuiInputLabel-root': { color: '#B8CFCE' },
                    '& .MuiInputBase-input': { color: '#EAEFEF' },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Business Name"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(184,207,206,0.05)',
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      '& fieldset': { border: 'none' },
                      '&:hover': { bgcolor: 'rgba(184,207,206,0.08)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
                      '&.Mui-focused': { bgcolor: 'rgba(184,207,206,0.1)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' },
                    },
                    '& .MuiInputLabel-root': { color: '#B8CFCE' },
                    '& .MuiInputBase-input': { color: '#EAEFEF' },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(184,207,206,0.05)',
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      '& fieldset': { border: 'none' },
                      '&:hover': { bgcolor: 'rgba(184,207,206,0.08)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
                      '&.Mui-focused': { bgcolor: 'rgba(184,207,206,0.1)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' },
                    },
                    '& .MuiInputLabel-root': { color: '#B8CFCE' },
                    '& .MuiInputBase-input': { color: '#EAEFEF' },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(184,207,206,0.05)',
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      '& fieldset': { border: 'none' },
                      '&:hover': { bgcolor: 'rgba(184,207,206,0.08)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
                      '&.Mui-focused': { bgcolor: 'rgba(184,207,206,0.1)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' },
                    },
                    '& .MuiInputLabel-root': { color: '#B8CFCE' },
                    '& .MuiInputBase-input': { color: '#EAEFEF' },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(184,207,206,0.05)',
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      '& fieldset': { border: 'none' },
                      '&:hover': { bgcolor: 'rgba(184,207,206,0.08)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
                      '&.Mui-focused': { bgcolor: 'rgba(184,207,206,0.1)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' },
                    },
                    '& .MuiInputLabel-root': { color: '#B8CFCE' },
                    '& .MuiInputBase-input': { color: '#EAEFEF' },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(184,207,206,0.05)',
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      '& fieldset': { border: 'none' },
                      '&:hover': { bgcolor: 'rgba(184,207,206,0.08)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
                      '&.Mui-focused': { bgcolor: 'rgba(184,207,206,0.1)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' },
                    },
                    '& .MuiInputLabel-root': { color: '#B8CFCE' },
                    '& .MuiInputBase-input': { color: '#EAEFEF' },
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2, fontWeight: 700, fontSize: '1.2rem', borderRadius: 2 }}
            >
              SIGN UP
            </Button>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#B8CFCE', fontWeight: 500 }}>
                Already have an account?{' '}
                <Link
                  to="/vendor-login"
                  style={{
                    color: '#B8CFCE',
                    textDecoration: 'none',
                    fontWeight: 'bold'
                  }}
                  onMouseOver={e => (e.target.style.color = '#EAEFEF')}
                  onMouseOut={e => (e.target.style.color = '#B8CFCE')}
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