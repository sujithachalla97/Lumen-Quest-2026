import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, loginAs } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <div className="brand">LumenSMS</div>
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
        <div className="nav-actions">
          <div className="user-select">
            <span className="small">👤 {user?.name}</span>
            <select
              onChange={(e) => loginAs(e.target.value)}
              value={user?.id || ""}
            >
              <option value="u_user">Demo User</option>
              <option value="u_admin">Admin</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}
