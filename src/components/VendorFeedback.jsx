import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Card, CardContent, Divider, Rating, Grid, Button } from '@mui/material';
import { getCurrentVendor, vendorManager } from '../utils/vendorUtils';
import { useNavigate } from 'react-router-dom';

const VendorFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentVendor = getCurrentVendor();

  useEffect(() => {
    if (!currentVendor || !currentVendor.id) {
      setLoading(false);
      return;
    }
    const vendorData = vendorManager.getVendorContent(currentVendor.id);
    const events = vendorData?.events || [];
    const confirmations = vendorData?.confirmations || [];
    const feedbackList = confirmations
      .filter(conf => conf.feedback)
      .map(conf => {
        const event = events.find(e => e.id === conf.eventId);
        return {
          eventName: event ? event.name : 'Unknown Event',
          eventDate: event ? event.date : '',
          customerName: conf.customerName || conf.customerId,
          feedback: conf.feedback,
        };
      });
    setFeedbacks(feedbackList);
    setLoading(false);
  }, [currentVendor]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#333446', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{
            fontFamily: 'Playfair Display, serif',
            fontWeight: 900,
            letterSpacing: 2,
            color: '#EAEFEF',
            textShadow: '0 4px 24px #333446',
            mb: 4,
            fontSize: { xs: '2.2rem', md: '2.8rem' },
            px: 2,
            py: 1,
            borderRadius: 2,
            background: 'none',
          }}
        >
          Customer Feedback
        </Typography>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');
        `}</style>
      </Box>
      <Paper elevation={3} sx={{ p: 3, mx: 'auto', maxWidth: '900px', width: '100%', bgcolor: '#23243a', color: '#EAEFEF' }}>
        {loading ? (
          <Typography align="center" sx={{ mt: 2 }}>Loading feedback...</Typography>
        ) : feedbacks.length > 0 ? (
          <Grid container spacing={3}>
            {feedbacks.map((fb, idx) => (
              <Grid item xs={12} md={6} key={idx}>
                <Card elevation={4} sx={{ borderRadius: 3, mb: 2, bgcolor: '#333446', color: '#EAEFEF', boxShadow: '0 4px 16px 0 rgba(51,52,70,0.10)' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: '#B8CFCE', fontWeight: 700, letterSpacing: 1 }}>
                      {fb.eventName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {fb.eventDate ? `Event Date: ${fb.eventDate}` : ''}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                      Customer: {fb.customerName}
                    </Typography>
                    <Rating value={fb.feedback.rating} readOnly sx={{ mb: 1 }} />
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {fb.feedback.text}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {fb.feedback.submittedAt ? `Submitted: ${new Date(fb.feedback.submittedAt).toLocaleString()}` : ''}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography align="center" sx={{ mt: 2 }}>
            No feedback from customers yet.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default VendorFeedback; 