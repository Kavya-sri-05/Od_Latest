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
  Autocomplete,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import SharedNavbar from "./SharedNavbar";
import { Download as DownloadIcon } from "@mui/icons-material";
import axios from "axios";

const ODRequestList = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [proofDialogOpen, setProofDialogOpen] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [viewProofDialogOpen, setViewProofDialogOpen] = useState(false);
  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    fetchRequests();
    fetchFacultyList();
  }, []);

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
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      const res = await axios.get(
        "http://localhost:5001/api/od-requests/student",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-auth-token": token,
          },
        }
      );
      console.log("Fetched requests:", res.data); // Debug log
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError(err.response?.data?.message || "Error fetching requests");
    }
  };

  const fetchFacultyList = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      const response = await axios.get(
        "http://localhost:5001/api/users/faculty",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-auth-token": token,
          },
        }
      );
      setFacultyList(response.data);
    } catch (error) {
      console.error("Error fetching faculty list:", error);
      setError("Failed to fetch faculty list");
    }
  };

  const handleProofSubmit = async () => {
    if (!proofFile) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("proofDocument", proofFile);
    formData.append(
      "notifyFaculty",
      JSON.stringify(selectedFaculty.map((f) => f._id))
    );

    try {
      const response = await axios.post(
        `http://localhost:5001/api/od-requests/${selectedRequest._id}/submit-proof`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );

      setRequests(
        requests.map((req) =>
          req._id === response.data._id ? response.data : req
        )
      );
      setProofDialogOpen(false);
      setProofFile(null);
      setSelectedFaculty([]);
    } catch (error) {
      console.error("Error submitting proof:", error);
    }
  };

  const handleDownloadPDF = async (requestId) => {
    try {
      setActionLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please login again.");
        setActionLoading(false);
        return;
      }

      const response = await axios.get(
        `http://localhost:5001/api/od-requests/${requestId}/download-approved-pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-auth-token": token,
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `od_request_${requestId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      setActionLoading(false);
    } catch (err) {
      setActionLoading(false);
      let msg = "";
      if (err.response) {
        msg = err.response.data.message || "Error downloading PDF.";
      } else if (err.request) {
        msg = "No response from server. Please check your connection.";
      } else {
        msg = `Error downloading PDF: "${err.message}"`;
      }
      setError(msg);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  // Update the handleSubmitProof function
  const handleSubmitProof = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("proofDocument", selectedFile);
    formData.append(
      "notifyFaculty",
      JSON.stringify(selectedFaculty.map((f) => f._id))
    );

    try {
      setActionLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5001/api/od-requests/${selectedRequest._id}/submit-proof`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            "x-auth-token": token,
          },
        }
      );

      setSuccess(
        "Proof submitted successfully to class advisor and admin for approval"
      );
      setRequests(
        requests.map((req) =>
          req._id === response.data._id ? response.data : req
        )
      );
      handleCloseProofDialog();
      fetchRequests();
      setActionLoading(false);
    } catch (error) {
      setActionLoading(false);
      let msg = "";
      if (error.response) {
        msg = error.response.data.message || "Error submitting proof.";
      } else if (error.request) {
        msg = "No response from server. Please check your connection.";
      } else {
        msg = `Error submitting proof: "${error.message}"`;
      }
      setError(msg);
    }
  };
  const handleCloseProofDialog = () => {
    setProofDialogOpen(false);
    setProofFile(null);
    setSelectedFaculty([]);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Only PDF files are allowed for proof submission.");
        setSelectedFile(null);
        return;
      }
      setError("");
      setSelectedFile(file);
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

  return (
    <>
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
          <Typography variant="h5">Processing...</Typography>
        </Box>
      </Backdrop>
      <Box
        display="flex"
        flexDirection="column"
        minHeight="100vh"
        sx={{ background: "#F8FAFC" }}
      >
        <SharedNavbar title="My OD Requests" />
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
              My OD Requests
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
                    <TableCell>Event Name</TableCell>
                    <TableCell>Event Date</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Class Advisor</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Proof Verification Status</TableCell>
                    <TableCell>Brochure</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell>{request.eventName}</TableCell>
                      <TableCell>
                        {new Date(request.eventDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(request.startDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(request.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{request.classAdvisor.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={request.status}
                          color={getStatusColor(request.status)}
                          size="small"
                        />
                      </TableCell>
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
                        <Box sx={{ display: "flex", gap: 1 }}>
                          {request.status === "approved_by_hod" &&
                            !request.proofSubmitted && (
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setProofDialogOpen(true);
                                }}
                                sx={{
                                  background:
                                    "linear-gradient(135deg, #0D3B66 0%, #0077B6 100%)",
                                  color: "#FFFFFF",
                                  "&:hover": {
                                    background:
                                      "linear-gradient(135deg, #0a2d4d 0%, #006699 100%)",
                                    color: "#FFFFFF",
                                  },
                                }}
                              >
                                Submit Proof
                              </Button>
                            )}
                          {request.status === "approved_by_hod" && (
                            <Button
                              variant="contained"
                              color="secondary"
                              size="small"
                              onClick={() => handleDownloadPDF(request._id)}
                              startIcon={<DownloadIcon />}
                              sx={{
                                background: "#6B7280",
                                color: "#FFFFFF",
                                "&:hover": {
                                  background: "#4B5563",
                                  color: "#FFFFFF",
                                },
                              }}
                            >
                              Download PDF
                            </Button>
                          )}
                          {request.proofDocument && (
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
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            <Dialog
              open={proofDialogOpen}
              onClose={handleCloseProofDialog}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Submit Proof Document for Verification</DialogTitle>
              <DialogContent>
                <Box sx={{ mt: 2 }}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Your proof will be sent to both your class advisor and admin
                    for approval. Once either approves, notifications will be
                    sent to all selected staff.
                  </Alert>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    style={{ marginBottom: "1rem" }}
                  />
                  <Autocomplete
                    multiple
                    options={facultyList}
                    getOptionLabel={(option) => option.name}
                    value={selectedFaculty}
                    onChange={(event, newValue) => {
                      setSelectedFaculty(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Faculty to Notify"
                        placeholder="Select faculty members"
                        fullWidth
                      />
                    )}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseProofDialog}
                  sx={{ color: "#1A1F36" }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitProof}
                  variant="contained"
                  color="primary"
                  sx={{
                    background:
                      "linear-gradient(135deg, #0D3B66 0%, #0077B6 100%)",
                    color: "#FFFFFF",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #0a2d4d 0%, #006699 100%)",
                      color: "#FFFFFF",
                    },
                  }}
                >
                  Submit
                </Button>
              </DialogActions>
            </Dialog>

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
                    background:
                      "linear-gradient(135deg, #0D3B66 0%, #0077B6 100%)",
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
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default ODRequestList;
