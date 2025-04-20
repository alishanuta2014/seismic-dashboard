import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Box, Container, CssBaseline, Paper, Typography, Chip, CircularProgress } from '@mui/material';
import { Public as EarthIcon, Warning as WarningIcon, Timeline as ChartIcon } from '@mui/icons-material';
import MuiEventsTable from '../components/MuiEventsTable';
import SeismicMap from '../components/SeismicMap';
import MagnitudeChart from '../components/MagnitudeChart';
import DepthChart from '../components/DepthChart';
import { SeismicMessage, SeismicEvent } from '../types';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  color: 'primary' | 'warning' | 'info' | 'success' | 'error' | 'secondary';
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  
  return (
    <Paper elevation={3} sx={{ 
      p: 2, 
      borderRadius: 2, 
      height: '100%',
      flex: '1 1 0px',
      minWidth: '300px',
      m: 1
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
          <Typography variant="h5" fontWeight="bold">{value}</Typography>
        </Box>
        <Box 
          display="flex" 
          alignItems="center" 
          justifyContent="center" 
          width={40} 
          height={40} 
          borderRadius="50%" 
          bgcolor={`${color}.light`}
          color={`${color}.dark`}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
};

const Dashboard: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  const [events, setEvents] = useState<SeismicEvent[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    maxMagnitude: 0,
    lastEventTime: ''
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem('isAuthenticated', 'false');
    navigate('/login');
  };

  useEffect(() => {
    const sock = new SockJS('https://www.seismicportal.eu/standing_order');

    sock.onopen = () => setConnectionStatus('connected');
    sock.onclose = () => setConnectionStatus('disconnected');
    sock.onerror = () => setConnectionStatus('error');

    sock.onmessage = (e) => {
      try {
        const msg: SeismicMessage = JSON.parse(e.data);
    
        if (msg.action === 'create') {
          const newEvent: SeismicEvent = {
            id: msg.data.id,
            time: msg.data.properties.time,
            lat: msg.data.properties.lat,
            lon: msg.data.properties.lon,
            depth: msg.data.properties.depth,
            mag: msg.data.properties.mag,
            magtype: msg.data.properties.magtype,
            region: msg.data.properties.flynn_region,
            auth: msg.data.properties.auth
          };
    
          setEvents(prevEvents => {
            const newEvents = [newEvent, ...prevEvents];
            return newEvents.slice(0, 200);
          });
    
          setStats(prevStats => ({
            total: prevStats.total + 1,
            maxMagnitude: Math.max(prevStats.maxMagnitude, newEvent.mag),
            lastEventTime: new Date(newEvent.time).toLocaleTimeString()
          }));
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    return () => {
      sock.close();
    }
  }, []);

  return (
    <>
      <CssBaseline />
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', p: 3 }}>
        <Container maxWidth="xl">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 4,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Typography variant="h4" component="h1" sx={{ 
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <EarthIcon style={{ fontSize: '2rem' }} />
              Seismic Dashboard
            </Typography>
            <Chip 
              label={`Status: ${connectionStatus}`}
              color={
                connectionStatus === 'connected' ? 'success' : 
                connectionStatus === 'error' ? 'error' : 'default'
              }
              icon={connectionStatus === 'connected' ? 
                <CircularProgress size={14} color="inherit" /> : 
                <WarningIcon />
              }
            />
            <Button 
                variant="contained"
                color="error"
                onClick={handleLogout}
                sx={{ ml: 2 }}
              >
              Logout
            </Button>
          </Box>

          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            mb: 4,
            '& > *': {
              flex: '1 1 300px'
            }
          }}>
            <StatCard 
              title="Total Events" 
              value={stats.total} 
              icon={<EarthIcon />}
              color="primary"
            />
            <StatCard 
              title="Max Magnitude" 
              value={stats.maxMagnitude.toFixed(1)} 
              icon={<WarningIcon />}
              color="warning"
            />
            <StatCard 
              title="Last Event" 
              value={stats.lastEventTime || 'None'} 
              icon={<ChartIcon />}
              color="info"
            />
          </Box>

          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}>
            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              '& > *': {
                flex: '1 1 600px'
              }
            }}>
              <Paper sx={{ 
                p: 2, 
                height: '100%',
                borderRadius: 2,
                minWidth: '800px',
                flex: '2 1 800px'
              }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Earthquake Map</Typography>
                <Box sx={{ height: 500 }}>
                  <SeismicMap events={events} />
                </Box>
              </Paper>

              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                flex: '1 1 400px'
              }}>
                <Paper sx={{ 
                  p: 2,
                  borderRadius: 2,
                  flex: 1
                }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Magnitude Distribution</Typography>
                  <Box sx={{ height: 240 }}>
                    <MagnitudeChart events={events} />
                  </Box>
                </Paper>
                <Paper sx={{ 
                  p: 2,
                  borderRadius: 2,
                  flex: 1
                }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Depth Analysis</Typography>
                  <Box sx={{ height: 240 }}>
                    <DepthChart events={events} />
                  </Box>
                </Paper>
              </Box>
            </Box>

            <Paper sx={{ 
              p: 3,
              borderRadius: 2
            }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Recent Earthquakes</Typography>
              <MuiEventsTable events={events} />
            </Paper>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;