"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { setToken, clearToken, getToken } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-side auth check on mount, standard pattern
    setIsAuthed(!!getToken());
    setChecked(true);
  }, []);

  const login = (token) => {
    setToken(token);
    setIsAuthed(true);
  };

  const logout = () => {
    clearToken();
    setIsAuthed(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthed, checked, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
