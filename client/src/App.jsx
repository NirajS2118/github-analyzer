import {useEffect } from 'react';
import { Routes, Route, useLocation} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Compare from "./pages/Compare";
import History from "./pages/History";

function AuthCallback() {
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") === "success") navigate("/", { replace: true });
    if (params.get("auth") === "failed") navigate("/", { replace: true });
  }, []);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<><AuthCallback /><Home /></>} />
          <Route path="/compare/:user1/:user2" element={<Compare />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
