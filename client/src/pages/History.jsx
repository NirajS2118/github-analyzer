import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function History() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/"); return; }
    axios.get("/api/history")
      .then((res) => setHistory(res.data))
      .finally(() => setLoading(false));
  }, [user]);

  async function deleteEntry(id) {
    await axios.delete(`/api/history/${id}`);
    setHistory((h) => h.filter((c) => c._id !== id));
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-medium text-white">Comparison history</h1>
        <Link to="/" className="text-xs text-gh-blue hover:underline">+ New comparison</Link>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-2 border-gh-blue border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && history.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">📭</p>
          <p>No comparisons saved yet.</p>
          <Link to="/" className="text-gh-blue text-sm hover:underline mt-2 inline-block">
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
                  <img src={c.user1Avatar} alt={c.user1Login} className="w-7 h-7 rounded-full border border-gh-border" />
                )}
                <span className="text-sm text-gh-blue font-medium">@{c.user1Login}</span>
              </div>
              <span className="text-gray-500 text-xs">vs</span>
              <div className="flex items-center gap-1.5">
                {c.user2Avatar && (
                  <img src={c.user2Avatar} alt={c.user2Login} className="w-7 h-7 rounded-full border border-gh-border" />
                )}
                <span className="text-sm text-gh-green font-medium">@{c.user2Login}</span>
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
