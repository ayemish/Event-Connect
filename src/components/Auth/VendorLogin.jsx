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
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, color: '#EAEFEF', letterSpacing: 1 }}>
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
              autoComplete="current-password"
              value={formData.password}
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
              Sign In
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ mb: 1, color: '#B8CFCE' }}>
                Don't have an account?
              </Typography>
              <MuiLink component={Link} to="/vendor-signup" variant="body2" sx={{ color: '#B8CFCE', fontWeight: 600, '&:hover': { color: '#EAEFEF' } }}>
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