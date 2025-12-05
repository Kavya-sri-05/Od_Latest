import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const SharedNavbar = ({ title, showGuide = true, showDashboard = true }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(135deg, #0D3B66 0%, #0077B6 100%)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 1000
      }}
    >
      <Toolbar sx={{ maxWidth: '1280px', margin: '0 auto', width: '100%', px: { xs: 2, sm: 4 }, py: 1 }}>
        {/* Logo and College Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mr: 4 }}>
          <img 
            src="/logo.png" 
            alt="College Logo" 
            style={{ 
              height: '40px', 
              width: 'auto',
              objectFit: 'contain'
            }} 
          />
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Poppins', 'Inter', sans-serif",
                fontWeight: 800,
                fontSize: '1rem',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                color: '#FFFFFF !important'
              }}
            >
              CEG, Anna University
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontFamily: "'Poppins', 'Inter', sans-serif",
                fontSize: '0.6875rem',
                color: 'rgba(255, 255, 255, 0.85)',
                fontWeight: 500,
                letterSpacing: '0.02em',
                display: 'block',
                lineHeight: 1
              }}
            >
              OD Application
            </Typography>
          </Box>
        </Box>

        {/* Page Title */}
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontFamily: "'Poppins', 'Inter', sans-serif",
            fontWeight: 700,
            fontSize: '1.125rem',
            letterSpacing: '-0.01em',
            color: '#FFFFFF'
          }}
        >
          {title}
        </Typography>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {showGuide && (
            <Button 
              onClick={async () => {
                if (user) {
                  try {
                    const { default: downloadGuidePDF } = await import('./GuideMe');
                    downloadGuidePDF(user);
                  } catch (error) {
                    console.error('Error loading guide:', error);
                  }
                }
              }}
              sx={{ 
                fontFamily: "'Poppins', 'Inter', sans-serif", 
                fontWeight: 500, 
                textTransform: 'none',
                fontSize: '0.875rem',
                borderRadius: '8px',
                px: 2,
                py: 0.75,
                color: '#FFFFFF !important',
                '&:hover': { 
                  background: 'rgba(255, 255, 255, 0.15) !important',
                  transform: 'translateY(-1px)',
                  color: '#FFFFFF !important'
                },
                transition: 'all 0.2s ease',
                '& .MuiButton-label': {
                  color: '#FFFFFF !important'
                }
              }}
            >
              Guide Me
            </Button>
          )}
          {showDashboard && (
            <Button 
              onClick={() => navigate("/dashboard")}
              sx={{ 
                fontFamily: "'Poppins', 'Inter', sans-serif", 
                fontWeight: 500, 
                textTransform: 'none',
                fontSize: '0.875rem',
                borderRadius: '8px',
                px: 2,
                py: 0.75,
                color: '#FFFFFF !important',
                '&:hover': { 
                  background: 'rgba(255, 255, 255, 0.15) !important',
                  transform: 'translateY(-1px)',
                  color: '#FFFFFF !important'
                },
                transition: 'all 0.2s ease',
                '& .MuiButton-label': {
                  color: '#FFFFFF !important'
                }
              }}
            >
              Dashboard
            </Button>
          )}
          {user && (
            <Button 
              onClick={handleLogout}
              sx={{ 
                fontFamily: "'Poppins', 'Inter', sans-serif", 
                fontWeight: 600, 
                textTransform: 'none',
                fontSize: '0.875rem',
                borderRadius: '8px',
                px: 2,
                py: 0.75,
                background: 'rgba(255, 255, 255, 0.15) !important',
                color: '#FFFFFF !important',
                '&:hover': { 
                  background: 'rgba(255, 255, 255, 0.25) !important',
                  transform: 'translateY(-1px)',
                  color: '#FFFFFF !important'
                },
                transition: 'all 0.2s ease',
                ml: 1,
                '& .MuiButton-label': {
                  color: '#FFFFFF !important'
                }
              }}
            >
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default SharedNavbar;

