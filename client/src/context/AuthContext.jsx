import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

axios.defaults.withCredentials = true;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    axios
      .get(`${BASE}/api/auth/me`, {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  async function logout() {
    try {
      await axios.post(
        `${BASE}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    } finally {
      setUser(null);
    }
  }

  function loginWithGitHub() {
    window.location.href = `${BASE}/api/auth/github`;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        loginWithGitHub,
        loading: user === undefined,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
