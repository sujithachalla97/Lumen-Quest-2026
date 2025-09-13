import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserCircle } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        {/* Brand */}
        <div className="brand">LumenSMS</div>

        {/* Nav Links */}
        <div className="nav-links">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            Home
          </Link>
          <Link
            to="/plans"
            className={location.pathname === "/plans" ? "active" : ""}
          >
            Plans
          </Link>
          <Link
            to="/my"
            className={location.pathname === "/my" ? "active" : ""}
          >
            My Subscriptions
          </Link>
        </div>

        {/* Profile Dropdown */}
        <div className="nav-actions" ref={dropdownRef}>
          <UserCircle
            size={34}
            className="profile-icon"
            onClick={() => setOpen(!open)}
          />
          {open && (
            <div className="profile-dropdown">
              <div className="profile-info">
                <strong>{user?.name || "Demo User"}</strong>
                <div className="small">{user?.role || "User"}</div>
              </div>
              <button className="logout-btn" onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
