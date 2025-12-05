import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    setLoading(false);
    
    if (result.success) {
      // Navigate based on user role
      navigate('/dashboard');
    } else {
      setError(result.error);
      setShowErrorDialog(true);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #F8FAFC 0%, #E6F4F8 50%, #F1F5F9 100%)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-10%',
        width: '600px',
        height: '600px',
        background: 'linear-gradient(135deg, rgba(13, 59, 102, 0.1) 0%, rgba(0, 119, 182, 0.05) 100%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        left: '-10%',
        width: '500px',
        height: '500px',
        background: 'linear-gradient(135deg, rgba(0, 119, 182, 0.08) 0%, rgba(0, 168, 232, 0.05) 100%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        zIndex: 0
      }} />

      {/* Loading Backdrop */}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(13, 59, 102, 0.8)',
        }}
        open={loading}
      >
        <CircularProgress color="inherit" size={48} />
      </Backdrop>

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper elevation={0} sx={{ 
          p: { xs: 3, sm: 5 }, 
          borderRadius: '24px', 
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.8)'
        }}>
          {/* Logo/Header Section */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ 
              color: '#0D3B66', 
              fontWeight: 800, 
              mb: 1,
              fontSize: { xs: '1.75rem', sm: '2rem' },
              letterSpacing: '-0.02em'
            }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ 
              color: '#6B7280', 
              fontSize: '0.9375rem',
              fontWeight: 400
            }}>
              Sign in to your account to continue
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  fontSize: '0.9375rem',
                  '&:hover fieldset': {
                    borderColor: '#0077B6',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0077B6',
                    borderWidth: '2px',
                  }
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.9375rem',
                  fontWeight: 500
                }
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              sx={{ 
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  fontSize: '0.9375rem',
                  '&:hover fieldset': {
                    borderColor: '#0077B6',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0077B6',
                    borderWidth: '2px',
                  }
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.9375rem',
                  fontWeight: 500
                }
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ 
                py: 1.75,
                mb: 3,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0D3B66 0%, #0077B6 50%, #00A8E8 100%)',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                letterSpacing: '-0.01em',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0a2d4d 0%, #006699 50%, #0099cc 100%)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  background: '#9CA3AF',
                },
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
            
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Link 
                to="/forgot-password" 
                style={{ 
                  textDecoration: 'none', 
                  color: '#0077B6', 
                  fontWeight: 500, 
                  fontSize: '0.875rem',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#0D3B66'}
                onMouseLeave={(e) => e.target.style.color = '#0077B6'}
              >
                Forgot Password?
              </Link>
            </Box>
            
            <Box sx={{ 
              textAlign: 'center', 
              pt: 3,
              borderTop: '1px solid #E5E7EB'
            }}>
              <Typography variant="body2" sx={{ 
                color: '#6B7280',
                fontSize: '0.875rem'
              }}>
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  style={{ 
                    color: '#0077B6', 
                    fontWeight: 600, 
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#0D3B66'}
                  onMouseLeave={(e) => e.target.style.color = '#0077B6'}
                >
                  Create Account
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Error Dialog */}
      <Dialog
        open={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: '#d32f2f',
            fontFamily: "'Poppins', 'Lato', sans-serif",
          }}
        >
          <ErrorOutlineIcon />
          Login Failed
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: '#4B4B4B', fontFamily: "'Poppins', 'Lato', sans-serif" }}>
            {error}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowErrorDialog(false)}
            variant="contained"
            sx={{ backgroundColor: '#0077B6', '&:hover': { backgroundColor: '#0D3B66' } }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Login;