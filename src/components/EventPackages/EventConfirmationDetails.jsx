import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Chip, Divider, Stack, TextField, IconButton, Checkbox, List, ListItem, ListItemText } from '@mui/material';
import { vendorManager } from '../../utils/vendorUtils';
import DeleteIcon from '@mui/icons-material/Delete';

const EventConfirmationDetails = () => {
  const { eventId, customerId, date } = useParams();
  const navigate = useNavigate();
  const [confirmation, setConfirmation] = useState(null);
  const [event, setEvent] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const todoKey = `todo_${eventId}_${customerId}_${date}`;

  useEffect(() => {
    // Get current vendor
    const vendor = JSON.parse(localStorage.getItem('vendor'));
    if (!vendor || !vendor.id) return;
    const vendorData = vendorManager.getVendorContent(vendor.id);
    if (!vendorData) return;
    // Find confirmation
    const conf = (vendorData.confirmations || []).find(
      c => c.eventId === eventId && c.customerId === customerId && c.date === date
    );
    setConfirmation(conf);
    // Find event
    const evt = (vendorData.events || []).find(e => e.id === eventId);
    setEvent(evt);
  }, [eventId, customerId, date]);

  // Load tasks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(todoKey);
    if (saved) setTasks(JSON.parse(saved));
  }, [todoKey]);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem(todoKey, JSON.stringify(tasks));
  }, [tasks, todoKey]);

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { text: newTask, completed: false, id: Date.now() }]);
      setNewTask('');
    }
  };
  const handleToggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  if (!confirmation || !event) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5">Event confirmation not found</Typography>
        <Button onClick={() => navigate('/notifications')} sx={{ mt: 2 }}>
          Back to Notifications
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#333446', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Paper elevation={4} sx={{ p: 4, maxWidth: 1200, width: '100%', mt: 4, bgcolor: '#23243a', color: '#EAEFEF' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 900,
              letterSpacing: 2,
              color: '#EAEFEF',
              textShadow: '0 4px 24px #333446',
              mb: 3,
              fontSize: { xs: '1.5rem', md: '2.2rem' },
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%',
              maxWidth: '100%'
            }}
          >
            {confirmation.customerName} &mdash; {event.name}
          </Typography>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');
          `}</style>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={2}>
          {confirmation.isCustomized && (
            <Chip label="Customized Event" color="info" sx={{ fontWeight: 700, fontSize: '1rem', bgcolor: '#7F8CAA', color: '#EAEFEF', width: 'fit-content' }} />
          )}
          <Typography variant="body1">
            <b>Event Description:</b> {event.description}
          </Typography>
          <Typography variant="body1">
            <b>Date:</b> {confirmation.date}
          </Typography>
          <Typography variant="body1">
            <b>Status:</b> <Chip label={confirmation.status || 'Pending'} color={confirmation.status === 'Completed' ? 'success' : confirmation.status === 'Ongoing' ? 'warning' : confirmation.status === 'Booked' ? 'info' : 'default'} />
          </Typography>
          <Typography variant="body1">
            <b>Invitees:</b> {confirmation.invitees || 'N/A'}
          </Typography>
          {confirmation.isCustomized && confirmation.customizationDetails && confirmation.customizationDetails.length > 0 && (
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography variant="body1" sx={{ color: '#B8CFCE', fontWeight: 700 }}>
                Customizations:
              </Typography>
              <List dense>
                {confirmation.customizationDetails.map((s, idx) => (
                  <ListItem key={s.id || idx} sx={{ pl: 0 }}>
                    <ListItemText
                      primary={<span style={{ color: '#EAEFEF' }}>{s.name}</span>}
                      secondary={<span style={{ color: '#B8CFCE' }}>+ {s.price}</span>}
                    />
                  </ListItem>
                ))}
              </List>
              <Typography variant="body2" sx={{ color: '#B8CFCE', mt: 1 }}>
                Additional Cost: <b style={{ color: '#EAEFEF' }}>{confirmation.additionalCost}</b>
              </Typography>
              <Typography variant="body2" sx={{ color: '#B8CFCE' }}>
                Total Cost: <b style={{ color: '#EAEFEF' }}>{confirmation.totalCost}</b>
              </Typography>
            </Box>
          )}
          <Typography variant="body2" color="text.secondary">
            Confirmed on: {new Date(confirmation.timestamp).toLocaleString()}
          </Typography>
        </Stack>
        <Button
          variant="contained"
          sx={{
            mt: 3,
            bgcolor: '#7F8CAA',
            color: '#EAEFEF',
            fontWeight: 700,
            borderRadius: 2,
            boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)',
            '&:hover': {
              bgcolor: '#B8CFCE',
              color: '#333446',
            },
            letterSpacing: 1
          }}
          onClick={() => navigate('/notifications')}
        >
          Back to Notifications
        </Button>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" sx={{ mb: 2 }}>
          To-Do Tasks for this Event
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            label="Add a new task"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAddTask(); }}
            size="small"
            sx={{ flex: 1 }}
          />
          <Button
            variant="contained"
            sx={{
              bgcolor: '#7F8CAA',
              color: '#EAEFEF',
              fontWeight: 700,
              borderRadius: 2,
              boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)',
              '&:hover': {
                bgcolor: '#B8CFCE',
                color: '#333446',
              },
              letterSpacing: 1
            }}
            onClick={handleAddTask}
          >
            Add
          </Button>
        </Stack>
        <List>
          {tasks.map(task => (
            <ListItem key={task.id} secondaryAction={
              <IconButton edge="end" onClick={() => handleDeleteTask(task.id)}>
                <DeleteIcon />
              </IconButton>
            }>
              <Checkbox checked={task.completed} onChange={() => handleToggleTask(task.id)} />
              <ListItemText
                primary={task.text}
                sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default EventConfirmationDetails; 