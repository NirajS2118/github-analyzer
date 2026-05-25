import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    axios.get("/api/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  async function logout() {
    await axios.post("/api/auth/logout");
    setUser(null);
  }

  function loginWithGitHub() {
    window.location.href = "/api/auth/github";
  }

  return (
    <AuthContext.Provider value={{ user, logout, loginWithGitHub, loading: user === undefined }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
