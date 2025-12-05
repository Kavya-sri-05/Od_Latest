import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  CircularProgress,
  Backdrop,
  EmptyState,
} from "@mui/material";
import SharedNavbar from "./SharedNavbar";
import axios from "axios";
import Contributors from "./Contributors";

const HODDashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [comment, setComment] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState("");
  const [action, setAction] = useState("");

  // Auto-clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Auto-clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const getProofVerificationChip = (
    proofSubmitted,
    proofVerified,
    proofRejected
  ) => {
    if (!proofSubmitted) {
      return <Chip label="NOT SUBMITTED" color="default" size="small" />;
    } else if (proofRejected) {
      return <Chip label="PROOF REJECTED" color="error" size="small" />;
    } else if (proofVerified) {
      return <Chip label="VERIFIED" color="success" size="small" />;
    } else {
      return <Chip label="PENDING VERIFICATION" color="warning" size="small" />;
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      console.log("Fetching HOD requests...");
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      const res = await axios.get("http://localhost:5001/api/od-requests/hod", {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-auth-token": token,
        },
      });

      console.log("HOD requests response:", res.data);
      if (Array.isArray(res.data)) {
        // Filter to show only requests that are:
        // 1. Approved by advisor (approved_by_advisor)
        // 2. OR forwarded to HOD (forwarded_to_hod)
        // These are the ones waiting for HOD approval
        const filteredRequests = res.data.filter(
          (request) =>
            request.status === "approved_by_advisor" ||
            request.status === "forwarded_to_hod"
        );
        setRequests(filteredRequests);
        setError("");
      } else {
        console.error("Invalid response format:", res.data);
        setError("Invalid response format from server");
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
      if (err.response) {
        console.error("Error response:", err.response.data);
        setError(err.response.data.message || "Error fetching requests");
      } else if (err.request) {
        console.error("No response received:", err.request);
        setError("No response from server. Please check your connection.");
      } else {
        console.error("Error setting up request:", err.message);
        setError("Error setting up request: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (requestId) => {
    setSelectedRequest(requestId);
    setAction("approve");
    setOpenDialog(true);
  };

  const handleReject = async (requestId) => {
    setSelectedRequest(requestId);
    setAction("reject");
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setComment("");
    setSelectedRequest(null);
    setAction("");
  };

  // Update handleSubmit function to use the correct token format
  const handleSubmit = async (submitAction) => {
    try {
      setActionLoading(true);
      setError("");
      setErrorInfo("");
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please login again.");
        setErrorInfo("No authentication token found. Please login again.");
        setActionLoading(false);
        return;
      }

      const requestBody = {
        status:
          submitAction === "approve" ? "approved_by_hod" : "rejected",
        remarks: comment,
      };

      await axios.put(
        `http://localhost:5001/api/od-requests/${selectedRequest}/hod-${submitAction}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-auth-token": token,
          },
        }
      );
      setSuccess(`Request ${submitAction}ed successfully`);
      setActionLoading(false);
      handleDialogClose();
      fetchRequests();
    } catch (err) {
      setActionLoading(false);
      let msg = "";
      if (err.response) {
        msg = err.response.data.message || `Error ${submitAction}ing request.`;
      } else if (err.request) {
        msg = "No response from server. Please check your connection.";
      } else {
        msg = `Error ${submitAction}ing request: "${err.message}"`;
      }
      setError(msg);
      setErrorInfo(msg);
    }
  };

  const getStatusChip = (status) => {
    const statusColors = {
      pending: "warning",
      approved_by_advisor: "info",
      approved_by_hod: "success",
      rejected: "error",
      forwarded_to_hod: "primary",
    };

    return (
      <Chip
        label={status.replace(/_/g, " ").toUpperCase()}
        color={statusColors[status]}
        size="small"
      />
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" sx={{ background: '#F8FAFC' }}>
      {/* Loading Backdrop with Spinner */}
      {/* Full-screen Processing Backdrop for all actions */}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
        open={actionLoading}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
          <CircularProgress color="inherit" size={60} />
          <Typography 
            variant="h5"
            sx={{ fontFamily: "'Poppins', 'Inter', sans-serif", fontWeight: 600 }}
          >
            Processing...
          </Typography>
          {errorInfo && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: 2,
                borderRadius: '12px',
                fontFamily: "'Poppins', 'Inter', sans-serif"
              }}
            >
              {errorInfo}
            </Alert>
          )}
        </Box>
      </Backdrop>

      <SharedNavbar title="HOD Dashboard" />
      <Container maxWidth="lg" sx={{ flex: 1, py: 4, px: { xs: 2, sm: 3 } }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 3, sm: 4 }, 
            mt: 4,
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid #E5E7EB',
            background: '#FFFFFF'
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{ 
              color: '#1A1F36',
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: '1.75rem', sm: '2rem' },
              letterSpacing: '-0.02em',
              fontFamily: "'Poppins', 'Inter', sans-serif"
            }}
          >
            HOD Dashboard - Pending OD Requests
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: '12px',
                fontFamily: "'Poppins', 'Inter', sans-serif"
              }}
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3,
                borderRadius: '12px',
                fontFamily: "'Poppins', 'Inter', sans-serif"
              }}
            >
              {success}
            </Alert>
          )}

          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="60vh"
            >
              <CircularProgress sx={{ color: '#0077B6' }} />
            </Box>
          ) : requests.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: "center",
                background: 'linear-gradient(135deg, #0D3B66 0%, #0077B6 100%)',
                borderRadius: '16px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
            >
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{
                  color: '#FFFFFF !important',
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  mb: 2,
                  fontFamily: "'Poppins', 'Inter', sans-serif",
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}
              >
                No Pending Requests
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#FFFFFF !important',
                  fontSize: '1rem',
                  fontFamily: "'Poppins', 'Inter', sans-serif",
                  lineHeight: 1.6,
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                }}
              >
                All OD requests have been processed. There are no pending requests
                waiting for your approval.
              </Typography>
            </Paper>
          ) : (
            <TableContainer 
              component={Paper}
              sx={{
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                overflow: 'hidden',
                boxShadow: 'none'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell>
                      <strong>Student Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Year</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Event Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Event Type</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Event Date</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Start Date</strong>
                    </TableCell>
                    <TableCell>
                      <strong>End Date</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Reason</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Advisor Comment</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Proof Verification</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Brochure</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Actions</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request._id} hover>
                      <TableCell>{request.student?.name || "N/A"}</TableCell>
                      <TableCell>
                        {request.student?.currentYear || "N/A"}
                      </TableCell>
                      <TableCell>{request.eventName}</TableCell>
                      <TableCell>{request.eventType}</TableCell>
                      <TableCell>
                        {request.eventDate
                          ? new Date(request.eventDate).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {request.startDate
                          ? new Date(request.startDate).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {request.endDate
                          ? new Date(request.endDate).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>{request.reason}</TableCell>
                      <TableCell>{request.advisorComment || "-"}</TableCell>
                      <TableCell>{getStatusChip(request.status)}</TableCell>
                      <TableCell>
                        {getProofVerificationChip(
                          request.proofSubmitted,
                          request.proofVerified,
                          request.proofRejected
                        )}
                      </TableCell>
                      <TableCell>
                        {request.brochure && (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() =>
                              window.open(
                                `http://localhost:5001/${request.brochure}`,
                                "_blank"
                              )
                            }
                            sx={{ ml: 1 }}
                          >
                            View Brochure
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleApprove(request._id)}
                            disabled={actionLoading}
                            sx={{
                              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                              color: '#FFFFFF',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                color: '#FFFFFF'
                              },
                              '&:disabled': {
                                background: '#9CA3AF',
                                color: '#FFFFFF'
                              }
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleReject(request._id)}
                            disabled={actionLoading}
                            sx={{
                              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                              color: '#FFFFFF',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
                                color: '#FFFFFF'
                              },
                              '&:disabled': {
                                background: '#9CA3AF',
                                color: '#FFFFFF'
                              }
                            }}
                          >
                            Reject
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>

      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {action === "approve" ? "Approve Request" : "Reject Request"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Comment (Optional)"
              fullWidth
              multiline
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add any remarks..."
              disabled={actionLoading}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleDialogClose} 
              disabled={actionLoading}
              sx={{ color: '#1A1F36' }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSubmit(action)}
              color={action === "approve" ? "success" : "error"}
              variant="contained"
              disabled={actionLoading}
              sx={{
                background: action === "approve" 
                  ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                color: '#FFFFFF',
                '&:hover': {
                  background: action === "approve"
                    ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                    : 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
                  color: '#FFFFFF'
                },
                '&:disabled': {
                  background: '#9CA3AF',
                  color: '#FFFFFF'
                }
              }}
            >
              {actionLoading ? "Processing..." : (action === "approve" ? "Approve" : "Reject")}
            </Button>
          </DialogActions>
        </Dialog>
    </Box>
  );
};

export default HODDashboard;
