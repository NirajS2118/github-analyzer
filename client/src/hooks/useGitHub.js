import { useState } from "react";
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "";

export function useGitHub() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function compare(user1, user2) {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await axios.get(`${BASE}/api/github/compare/${user1}/${user2}`);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch. Is the server running?");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, compare };
}