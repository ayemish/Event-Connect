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
    <Box sx={{ minHeight: '100vh', bgcolor: '#f9f9f9', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Paper elevation={4} sx={{ p: 4, maxWidth: 600, width: '100%', mt: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          {confirmation.customerName} &mdash; {event.name}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={2}>
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
          <Typography variant="body2" color="text.secondary">
            Confirmed on: {new Date(confirmation.timestamp).toLocaleString()}
          </Typography>
        </Stack>
        <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/notifications')}>
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
          <Button variant="contained" onClick={handleAddTask}>Add</Button>
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