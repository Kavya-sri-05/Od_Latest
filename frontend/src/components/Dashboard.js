import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import SharedNavbar from "./SharedNavbar";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return <Typography>Loading dashboard...</Typography>;
  }

  if (!user) {
    return <Typography>Please log in to view the dashboard.</Typography>;
  }

  const renderStudentDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ 
          height: '100%', 
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
          '&:hover': { 
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            borderColor: '#0077B6'
          }
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography 
              variant="h5" 
              component="div" 
              gutterBottom 
              sx={{ 
                color: '#1A1F36', 
                fontWeight: 700,
                fontSize: '1.5rem',
                mb: 2,
                letterSpacing: '-0.01em'
              }}
            >
              New OD Request
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#6B7280', 
                mb: 3,
                fontSize: '0.9375rem',
                lineHeight: 1.6
              }}
            >
              Submit a new On Duty request for attending events or activities.
            </Typography>
          </CardContent>
          <CardActions sx={{ px: 4, pb: 4 }}>
            <Button
              size="large"
              variant="contained"
              onClick={() => navigate("/student/od-request")}
              sx={{ 
                fontFamily: "'Poppins', 'Inter', sans-serif", 
                fontWeight: 600,
                borderRadius: '12px',
                px: 3,
                py: 1.25,
                background: 'linear-gradient(135deg, #0D3B66 0%, #0077B6 100%)',
                textTransform: 'none',
                fontSize: '0.9375rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0a2d4d 0%, #006699 100%)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Create Request
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ 
          height: '100%', 
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
          '&:hover': { 
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            borderColor: '#0077B6'
          }
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography 
              variant="h5" 
              component="div" 
              gutterBottom 
              sx={{ 
                color: '#1A1F36', 
                fontWeight: 700,
                fontSize: '1.5rem',
                mb: 2,
                letterSpacing: '-0.01em'
              }}
            >
              My OD Requests
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#6B7280', 
                mb: 3,
                fontSize: '0.9375rem',
                lineHeight: 1.6
              }}
            >
              View and manage your existing OD requests.
            </Typography>
          </CardContent>
          <CardActions sx={{ px: 4, pb: 4 }}>
            <Button
              size="large"
              variant="contained"
              onClick={() => navigate("/student/my-requests")}
              sx={{ 
                fontFamily: "'Poppins', 'Inter', sans-serif", 
                fontWeight: 600,
                borderRadius: '12px',
                px: 3,
                py: 1.25,
                background: 'linear-gradient(135deg, #0D3B66 0%, #0077B6 100%)',
                textTransform: 'none',
                fontSize: '0.9375rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0a2d4d 0%, #006699 100%)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              View Requests
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );

  const renderFacultyDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card sx={{ 
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
          '&:hover': { 
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            borderColor: '#0077B6'
          }
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography 
              variant="h5" 
              component="div" 
              gutterBottom 
              sx={{ 
                color: '#1A1F36', 
                fontWeight: 700,
                fontSize: '1.5rem',
                mb: 2,
                letterSpacing: '-0.01em'
              }}
            >
              OD Requests Management
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#6B7280', 
                mb: 3,
                fontSize: '0.9375rem',
                lineHeight: 1.6
              }}
            >
              Review and manage student OD requests.
            </Typography>
          </CardContent>
          <CardActions sx={{ px: 4, pb: 4 }}>
            <Button
              size="large"
              variant="contained"
              onClick={() => navigate("/faculty/od-requests")}
              sx={{ 
                fontFamily: "'Poppins', 'Inter', sans-serif", 
                fontWeight: 600,
                borderRadius: '12px',
                px: 3,
                py: 1.25,
                background: 'linear-gradient(135deg, #0D3B66 0%, #0077B6 100%)',
                textTransform: 'none',
                fontSize: '0.9375rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0a2d4d 0%, #006699 100%)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Manage Requests
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );

  const renderHODDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card sx={{ 
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
          '&:hover': { 
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            borderColor: '#0077B6'
          }
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography 
              variant="h5" 
              component="div" 
              gutterBottom 
              sx={{ 
                color: '#1A1F36', 
                fontWeight: 700,
                fontSize: '1.5rem',
                mb: 2,
                letterSpacing: '-0.01em'
              }}
            >
              OD Requests Dashboard
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#6B7280', 
                mb: 3,
                fontSize: '0.9375rem',
                lineHeight: 1.6
              }}
            >
              View and manage OD requests from students in your department.
            </Typography>
          </CardContent>
          <CardActions sx={{ px: 4, pb: 4 }}>
            <Button
              size="large"
              variant="contained"
              onClick={() => navigate("/hod/dashboard")}
              sx={{ 
                fontFamily: "'Poppins', 'Inter', sans-serif", 
                fontWeight: 600,
                borderRadius: '12px',
                px: 3,
                py: 1.25,
                background: 'linear-gradient(135deg, #0D3B66 0%, #0077B6 100%)',
                textTransform: 'none',
                fontSize: '0.9375rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0a2d4d 0%, #006699 100%)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              View Requests
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );

  const renderAdminDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card sx={{ 
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
          '&:hover': { 
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            borderColor: '#0077B6'
          }
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography 
              variant="h5" 
              component="div" 
              gutterBottom 
              sx={{ 
                color: '#1A1F36', 
                fontWeight: 700,
                fontSize: '1.5rem',
                mb: 2,
                letterSpacing: '-0.01em'
              }}
            >
              System Administration
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#6B7280', 
                mb: 3,
                fontSize: '0.9375rem',
                lineHeight: 1.6
              }}
            >
              Manage users, departments, and system settings.
            </Typography>
          </CardContent>
          <CardActions sx={{ px: 4, pb: 4 }}>
            <Button 
              size="large" 
              variant="contained" 
              onClick={() => navigate("/admin/management")}
              sx={{ 
                fontFamily: "'Poppins', 'Inter', sans-serif", 
                fontWeight: 600,
                borderRadius: '12px',
                px: 3,
                py: 1.25,
                background: 'linear-gradient(135deg, #0D3B66 0%, #0077B6 100%)',
                textTransform: 'none',
                fontSize: '0.9375rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0a2d4d 0%, #006699 100%)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Manage System
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );

  const renderDashboardContent = () => {
    switch (user.role) {
      case "student":
        return renderStudentDashboard();
      case "faculty":
        return renderFacultyDashboard();
      case "hod":
        return renderHODDashboard();
      case "admin":
        return renderAdminDashboard();
      default:
        return null;
    }
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" sx={{ background: '#F8FAFC' }}>
      <Box sx={{ flexGrow: 1 }}>
        <SharedNavbar title="Dashboard" showDashboard={false} />
        <Container maxWidth="lg" sx={{ mt: 6, mb: 6, px: { xs: 2, sm: 3 } }}>
          {/* Welcome Section */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                color: '#1A1F36', 
                fontWeight: 800, 
                mb: 1,
                fontSize: { xs: '1.75rem', sm: '2.25rem' },
                letterSpacing: '-0.02em'
              }}
            >
              Dashboard
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#6B7280', 
                fontSize: '1.0625rem',
                fontWeight: 400
              }}
            >
              Welcome back, <span style={{ fontWeight: 600, color: '#0D3B66' }}>{user.name}</span> • {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Typography>
          </Box>
          
          {/* Dashboard Content */}
          {renderDashboardContent()}
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
