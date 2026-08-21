"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { setToken, clearToken, getToken } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const { showToast } = useToast();

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

  // Any API call that comes back 401 broadcasts this — force the person
  // back to a logged-out state and tell them why, whether that's a
  // normal expired session or specifically being logged in elsewhere.
  useEffect(() => {
    const handleUnauthorized = (e) => {
      clearToken();
      setIsAuthed(false);
      const message = e.detail?.message?.includes("another device")
        ? e.detail.message
        : "Your session has expired. Please log in again.";
      showToast(message, "error");
    };
    window.addEventListener("paperbanao:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("paperbanao:unauthorized", handleUnauthorized);
  }, [showToast]);

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
