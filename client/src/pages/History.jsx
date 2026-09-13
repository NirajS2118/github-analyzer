import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const BASE = import.meta.env.VITE_API_URL || "";

export default function History() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user === undefined) return;

    if (!user) {
      navigate("/");
      return;
    }

    async function fetchHistory() {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`${BASE}/api/history`, {
          withCredentials: true,
        });

        setHistory(res.data);
      } catch (err) {
        console.error(
          "Failed to fetch history:",
          err.response?.data || err.message
        );

        setError(
          err.response?.data?.error || "Failed to load comparison history."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [user, navigate]);

  async function deleteEntry(id) {
    try {
      await axios.delete(`${BASE}/api/history/${id}`, {
        withCredentials: true,
      });

      setHistory((h) => h.filter((c) => c._id !== id));
    } catch (err) {
      console.error(
        "Failed to delete history entry:",
        err.response?.data || err.message
      );
    }
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-medium text-white">
          Comparison history
        </h1>

        <Link
          to="/"
          className="text-xs text-gh-blue hover:underline"
        >
          + New comparison
        </Link>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-2 border-gh-blue border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-16">
          <p className="text-red-400 text-sm">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="text-gh-blue text-sm hover:underline mt-3"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && history.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">📭</p>

          <p>No comparisons saved yet.</p>

          <Link
            to="/"
            className="text-gh-blue text-sm hover:underline mt-2 inline-block"
          >
            Make your first comparison →
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {history.map((c) => (
          <div
            key={c._id}
            className="bg-gh-surface border border-gh-border rounded-xl p-4 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center gap-1.5">
                {c.user1Avatar && (
                  <img
                    src={c.user1Avatar}
                    alt={c.user1Login}
                    className="w-7 h-7 rounded-full border border-gh-border"
                  />
                )}

                <span className="text-sm text-gh-blue font-medium">
                  @{c.user1Login}
                </span>
              </div>

              <span className="text-gray-500 text-xs">vs</span>

              <div className="flex items-center gap-1.5">
                {c.user2Avatar && (
                  <img
                    src={c.user2Avatar}
                    alt={c.user2Login}
                    className="w-7 h-7 rounded-full border border-gh-border"
                  />
                )}

                <span className="text-sm text-gh-green font-medium">
                  @{c.user2Login}
                </span>
              </div>

              {c.winner && c.winner !== "tie" && (
                <span className="text-xs bg-green-900/30 text-gh-green border border-green-800 rounded-full px-2 py-0.5 hidden sm:block">
                  {c.winner} won
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-gray-600 hidden md:block">
                {new Date(c.createdAt).toLocaleDateString()}
              </span>

              <Link
                to={`/compare/${c.user1Login}/${c.user2Login}`}
                className="text-xs text-gray-400 border border-gh-border rounded-lg px-2.5 py-1 hover:border-gray-500 hover:text-white transition-colors"
              >
                View
              </Link>

              <button
                onClick={() => deleteEntry(c._id)}
                className="text-xs text-red-500 border border-gh-border rounded-lg px-2.5 py-1 hover:border-red-800 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
