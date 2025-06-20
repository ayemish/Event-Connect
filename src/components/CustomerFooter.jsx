import React from 'react';
import { Box, Typography } from '@mui/material';

const CustomerFooter = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 3,
        mt: 'auto', // Pushes the footer to the bottom
        bgcolor: '#1976d2',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Event Planner. All rights reserved.
      </Typography>
    </Box>
  );
};

export default CustomerFooter; 