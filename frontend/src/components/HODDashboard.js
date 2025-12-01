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
  AppBar,
  Toolbar,
  Backdrop,
  EmptyState,
} from "@mui/material";
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
    <Box display="flex" flexDirection="column" minHeight="100vh">
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
          <Typography variant="h5">Processing...</Typography>
          {errorInfo && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorInfo}
            </Alert>
          )}
        </Box>
      </Backdrop>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            HOD Dashboard
          </Typography>
          <Button
            color="inherit"
            onClick={() => navigate("/guide")}
            sx={{ mr: 2 }}
          >
            Guide Me
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate("/dashboard")}
            sx={{ mr: 2 }}
          >
            Dashboard
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ flex: 1 }}>
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            HOD Dashboard - Pending OD Requests
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
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
              <CircularProgress />
            </Box>
          ) : requests.length === 0 ? (
            <Paper
              elevation={3}
              sx={{
                p: 4,
                textAlign: "center",
                backgroundColor: "#ffffff",
                borderLeft: "5px solid #1976d2",
              }}
            >
              <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: "bold" }}>
                No Pending Requests
              </Typography>
              <Typography variant="body1" color="primary" sx={{ opacity: 0.8 }}>
                All OD requests have been processed. There are no pending requests
                waiting for your approval.
              </Typography>
            </Paper>
          ) : (
            <TableContainer component={Paper}>
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
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleReject(request._id)}
                            disabled={actionLoading}
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
        </Box>

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
            <Button onClick={handleDialogClose} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              onClick={() => handleSubmit(action)}
              color={action === "approve" ? "success" : "error"}
              variant="contained"
              disabled={actionLoading}
            >
              {actionLoading ? "Processing..." : (action === "approve" ? "Approve" : "Reject")}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default HODDashboard;
