import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF" }}>
      {/* Navigation Bar */}
      <nav className={`isb-navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="isb-nav-container">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              src="/logo.png"
              alt="College Logo"
              style={{
                height: "45px",
                width: "auto",
                objectFit: "contain",
              }}
            />
            <div>
              <div
                className="isb-nav-logo"
                style={{ fontSize: "1.25rem", lineHeight: "1.2" }}
              >
                CEG, Anna University
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#6B7280",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                }}
              >
                OD Application System
              </div>
            </div>
          </div>
          <ul className="isb-nav-menu">
            <li className="isb-nav-item">
              <Link to="/" className="isb-nav-link active">
                Home
              </Link>
            </li>
            <li className="isb-nav-item">
              <Link to="/contributors" className="isb-nav-link">
                Contributors
              </Link>
            </li>
            <li className="isb-nav-item">
              <Link to="/login" className="isb-nav-link">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section with CSE Building Background */}
      <section
        className="isb-hero"
        style={{
          backgroundImage: `url('/cse-building.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Light overlay for better text readability - much lighter */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(13, 59, 102, 0.15)",
            zIndex: 1,
          }}
        />

        <div
          className="isb-hero-content"
          style={{ position: "relative", zIndex: 2 }}
        >
          <h1 className="isb-hero-title" style={{ marginBottom: "1rem" }}>
            OD Application System
          </h1>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "2rem",
            }}
          >
            <Link
              to="/login"
              className="isb-btn isb-btn-white isb-btn-large"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                color: "#0D3B66",
                fontWeight: 600,
                padding: "1rem 2.5rem",
                borderRadius: "12px",
                textDecoration: "none",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#FFFFFF";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow =
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.95)";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
