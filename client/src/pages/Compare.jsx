import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useGitHub } from "../hooks/useGitHub";
import { useAuth } from "../context/AuthContext";
import { exportToPDF } from "../utils/exportPDF";
import ProfileCard from "../components/ProfileCard";
import StatsTable from "../components/StatsTable";
import RepoChart from "../components/RepoChart";
import LangBreakdown from "../components/LangBreakdown";
import TopRepos from "../components/TopRepos";
import ScoreBar from "../components/ScoreBar";

const BASE = import.meta.env.VITE_API_URL || "";

export default function Compare() {
  const { user1, user2 } = useParams();
  const navigate = useNavigate();

  const { data, loading, error, compare } = useGitHub();
  const { user } = useAuth();

  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    compare(user1, user2);
    setSaved(false);
  }, [user1, user2]);

  useEffect(() => {
    if (!data || !user || saved) return;

    async function saveComparison() {
      try {
        await axios.post(
          `${BASE}/api/history`,
          {
            user1Login: data.user1.profile.login,
            user2Login: data.user2.profile.login,
            user1Avatar: data.user1.profile.avatar,
            user2Avatar: data.user2.profile.avatar,
            user1Score: data.user1.score,
            user2Score: data.user2.score,
          },
          {
            withCredentials: true,
          }
        );

        setSaved(true);
      } catch (err) {
        console.error(
          "Failed to save comparison:",
          err.response?.data || err.message
        );
      }
    }

    saveComparison();
  }, [data, user, saved]);

  async function handleExport() {
    if (!data) return;

    setExporting(true);

    try {
      await exportToPDF(data);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/"
          className="text-gray-400 hover:text-white text-sm transition-colors"
        >
          ← Back
        </Link>

        <h1 className="text-base font-medium text-white">
          {user1} <span className="text-gray-500">vs</span> {user2}
        </h1>

        <div className="flex items-center gap-2">
          {data && (
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-1.5 text-xs border border-gh-border rounded-lg px-3 py-1.5 text-gray-300 hover:border-gray-500 hover:text-white transition-colors disabled:opacity-50"
            >
              {exporting ? (
                <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin inline-block" />
              ) : (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14Z" />
                  <path d="M7.25 7.689V2a.75.75 0 0 1 1.5 0v5.689l1.97-1.97a.749.749 0 1 1 1.06 1.06l-3.25 3.25a.749.749 0 0 1-1.06 0L4.22 6.779a.749.749 0 1 1 1.06-1.06l1.97 1.97Z" />
                </svg>
              )}

              Export PDF
            </button>
          )}

          <button
            onClick={() => navigate("/")}
            className="text-xs text-gh-blue border border-gh-border rounded-lg px-3 py-1.5 hover:border-gh-blue transition-colors"
          >
            New comparison
          </button>
        </div>
      </div>

      {!user && (
        <div className="bg-gh-surface border border-gh-border rounded-xl p-4 mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Sign in to save comparisons to your history.
          </p>

          <a
            href={`${BASE}/api/auth/github`}
            className="text-xs bg-white text-gray-900 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Sign in with GitHub
          </a>
        </div>
      )}

      {saved && user && (
        <div className="bg-green-900/20 border border-green-800 rounded-xl p-3 mb-6 text-center">
          <p className="text-xs text-gh-green">
            ✓ Saved to your{" "}
            <Link to="/history" className="underline">
              history
            </Link>
          </p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-8 h-8 border-2 border-gh-blue border-t-transparent rounded-full animate-spin" />

          <p className="text-gray-400 text-sm">
            Fetching GitHub profiles...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-6 text-center">
          <p className="text-red-400">{error}</p>

          <button
            onClick={() => navigate("/")}
            className="mt-4 text-sm text-gray-400 hover:text-white"
          >
            ← Try again
          </button>
        </div>
      )}

      {data && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProfileCard user={data.user1} color="blue" />
            <ProfileCard user={data.user2} color="green" />
          </div>

          <ScoreBar user1={data.user1} user2={data.user2} />

          <StatsTable user1={data.user1} user2={data.user2} />

          <RepoChart user1={data.user1} user2={data.user2} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LangBreakdown data={data.user1} color="#58a6ff" />
            <LangBreakdown data={data.user2} color="#3fb950" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TopRepos data={data.user1} />
            <TopRepos data={data.user2} />
          </div>
        </div>
      )}
    </div>
  );
}
