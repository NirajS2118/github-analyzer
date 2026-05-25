import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [u1, setU1] = useState("");
  const [u2, setU2] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (u1.trim() && u2.trim()) {
      navigate(`/compare/${u1.trim()}/${u2.trim()}`);
    }
  }

  const examples = [
    ["torvalds", "gaearon"],
    ["NirajS2118", "bradfitz"],
    ["sindresorhus", "tj"],
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">⚔️</div>
          <h1 className="text-3xl font-semibold text-white mb-2">
            GitHub Analyzer
          </h1>
          <p className="text-gray-400">
            Compare two GitHub profiles side by side
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gh-surface border border-gh-border rounded-xl p-6 mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">User 1</label>
              <input
                type="text"
                value={u1}
                onChange={(e) => setU1(e.target.value)}
                placeholder="e.g. torvalds"
                className="w-full bg-gh-bg border border-gh-border rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-gh-blue"
              />
            </div>
            <div className="text-center text-gray-500 text-sm font-medium">vs</div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">User 2</label>
              <input
                type="text"
                value={u2}
                onChange={(e) => setU2(e.target.value)}
                placeholder="e.g. gaearon"
                className="w-full bg-gh-bg border border-gh-border rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-gh-blue"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gh-blue text-gh-bg font-medium py-2 rounded-lg hover:opacity-90 transition-opacity mt-2"
            >
              Compare profiles →
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">Try an example</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {examples.map(([a, b]) => (
              <button
                key={`${a}-${b}`}
                onClick={() => navigate(`/compare/${a}/${b}`)}
                className="text-xs text-gray-400 border border-gh-border rounded-full px-3 py-1 hover:border-gh-blue hover:text-gh-blue transition-colors"
              >
                {a} vs {b}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
