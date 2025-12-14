import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
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
  Box,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import SharedNavbar from "./SharedNavbar";
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import axios from "axios";
import Contributors from "./Contributors";

const FacultyODRequestList = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [comment, setComment] = useState("");
  const [approverName, setApproverName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [action, setAction] = useState("");
  const [viewProofDialogOpen, setViewProofDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      console.log("Fetching faculty requests...");
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      const res = await axios.get(
        "http://localhost:5001/api/od-requests/faculty",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Faculty requests response:", res.data);
      if (res.data) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError(err.response?.data?.message || "Error fetching requests");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = (requestId) => {
    setSelectedRequest(requestId);
    setAction("approve");
    setOpenDialog(true);
  };

  const handleReject = (requestId) => {
    setSelectedRequest(requestId);
    setAction("reject");
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setComment("");
    setApproverName("");
    setSelectedRequest(null);
    setAction("");
  };

  const handleSubmit = async () => {
    try {
      setActionLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please login again.");
        setActionLoading(false);
        return;
      }

      const endpoint =
        action === "approve" ? "advisor-approve" : "advisor-reject";
      const res = await axios.put(
        `http://localhost:5001/api/od-requests/${selectedRequest}/${endpoint}`,
        { comment, approverName },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      setSuccess(`Request ${action}d successfully`);
      handleDialogClose();
      setActionLoading(false);
      fetchRequests();
    } catch (err) {
      setActionLoading(false);
      let msg = "";
      if (err.response) {
        msg = err.response.data.message || `Error ${action}ing request.`;
      } else if (err.request) {
        msg = "No response from server. Please check your connection.";
      } else {
        msg = `Error ${action}ing request: "${err.message}"`;
      }
      setError(msg);
    }
  };

  const getStatusChip = (status) => {
    const statusColors = {
      pending: "warning",
      approved_by_advisor: "info",
      approved_by_hod: "success",
      rejected: "error",
    };

    return (
      <Chip
        label={status.replace(/_/g, " ").toUpperCase()}
        color={statusColors[status]}
        size="small"
      />
    );
  };

  const handleProofVerification = async (requestId, verified) => {
    try {
      setActionLoading(true);
      setError("");
      await axios.put(
        `http://localhost:5001/api/od-requests/${requestId}/verify-proof`,
        { verified },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccess(`Proof ${verified ? "verified" : "rejected"} successfully`);
      setActionLoading(false);
      fetchRequests();
    } catch (err) {
      setActionLoading(false);
      let msg = "";
      if (err.response) {
        msg =
          err.response.data.message ||
          err.response.data.msg ||
          "Error verifying proof.";
      } else if (err.request) {
        msg = "No response from server. Please check your connection.";
      } else {
        msg = `Error verifying proof: "${err.message}"`;
      }
      setError(msg);
    }
  };

  const handleViewProof = (proofPath) => {
    if (!proofPath) {
      setError("No proof document available");
      return;
    }
    setSelectedRequest({ proofDocument: proofPath });
    setViewProofDialogOpen(true);
  };

  const getProofVerificationChip = (proofVerified, proofRejected) => {
    if (proofRejected) {
      return <Chip label="REJECTED" color="error" size="small" />;
    } else if (proofVerified) {
      return <Chip label="VERIFIED" color="success" size="small" />;
    } else {
      return <Chip label="PENDING" color="warning" size="small" />;
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      sx={{ background: "#F8FAFC" }}
    >
      {/* Full-screen Processing Backdrop for all actions */}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(13, 59, 102, 0.8)",
        }}
        open={actionLoading}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <CircularProgress color="inherit" size={60} />
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Poppins', 'Inter', sans-serif",
              fontWeight: 600,
            }}
          >
            Processing...
          </Typography>
        </Box>
      </Backdrop>
      <SharedNavbar title="Faculty Dashboard" />
      <Container maxWidth="lg" sx={{ flex: 1, py: 4, px: { xs: 2, sm: 3 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            mt: 4,
            borderRadius: "16px",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "1px solid #E5E7EB",
            background: "#FFFFFF",
            overflow: "hidden",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: "#1A1F36",
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: "1.75rem", sm: "2rem" },
              letterSpacing: "-0.02em",
              fontFamily: "'Poppins', 'Inter', sans-serif",
            }}
          >
            Faculty Dashboard
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: "12px",
                fontFamily: "'Poppins', 'Inter', sans-serif",
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
                borderRadius: "12px",
                fontFamily: "'Poppins', 'Inter', sans-serif",
              }}
            >
              {success}
            </Alert>
          )}

          <Box
            sx={{
              width: "100%",
              overflowX: "auto",
              overflowY: "hidden",
              WebkitOverflowScrolling: "touch",
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
            }}
          >
            <Table sx={{ minWidth: 1200, width: "auto" }}>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Event Name</TableCell>
                  <TableCell>Event Type</TableCell>
                  <TableCell>Event Date</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Proof Verification Status</TableCell>
                  <TableCell>Brochure</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>
                      {request.student?.user?.name ||
                        request.student?.name ||
                        "N/A"}
                    </TableCell>
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
                    <TableCell>{getStatusChip(request.status)}</TableCell>
                    <TableCell>
                      {request.proofSubmitted ? (
                        getProofVerificationChip(
                          request.proofVerified,
                          request.proofRejected
                        )
                      ) : (
                        <Chip
                          label="NOT SUBMITTED"
                          color="default"
                          size="small"
                        />
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
                          sx={{
                            ml: 1,
                            color: "#0077B6",
                            borderColor: "#0077B6",
                            "&:hover": {
                              borderColor: "#0077B6",
                              background: "rgba(0, 119, 182, 0.1)",
                              color: "#0077B6",
                            },
                          }}
                        >
                          View Brochure
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      {request.status === "pending" && (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleApprove(request._id)}
                            sx={{
                              background:
                                "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                              color: "#FFFFFF",
                              "&:hover": {
                                background:
                                  "linear-gradient(135deg, #059669 0%, #047857 100%)",
                                color: "#FFFFFF",
                              },
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleReject(request._id)}
                            sx={{
                              background:
                                "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                              color: "#FFFFFF",
                              "&:hover": {
                                background:
                                  "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
                                color: "#FFFFFF",
                              },
                            }}
                          >
                            Reject
                          </Button>
                        </Box>
                      )}
                      {request.proofSubmitted && (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          {!(
                            request.proofVerified || request.proofRejected
                          ) && (
                            <>
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() =>
                                  handleProofVerification(request._id, true)
                                }
                                sx={{
                                  background:
                                    "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                                  color: "#FFFFFF",
                                  "&:hover": {
                                    background:
                                      "linear-gradient(135deg, #059669 0%, #047857 100%)",
                                    color: "#FFFFFF",
                                  },
                                }}
                              >
                                Verify Proof
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() =>
                                  handleProofVerification(request._id, false)
                                }
                                sx={{
                                  background:
                                    "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                                  color: "#FFFFFF",
                                  "&:hover": {
                                    background:
                                      "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
                                    color: "#FFFFFF",
                                  },
                                }}
                              >
                                Reject Proof
                              </Button>
                            </>
                          )}
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() =>
                              handleViewProof(request.proofDocument)
                            }
                            sx={{
                              color: "#0077B6",
                              borderColor: "#0077B6",
                              "&:hover": {
                                borderColor: "#0077B6",
                                background: "rgba(0, 119, 182, 0.1)",
                                color: "#0077B6",
                              },
                            }}
                          >
                            View Proof
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>

        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>
            {action === "approve" ? "Approve Request" : "Reject Request"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Your Name (Class Advisor/Admin)"
              fullWidth
              value={approverName}
              onChange={(e) => setApproverName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Comment"
              fullWidth
              multiline
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleDialogClose}
              disabled={loading}
              sx={{ color: "#1A1F36" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              color={action === "approve" ? "success" : "error"}
              disabled={loading || !approverName}
              variant="contained"
              sx={{
                background:
                  action === "approve"
                    ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                    : "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                color: "#FFFFFF",
                "&:hover": {
                  background:
                    action === "approve"
                      ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
                      : "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
                  color: "#FFFFFF",
                },
                "&:disabled": {
                  background: "#9CA3AF",
                  color: "#FFFFFF",
                },
              }}
            >
              {action === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogActions>
        </Dialog>

        <>{/* This dialog was causing issues and has been removed */}</>

        <Dialog
          open={viewProofDialogOpen}
          onClose={() => setViewProofDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>View Proof Document</DialogTitle>
          <DialogContent>
            {selectedRequest?.proofDocument && (
              <Box
                sx={{
                  width: "100%",
                  height: "80vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  bgcolor: "#f5f5f5",
                  borderRadius: 1,
                  p: 2,
                }}
              >
                {selectedRequest.proofDocument
                  .toLowerCase()
                  .endsWith(".pdf") ? (
                  <iframe
                    src={`http://localhost:5001/${selectedRequest.proofDocument}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      borderRadius: "4px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                    title="Proof Document"
                  />
                ) : (
                  <img
                    src={`http://localhost:5001/${selectedRequest.proofDocument}`}
                    alt="Proof Document"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      borderRadius: "4px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  />
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setViewProofDialogOpen(false)}
              sx={{
                background: "linear-gradient(135deg, #0D3B66 0%, #0077B6 100%)",
                color: "#FFFFFF",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #0a2d4d 0%, #006699 100%)",
                  color: "#FFFFFF",
                },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default FacultyODRequestList;
