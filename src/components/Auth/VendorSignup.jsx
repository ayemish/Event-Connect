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
        bgcolor: '#333446',
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
          elevation={6}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'rgba(35,36,58,0.98)',
            color: '#EAEFEF',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(51,52,70,0.25)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{
              mb: 3,
              fontFamily: 'Playfair Display, serif',
              fontWeight: 900,
              color: '#EAEFEF',
              letterSpacing: 1
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
              sx={{ mb: 2,
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#23243a',
                  color: '#EAEFEF',
                  borderRadius: 2,
                  '& fieldset': { borderColor: '#7F8CAA' },
                  '&:hover fieldset': { borderColor: '#B8CFCE' },
                  '&.Mui-focused fieldset': { borderColor: '#B8CFCE' },
                  '& input': { color: '#EAEFEF' }
                },
                '& .MuiInputLabel-root': { color: '#B8CFCE' }
              }}
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
              sx={{ mb: 2,
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#23243a',
                  color: '#EAEFEF',
                  borderRadius: 2,
                  '& fieldset': { borderColor: '#7F8CAA' },
                  '&:hover fieldset': { borderColor: '#B8CFCE' },
                  '&.Mui-focused fieldset': { borderColor: '#B8CFCE' },
                  '& input': { color: '#EAEFEF' }
                },
                '& .MuiInputLabel-root': { color: '#B8CFCE' }
              }}
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
              sx={{ mb: 2,
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#23243a',
                  color: '#EAEFEF',
                  borderRadius: 2,
                  '& fieldset': { borderColor: '#7F8CAA' },
                  '&:hover fieldset': { borderColor: '#B8CFCE' },
                  '&.Mui-focused fieldset': { borderColor: '#B8CFCE' },
                  '& input': { color: '#EAEFEF' }
                },
                '& .MuiInputLabel-root': { color: '#B8CFCE' }
              }}
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
              sx={{ mb: 2,
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#23243a',
                  color: '#EAEFEF',
                  borderRadius: 2,
                  '& fieldset': { borderColor: '#7F8CAA' },
                  '&:hover fieldset': { borderColor: '#B8CFCE' },
                  '&.Mui-focused fieldset': { borderColor: '#B8CFCE' },
                  '& input': { color: '#EAEFEF' }
                },
                '& .MuiInputLabel-root': { color: '#B8CFCE' }
              }}
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
              sx={{ mb: 2,
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#23243a',
                  color: '#EAEFEF',
                  borderRadius: 2,
                  '& fieldset': { borderColor: '#7F8CAA' },
                  '&:hover fieldset': { borderColor: '#B8CFCE' },
                  '&.Mui-focused fieldset': { borderColor: '#B8CFCE' },
                  '& input': { color: '#EAEFEF' }
                },
                '& .MuiInputLabel-root': { color: '#B8CFCE' }
              }}
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
              sx={{ mb: 3,
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#23243a',
                  color: '#EAEFEF',
                  borderRadius: 2,
                  '& fieldset': { borderColor: '#7F8CAA' },
                  '&:hover fieldset': { borderColor: '#B8CFCE' },
                  '&.Mui-focused fieldset': { borderColor: '#B8CFCE' },
                  '& input': { color: '#EAEFEF' }
                },
                '& .MuiInputLabel-root': { color: '#B8CFCE' }
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                bgcolor: '#B8CFCE',
                color: '#333446',
                fontWeight: 700,
                borderRadius: 2,
                boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)',
                letterSpacing: 1,
                '&:hover': {
                  bgcolor: '#EAEFEF',
                  color: '#23243a'
                }
              }}
            >
              Sign Up
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