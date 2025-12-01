import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    yearOfJoin: "",
    facultyAdvisor: "",
    registerNo: "",
    department: "CSE", // Add default department
  });
  const [error, setError] = useState("");
  const [facultyAdvisors, setFacultyAdvisors] = useState([]);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFacultyAdvisors = async () => {
      try {
        console.log("Fetching faculty advisors...");
        const res = await axios.get(
          "http://localhost:5001/api/users/public/faculty"
        );
        console.log("Faculty advisors response:", res.data);

        if (res.data && Array.isArray(res.data)) {
          if (res.data.length === 0) {
            setError(
              "No faculty advisors found. Please contact the administrator."
            );
          } else {
            setFacultyAdvisors(res.data);
            setError(""); // Clear any previous errors
          }
        } else {
          console.error("Invalid response format:", res.data);
          setError("Invalid response format from server");
        }
      } catch (err) {
        console.error("Error fetching faculty advisors:", err);
        setError(
          err.response?.data?.message ||
            "Error fetching faculty advisors. Please try again later."
        );
      }
    };

    if (formData.role === "student") {
      fetchFacultyAdvisors();
    } else {
      setFacultyAdvisors([]); // Clear advisors when not a student
    }
  }, [formData.role]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error);
      setShowErrorDialog(true);
    }
  };

  return (
    <Container maxWidth="sm">
      {/* Loading Backdrop */}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" gutterBottom align="center">
          Register
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            disabled={loading}
          />
          <FormControl fullWidth margin="normal" required disabled={loading}>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Role"
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="faculty">Faculty</MenuItem>
              <MenuItem value="hod">HOD</MenuItem>
            </Select>
          </FormControl>
          {/* Remove department field for students */}
          {(formData.role === "faculty" || formData.role === "hod") && (
            <TextField
              fullWidth
              label="Department"
              name="department"
              value={formData.department || ""}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />
          )}
          {formData.role === "student" && (
            <>
              <TextField
                fullWidth
                label="Register Number"
                name="registerNo"
                value={formData.registerNo}
                onChange={handleChange}
                margin="normal"
                required
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Department"
                name="department"
                value="Computer Science and Engineering"
                margin="normal"
                required
                disabled
              />

              <TextField
                fullWidth
                label="Year of Joining"
                name="yearOfJoin"
                type="number"
                value={formData.yearOfJoin}
                onChange={handleChange}
                margin="normal"
                required
                disabled={loading}
                helperText="Enter the year you joined the college (e.g., 2023)"
                inputProps={{
                  min: 2020,
                  max: new Date().getFullYear(),
                }}
              />
              <FormControl fullWidth margin="normal" required disabled={loading}>
                <InputLabel>Faculty Advisor</InputLabel>
                <Select
                  name="facultyAdvisor"
                  value={formData.facultyAdvisor}
                  onChange={handleChange}
                  label="Faculty Advisor"
                >
                  {facultyAdvisors.map((advisor) => (
                    <MenuItem key={advisor._id} value={advisor._id}>
                      {advisor.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </Box>
      </Paper>

      {/* Error Dialog */}
      <Dialog
        open={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#d32f2f",
          }}
        >
          <ErrorOutlineIcon />
          Registration Failed
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {error}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowErrorDialog(false)}
            variant="contained"
            color="error"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Register;
