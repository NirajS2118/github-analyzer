import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = import.meta.env.VITE_API_URL || "";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/auth/me`)
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  async function logout() {
    await axios.post(`${API_URL}/api/auth/logout`);
    setUser(null);
  }

  function loginWithGitHub() {
    window.location.href = `${API_URL}/api/auth/github`;
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
