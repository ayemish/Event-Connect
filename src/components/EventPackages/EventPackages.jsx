import PackageCard from './PackageCard';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { getVendorEvents } from '../../utils/vendorUtils';
import './eventPackages.css';

const EventPackages = () => {
  const events = getVendorEvents();
  console.log('Events in EventPackages:', events);
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate('/create-event');
  };

  return (
    <Box sx={{ mt: 4, p: 3, bgcolor: '#23243a', borderRadius: 3, boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontFamily: 'Playfair Display, serif',
            fontWeight: 700,
            letterSpacing: 1.5,
            color: '#B8CFCE',
            fontSize: { xs: '1.5rem', md: '2rem' },
            textAlign: 'center',
          }}
        >
          Event Packages
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          sx={{
            background: '#7F8CAA',
            color: '#EAEFEF',
            fontWeight: 700,
            borderRadius: 2,
            boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)',
            letterSpacing: 1,
            px: 3,
            py: 1.2,
            fontSize: '1.05rem',
            '&:hover': {
              background: '#B8CFCE',
              color: '#333446',
            },
          }}
        >
          Add New Package
        </Button>
      </Box>
      
      <div className="packages-grid">
        {events.map(event => (
          <PackageCard 
            key={event.id} 
            packageData={{
              id: event.id,
              name: event.name,
              image: event.image,
              details: event.description
            }} 
          />
        ))}
      </div>
    </Box>
  );
};

export default EventPackages;