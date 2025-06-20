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
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)'
        },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '450px',
        width: '100%'
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
            WebkitBoxOrient: 'vertical'
          }}
        >
          {packageData.name}
        </Typography>

        <Stack spacing={1} sx={{ mb: 1 }}>
          {packageData.vendorName && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <StorefrontIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {packageData.vendorName}
              </Typography>
            </Box>
          )}
          
          {packageData.category && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CategoryIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
              <Chip 
                label={packageData.category}
                size="small"
                sx={{ 
                  backgroundColor: '#e3f2fd',
                  color: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#bbdefb'
                  },
                  height: '24px'
                }}
              />
            </Box>
          )}

          {packageData.price && (
            <Typography variant="body2" color="text.secondary">
              Price: {packageData.price}
            </Typography>
          )}

        </Stack>

        <Divider sx={{ my: 1 }} />
        
        <Box sx={{ flexGrow: 1 }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              fontSize: '0.9rem',
              lineHeight: 1.4,
              height: '5rem',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical'
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