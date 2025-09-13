import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // default to Demo User
    api.getUser("u_user").then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const loginAs = async (id) => {
    setLoading(true);
    const u = await api.getUser(id);
    setUser(u);
    setLoading(false);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loading, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
