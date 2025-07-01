import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Paper, Container, Alert, Grid } from '@mui/material';

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const customerData = {
                name: `${formData.firstName} ${formData.lastName}`,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                password: formData.password,
                createdAt: new Date().toISOString()
            };

            register(customerData);
            navigate('/customer-dashboard');
        } catch (err) {
            setError('An error occurred during registration');
        }
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
                            Customer Sign Up
                        </Typography>
                        <style>{`
                            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');
                        `}</style>
                        
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
                        </Grid>

                        <TextField
                            fullWidth
                            label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                            sx={{ 
                                mt: 2,
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

                        <TextField
                            fullWidth
                            label="Phone Number"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                            sx={{ 
                                mt: 2,
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

                        <TextField
                            fullWidth
                            label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                            sx={{ 
                                mt: 2,
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

                        <TextField
                            fullWidth
                            label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                            sx={{ 
                                mt: 2,
                                mb: 3,
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

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            sx={{
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
                    Sign Up
                        </Button>

                        <Typography sx={{ mt: 3, color: '#B8CFCE' }}>
                        Already have an account?{' '}
                            <Link to="/login" style={{ color: '#EAEFEF', textDecoration: 'none', fontWeight: 700 }}>
                            Login here
                        </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Signup; 