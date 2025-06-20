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
    <Box sx={{ minHeight: '100vh', bgcolor: '#f9f9f9', p: 3 }}>
      <Button variant="contained" sx={{ mb: 3 }} onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </Button>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: '#2c3e50', fontWeight: 700, mb: 4 }}>
        Customer Feedback
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mx: 'auto', maxWidth: '900px', width: '100%' }}>
        {loading ? (
          <Typography align="center" sx={{ mt: 2 }}>Loading feedback...</Typography>
        ) : feedbacks.length > 0 ? (
          <Grid container spacing={3}>
            {feedbacks.map((fb, idx) => (
              <Grid item xs={12} md={6} key={idx}>
                <Card elevation={4} sx={{ borderRadius: 3, mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: '#7b2ff2', fontWeight: 600 }}>
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