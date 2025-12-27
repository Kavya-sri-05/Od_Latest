import React from "react";
import { Typography, Box } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const downloadGuidePDF = (user) => {
  if (!user || !user.role) return;
  let fileName = "";
  switch (user.role) {
    case "student":
      // Use the actual filename placed in backend/assets (note the space and parentheses)
      fileName = "student_user_guide (1).pdf";
      break;
    case "faculty":
      fileName = "faculty_user_guide.pdf";
      break;
    case "hod":
      fileName = "hod_user_guide.pdf";
      break;
    case "admin":
      fileName = "admin_user_guide.pdf";
      break;
    default:
      return;
  }
  const url = `http://localhost:5001/assets/${fileName}`;
  axios
    .get(url, { responseType: "blob" })
    .then((response) => {
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    })
    .catch(() => {
      // Optionally show an error message
    });
};

export default downloadGuidePDF;
