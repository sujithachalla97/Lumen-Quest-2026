import React, { useState } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("login"); // 'login', 'signup', 'dashboard'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]); // store registered users
  const [events, setEvents] = useState([]); // store events

  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");

  // Signup
  const handleSignup = (e) => {
    e.preventDefault();
    if (users.find((user) => user.email === email)) {
      setMessage("Email already registered!");
    } else {
      setUsers([...users, { email, password }]);
      setMessage("Signup successful! Please login.");
      setEmail("");
      setPassword("");
      setPage("login");
    }
  };

  // Login
  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      setMessage("");
      setPage("dashboard");
    } else {
      setMessage("Invalid Credentials");
    }
  };

  // Logout
  const handleLogout = () => {
    setPage("login");
    setEmail("");
    setPassword("");
    setMessage("");
    setEvents([]);
  };

  // Add Event
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (eventName && eventDate) {
      setEvents([...events, { name: eventName, date: eventDate }]);
      setEventName("");
      setEventDate("");
    }
  };

  // --- Login Page ---
  if (page === "login") {
    return (
      <div className="container">
        <div className="login-card">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
          <p>
            Don't have an account?{" "}
            <span className="link" onClick={() => setPage("signup")}>
              Signup
            </span>
          </p>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    );
  }

  // --- Signup Page ---
  if (page === "signup") {
    return (
      <div className="container">
        <div className="login-card">
          <h2>Signup</h2>
          <form onSubmit={handleSignup}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Signup</button>
          </form>
          <p>
            Already have an account?{" "}
            <span className="link" onClick={() => setPage("login")}>
              Login
            </span>
          </p>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    );
  }

  // --- Dashboard Page ---
  return (
    <div className="container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h2>Welcome, {email}</h2>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>

        <div className="add-event">
          <h3>Add New Event</h3>
          <form onSubmit={handleAddEvent}>
            <input
              type="text"
              placeholder="Event Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
            <button type="submit">Add Event</button>
          </form>
        </div>

        <div className="event-list">
          <h3>All Events</h3>
          {events.length === 0 ? (
            <p>No events added yet.</p>
          ) : (
            <div className="cards-container">
              {events.map((event, index) => (
                <div className="event-card" key={index}>
                  <h4>{event.name}</h4>
                  <p>{event.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
