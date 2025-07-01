import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Paper, Container, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const success = login(email, password);
            if (success) {
                navigate('/customer-dashboard');
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            setError('An error occurred during login');
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
                py: 4,
                position: 'relative'
            }}
        >
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/')}
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
                Back to Home
            </Button>
            <Container maxWidth="xs">
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
                                letterSpacing: 2,
                                color: '#EAEFEF',
                                fontSize: { xs: '2rem', md: '2.5rem' },
                                mb: 3
                            }}
                        >
                            Customer Login
                        </Typography>
                        <style>{`
                            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');
                        `}</style>
                        
                        {error && (
                            <Alert severity="error" sx={{ width: '100%', mb: 2, bgcolor: 'rgba(169,92,104,0.3)', color: '#EAEFEF' }}>
                                {error}
                            </Alert>
                        )}
                        
                        <TextField
                            fullWidth
                            label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                            sx={{ 
                                mb: 2,
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                            sx={{ 
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
                    Login
                        </Button>

                        <Typography sx={{ mt: 3, color: '#B8CFCE' }}>
                        Don't have an account?{' '}
                            <Link to="/signup" style={{ color: '#EAEFEF', textDecoration: 'none', fontWeight: 700 }}>
                            Sign up here
                        </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login; 