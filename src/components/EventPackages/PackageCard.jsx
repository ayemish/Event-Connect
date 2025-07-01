import { useNavigate } from 'react-router-dom';
import { Card, CardMedia, Typography, Box, Chip, Stack, Divider } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CategoryIcon from '@mui/icons-material/Category';
import { getCurrentVendor } from '../../utils/vendorUtils';

const PackageCard = ({ packageData }) => {
  const navigate = useNavigate();
  const currentVendor = getCurrentVendor();
  const isVendorView = !!currentVendor;

  const handleClick = () => {
    if (isVendorView) {
      navigate(`/package/${packageData.id}`);
    } else {
      navigate(`/customer-package/${packageData.id}`);
    }
  };

  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(51,52,70,0.3)'
        },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '450px',
        width: '100%',
        bgcolor: '#333446',
        color: '#EAEFEF',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid #7F8CAA',
        boxShadow: '0 6px 20px rgba(0,0,0,0.3), 0 0 15px rgba(184,207,206,0.1)'
      }}
      onClick={handleClick}
    >
      <CardMedia
        component="img"
        height="180"
        image={packageData.image}
        alt={packageData.name}
        sx={{ objectFit: 'cover' }}
      />
      <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography 
          variant="h6" 
          component="div" 
          gutterBottom
          sx={{
            fontSize: '1.1rem',
            lineHeight: 1.3,
            height: '2.6rem',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            color: '#EAEFEF',
            fontWeight: 700
          }}
        >
          {packageData.name}
        </Typography>

        <Stack spacing={1} sx={{ mb: 1 }}>
          {packageData.vendorName && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <StorefrontIcon sx={{ fontSize: '1rem', color: '#B8CFCE' }} />
              <Typography variant="body2" sx={{ color: '#B8CFCE', fontWeight: 600 }}>
                {packageData.vendorName}
              </Typography>
            </Box>
          )}
          
          {packageData.category && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CategoryIcon sx={{ fontSize: '1rem', color: '#B8CFCE' }} />
              <Chip 
                label={packageData.category}
                size="small"
                sx={{ 
                  backgroundColor: '#7F8CAA',
                  color: '#EAEFEF',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#B8CFCE',
                    color: '#333446'
                  },
                  height: '24px'
                }}
              />
            </Box>
          )}

          {packageData.price && (
            <Typography variant="body2" sx={{ color: '#B8CFCE', fontWeight: 600 }}>
              Price: Rs {packageData.price}
            </Typography>
          )}

        </Stack>

        <Divider sx={{ my: 1, borderColor: '#7F8CAA' }} />
        
        <Box sx={{ flexGrow: 1 }}>
          <Typography 
            variant="body2" 
            sx={{
              fontSize: '0.9rem',
              lineHeight: 1.4,
              height: '5rem',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              color: '#EAEFEF'
            }}
          >
            {packageData.description || packageData.details}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default PackageCard;