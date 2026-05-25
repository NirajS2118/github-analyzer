const rows = [
  ["Public repos", (u) => u.stats.repos],
  ["Followers", (u) => u.stats.followers],
  ["Following", (u) => u.stats.following],
  ["Total stars", (u) => u.stats.totalStars],
  ["Total forks", (u) => u.stats.totalForks],
  ["Public gists", (u) => u.stats.gists],
];

export default function StatsTable({ user1, user2 }) {
  return (
    <div className="bg-gh-surface border border-gh-border rounded-xl p-5">
      <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">
        Stats comparison
      </h2>
      <div className="divide-y divide-gh-border">
        {rows.map(([label, getter]) => {
          const v1 = getter(user1);
          const v2 = getter(user2);
          const w1 = v1 > v2;
          const w2 = v2 > v1;
          return (
            <div key={label} className="grid grid-cols-3 items-center py-2.5 gap-2">
              <div className={`text-right text-sm ${w1 ? "text-white font-medium" : "text-gray-400"}`}>
                {v1.toLocaleString()}
                {w1 && <span className="ml-2 text-xs bg-blue-900/40 text-gh-blue border border-blue-700 rounded-full px-2 py-0.5">wins</span>}
              </div>
              <div className="text-center text-xs text-gray-500">{label}</div>
              <div className={`text-left text-sm ${w2 ? "text-white font-medium" : "text-gray-400"}`}>
                {w2 && <span className="mr-2 text-xs bg-green-900/40 text-gh-green border border-green-700 rounded-full px-2 py-0.5">wins</span>}
                {v2.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
