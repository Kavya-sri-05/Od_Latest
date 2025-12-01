import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert, CircularProgress, Backdrop } from '@mui/material';
import axios from 'axios';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (step === 2) {
      setOtp("");
      setPassword("");
      setConfirmPassword("");
    }
  }, [step]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/api/forgot-password/request-otp', { email });
      setLoading(false);
      if (response.data.success) {
        setStep(2);
        setMessage('OTP sent to your email.');
      } else {
        setError(response.data.error || 'Unable to process request.');
      }
    } catch (err) {
      setLoading(false);
      setError('Server error. Please try again later.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/api/forgot-password/reset-password', { email, otp, password });
      setLoading(false);
      if (response.data.success) {
        setMessage('Password reset successful. You can now log in.');
        setStep(3);
      } else {
        setError(response.data.error || 'Unable to reset password.');
      }
    } catch (err) {
      setLoading(false);
      setError('Server error. Please try again later.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Paper elevation={3} sx={{ p: 4, mt: 8, background: 'linear-gradient(135deg, #4a90e2 0%, #283e51 100%)' }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ color: '#fff', fontWeight: 700 }}>
          Forgot User / Set New Password
        </Typography>
        {step === 1 && (
          <Box component="form" onSubmit={handleRequestOtp}>
            <TextField
              fullWidth
              label="Enter your registered email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              disabled={loading}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Send OTP'}
            </Button>
          </Box>
        )}
        {step === 2 && (
          <Box component="form" onSubmit={handleResetPassword}>
            <TextField
              fullWidth
              label="Enter OTP from email"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Enter new password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              autoComplete="new-password"
            />
            <TextField
              fullWidth
              label="Re-enter new password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              autoComplete="new-password"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Reset Password'}
            </Button>
          </Box>
        )}
        {step === 3 && (
          <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>
        )}
        {message && step !== 3 && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
