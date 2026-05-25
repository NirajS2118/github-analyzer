export default function ScoreBar({ user1, user2 }) {
  const s1 = user1.score;
  const s2 = user2.score;
  const total = s1 + s2 || 1;
  const pct1 = Math.round((s1 / total) * 100);
  const pct2 = 100 - pct1;
  const winner = s1 > s2 ? user1.profile.login : s2 > s1 ? user2.profile.login : null;

  return (
    <div className="bg-gh-surface border border-gh-border rounded-xl p-5">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-gh-blue">
          @{user1.profile.login} — {s1.toLocaleString()} pts
        </span>
        {winner ? (
          <span className="text-xs bg-green-900/40 text-gh-green border border-green-700 rounded-full px-3 py-0.5">
            @{winner} wins
          </span>
        ) : (
          <span className="text-xs text-gray-500">Tie</span>
        )}
        <span className="text-sm font-medium text-gh-green">
          @{user2.profile.login} — {s2.toLocaleString()} pts
        </span>
      </div>

      <div className="h-3 rounded-full overflow-hidden flex bg-gh-bg">
        <div
          className="bg-gh-blue transition-all duration-700"
          style={{ width: `${pct1}%` }}
        />
        <div
          className="bg-gh-green transition-all duration-700"
          style={{ width: `${pct2}%` }}
        />
      </div>

      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-500">{pct1}%</span>
        <span className="text-xs text-gray-600">score = followers×2 + repos×3 + stars×1.5 + gists</span>
        <span className="text-xs text-gray-500">{pct2}%</span>
      </div>
    </div>
  );
}
