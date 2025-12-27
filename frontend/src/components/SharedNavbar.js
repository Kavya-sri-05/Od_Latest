import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../contexts/AuthContext";

const SharedNavbar = ({ title, showGuide = true, showDashboard = true }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showContributors, setShowContributors] = useState(false);
  const [ContribComponent, setContribComponent] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #0D3B66 0%, #0077B6 100%)",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          zIndex: 1000,
        }}
      >
        <Toolbar
          sx={{
            maxWidth: "1280px",
            margin: "0 auto",
            width: "100%",
            px: { xs: 2, sm: 4 },
            py: 1,
          }}
        >
          {/* Logo and College Name */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mr: 4 }}>
            <img
              src="/logo.png"
              alt="College Logo"
              style={{
                height: "40px",
                width: "auto",
                objectFit: "contain",
              }}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Poppins', 'Inter', sans-serif",
                  fontWeight: 800,
                  fontSize: "1rem",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  color: "#FFFFFF !important",
                }}
              >
                CEG, Anna University
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "'Poppins', 'Inter', sans-serif",
                  fontSize: "0.6875rem",
                  color: "rgba(255, 255, 255, 0.85)",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  display: "block",
                  lineHeight: 1,
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
              fontSize: "1.125rem",
              letterSpacing: "-0.01em",
              color: "#FFFFFF",
            }}
          >
            {title}
          </Typography>

          {/* Navigation Buttons */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {showGuide && (
              <>
                <Button
                  onClick={async () => {
                    if (user) {
                      try {
                        const { default: downloadGuidePDF } = await import(
                          "./GuideMe"
                        );
                        downloadGuidePDF(user);
                      } catch (error) {
                        console.error("Error loading guide:", error);
                      }
                    }
                  }}
                  sx={{
                    fontFamily: "'Poppins', 'Inter', sans-serif",
                    fontWeight: 500,
                    textTransform: "none",
                    fontSize: "0.875rem",
                    borderRadius: "8px",
                    px: 2,
                    py: 0.75,
                    color: "#FFFFFF !important",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.15) !important",
                      transform: "translateY(-1px)",
                      color: "#FFFFFF !important",
                    },
                    transition: "all 0.2s ease",
                    "& .MuiButton-label": {
                      color: "#FFFFFF !important",
                    },
                  }}
                >
                  Guide Me
                </Button>

                <Button
                  onClick={async () => {
                    // Open contributors as an in-place dialog so users stay on current page
                    setShowContributors(true);
                    if (!ContribComponent) {
                      try {
                        const mod = await import("./Contributors");
                        setContribComponent(() => mod.default);
                      } catch (err) {
                        console.error(
                          "Failed to load contributors module",
                          err
                        );
                      }
                    }
                  }}
                  sx={{
                    fontFamily: "'Poppins', 'Inter', sans-serif",
                    fontWeight: 500,
                    textTransform: "none",
                    fontSize: "0.875rem",
                    borderRadius: "8px",
                    px: 2,
                    py: 0.75,
                    color: "#FFFFFF !important",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.15) !important",
                      transform: "translateY(-1px)",
                      color: "#FFFFFF !important",
                    },
                    transition: "all 0.2s ease",
                    "& .MuiButton-label": {
                      color: "#FFFFFF !important",
                    },
                  }}
                >
                  Contributors
                </Button>
              </>
            )}
            {showDashboard && (
              <Button
                onClick={() => navigate("/dashboard")}
                sx={{
                  fontFamily: "'Poppins', 'Inter', sans-serif",
                  fontWeight: 500,
                  textTransform: "none",
                  fontSize: "0.875rem",
                  borderRadius: "8px",
                  px: 2,
                  py: 0.75,
                  color: "#FFFFFF !important",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.15) !important",
                    transform: "translateY(-1px)",
                    color: "#FFFFFF !important",
                  },
                  transition: "all 0.2s ease",
                  "& .MuiButton-label": {
                    color: "#FFFFFF !important",
                  },
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
                  textTransform: "none",
                  fontSize: "0.875rem",
                  borderRadius: "8px",
                  px: 2,
                  py: 0.75,
                  background: "rgba(255, 255, 255, 0.15) !important",
                  color: "#FFFFFF !important",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.25) !important",
                    transform: "translateY(-1px)",
                    color: "#FFFFFF !important",
                  },
                  transition: "all 0.2s ease",
                  ml: 1,
                  "& .MuiButton-label": {
                    color: "#FFFFFF !important",
                  },
                }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog
        open={showContributors}
        onClose={() => setShowContributors(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Contributors
          <IconButton onClick={() => setShowContributors(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {ContribComponent ? (
            <ContribComponent
              images={[
                {
                  filename: "Kavya Sri V.jpg",
                  name: "Kavya Sri V",
                  roll: "2023103555",
                },
                {
                  filename: "Roshni Banu S.jpg",
                  name: "Roshni Banu S",
                  roll: "2023103055",
                },
                {
                  filename: "Divapriya B.jpg",
                  name: "Divapriya B",
                  roll: "2023103572",
                },
                {
                  filename: "Abhijith M.jpg",
                  name: "Abhijith M",
                  roll: "2023103095",
                },
                {
                  filename: "Deepak R.jpg",
                  name: "Deepak R",
                  roll: "2023103527",
                },
              ]}
            />
          ) : (
            <div>Loading contributors…</div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SharedNavbar;
