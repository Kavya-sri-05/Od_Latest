import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import SharedNavbar from "./SharedNavbar";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

const ODRequestForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "",
    eventDate: null,
    startDate: null,
    endDate: null,
    reason: "",
    timeType: "fullDay",
    startTime: null,
    endTime: null,
    isEmergency: false, // <-- add emergency flag
  });
  const defaultEventTypes = [
    "hackathon",
    "conference",
    "symposium",
    "sports",
    "NSS",
    "workshop",
  ];

  const [eventTypes, setEventTypes] = useState(defaultEventTypes);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [brochureFile, setBrochureFile] = useState(null);
  const [brochureError, setBrochureError] = useState("");
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [requestedEventType, setRequestedEventType] = useState("");
  const [requestEventTypeMsg, setRequestEventTypeMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const brochureInputRef = useRef(null);

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/settings/event-types",
          {
            headers: { "x-auth-token": localStorage.getItem("token") },
          }
        );
        // Merge backend and default event types, remove duplicates
        const backendTypes =
          Array.isArray(res.data.eventTypes) && res.data.eventTypes.length > 0
            ? res.data.eventTypes
            : [];
        const mergedTypes = Array.from(
          new Set([...defaultEventTypes, ...backendTypes])
        );
        setEventTypes(mergedTypes);
      } catch (err) {
        setEventTypes(defaultEventTypes);
      }
    };
    fetchEventTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    
  };

  const handleDateChange = (field) => (date) => {
    setFormData({
      ...formData,
      [field]: date,
    });
  };

  const handleTimeChange = (field) => (time) => {
    setFormData({
      ...formData,
      [field]: time,
    });
  };

  const handleBrochureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        setBrochureError("Only PDF files are allowed for brochure.");
        setBrochureFile(null);
        return;
      }
      if (file.size > 1 * 1024 * 1024) {
        setBrochureError("Brochure file size must be less than 1MB. Please choose a smaller file.");
        setBrochureFile(null);
        return;
      }
      setBrochureError("");
      setBrochureFile(file);
    }
  };

  // Modify handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Frontend validation for required fields
    if (
      !formData.eventName ||
      !formData.eventType ||
      !formData.eventDate ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.reason
    ) {
      setError("Please fill all required fields.");
      return;
    }

    // prevent submission if brochure has an error
    if (brochureError) {
      setError("Please fix brochure upload before submitting.");
      return;
    }
    try {
      setIsSubmitting(true);
      const form = new FormData();
      let eventNameToSend = formData.eventName;
      if (formData.isEmergency && !eventNameToSend.toLowerCase().includes("(emergency)")) {
        eventNameToSend += " (Emergency Request)";
      }
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === "eventName") {
            form.append(key, eventNameToSend);
          } else {
            form.append(key, value);
          }
        }
      });
      if (brochureFile) {
        form.append("brochure", brochureFile);
      }
      // Only append faculty advisor ID
      form.append("facultyAdvisor", user?.student?.facultyAdvisor?._id || "");

      // Emergency flag is sent to backend
      // Backend should handle status/timestamp update
      const response = await axios.post(
        "http://localhost:5001/api/od-requests",
        form,
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccess("OD request submitted successfully");
      setFormData({
        eventName: "",
        eventType: "",
        eventDate: null,
        startDate: null,
        endDate: null,
        reason: "",
        timeType: "fullDay",
        startTime: null,
        endTime: null,
        isEmergency: false,
      });
      setBrochureFile(null);
      // Clear file input
      if (brochureInputRef.current) {
        brochureInputRef.current.value = "";
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error submitting OD request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" sx={{ background: '#F8FAFC' }}>
      <SharedNavbar title="Submit OD Request" />
      <Container maxWidth="md" sx={{ flex: 1, py: 4, px: { xs: 2, sm: 3 } }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 3, sm: 5 }, 
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
            align="center"
            sx={{ 
              color: '#1A1F36',
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: '1.75rem', sm: '2rem' },
              letterSpacing: '-0.02em'
            }}
          >
            Submit OD Request
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

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Name"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    fontSize: '0.9375rem',
                    '&:hover fieldset': { borderColor: '#0077B6' },
                    '&.Mui-focused fieldset': { borderColor: '#0077B6', borderWidth: '2px' }
                  },
                  '& .MuiInputLabel-root': { fontSize: '0.9375rem', fontWeight: 500 }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FormControl fullWidth required>
                  <InputLabel id="event-type-label">Event Type</InputLabel>
                  <Select
                    labelId="event-type-label"
                    id="eventType"
                    name="eventType"
                    value={formData.eventType}
                    label="Event Type"
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="" disabled>
                      Select Event Type
                    </MenuItem>
                    {eventTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Tooltip title="Request new event type">
                  <IconButton
                    size="small"
                    sx={{ ml: 1 }}
                    onClick={() => setRequestDialogOpen(true)}
                  >
                    <AddCircleOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <DatePicker
                label="Event Date"
                value={formData.eventDate}
                onChange={handleDateChange("eventDate")}
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={handleDateChange("startDate")}
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={handleDateChange("endDate")}
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <Typography variant="subtitle1" gutterBottom>
                  Time Selection
                </Typography>
                <RadioGroup
                  row
                  name="timeType"
                  value={formData.timeType}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="fullDay"
                    control={<Radio />}
                    label="Full Day"
                  />
                  <FormControlLabel
                    value="particularHours"
                    control={<Radio />}
                    label="Particular Hours"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            {formData.timeType === "particularHours" && (
              <>
                <Grid item xs={12} sm={6}>
                  <TimePicker
                    label="From Time"
                    value={formData.startTime}
                    onChange={handleTimeChange("startTime")}
                    slotProps={{
                      textField: { fullWidth: true, required: true },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TimePicker
                    label="To Time"
                    value={formData.endTime}
                    onChange={handleTimeChange("endTime")}
                    slotProps={{
                      textField: { fullWidth: true, required: true },
                    }}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                multiline
                rows={4}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    fontSize: '0.9375rem',
                    '&:hover fieldset': { borderColor: '#0077B6' },
                    '&.Mui-focused fieldset': { borderColor: '#0077B6', borderWidth: '2px' }
                  },
                  '& .MuiInputLabel-root': { fontSize: '0.9375rem', fontWeight: 500 }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography 
                variant="subtitle1" 
                gutterBottom
                sx={{
                  color: '#1A1F36',
                  fontWeight: 600,
                  mb: 2,
                  fontFamily: "'Poppins', 'Inter', sans-serif"
                }}
              >
                Upload Event Brochure (PDF, max 1MB)
              </Typography>
              <input
                ref={brochureInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleBrochureChange}
                style={{ 
                  marginBottom: "1rem",
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: '2px solid #E5E7EB',
                  width: '100%',
                  fontFamily: "'Poppins', 'Inter', sans-serif"
                }}
              />
              {brochureError && (
                <Alert 
                  severity="warning" 
                  sx={{ 
                    mt: 1, 
                    mb: 1,
                    borderRadius: '12px',
                    fontFamily: "'Poppins', 'Inter', sans-serif"
                  }}
                >
                  {brochureError}
                </Alert>
              )}
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <input
                    type="checkbox"
                    name="isEmergency"
                    checked={formData.isEmergency}
                    onChange={handleChange}
                    style={{ marginRight: 8, width: '18px', height: '18px' }}
                  />
                }
                label="Emergency (Directly forward to Admin)"
                sx={{
                  fontFamily: "'Poppins', 'Inter', sans-serif",
                  color: '#1A1F36',
                  fontWeight: 500
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={!!brochureError || isSubmitting}
                sx={{
                  py: 1.75,
                  mt: 2,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0D3B66 0%, #0077B6 100%)',
                  color: '#FFFFFF',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontFamily: "'Poppins', 'Inter', sans-serif",
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0a2d4d 0%, #006699 100%)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-2px)',
                    color: '#FFFFFF'
                  },
                  '&:disabled': {
                    background: '#9CA3AF',
                    color: '#FFFFFF'
                  },
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Backdrop
        open={isSubmitting}
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(3px)'
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Dialog
        open={requestDialogOpen}
        onClose={() => setRequestDialogOpen(false)}
      >
        <DialogTitle>Request New Event Type</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Event Type Name"
            type="text"
            fullWidth
            value={requestedEventType}
            onChange={(e) => setRequestedEventType(e.target.value)}
          />
          {requestEventTypeMsg && (
            <Alert severity="info" sx={{ mt: 2 }}>
              {requestEventTypeMsg}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setRequestDialogOpen(false)}
            sx={{ color: '#1A1F36' }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              setRequestEventTypeMsg("");
              if (!requestedEventType.trim()) {
                setRequestEventTypeMsg("Please enter an event type name.");
                return;
              }
              try {
                await axios.post(
                  "http://localhost:5001/api/settings/event-type-requests",
                  { eventType: requestedEventType },
                  { headers: { "x-auth-token": localStorage.getItem("token") } }
                );
                setRequestEventTypeMsg("Request submitted to admin.");
                setRequestedEventType("");
              } catch (err) {
                setRequestEventTypeMsg(
                  err.response?.data?.message || "Failed to submit request."
                );
              }
            }}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #0D3B66 0%, #0077B6 100%)',
              color: '#FFFFFF',
              '&:hover': {
                background: 'linear-gradient(135deg, #0a2d4d 0%, #006699 100%)',
                color: '#FFFFFF'
              }
            }}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
      </Container>
    </Box>
  );
};

export default ODRequestForm;
