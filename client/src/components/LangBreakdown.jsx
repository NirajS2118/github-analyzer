const COLORS = ["#58a6ff", "#3fb950", "#f78166", "#d2a8ff", "#ffa657", "#ff7b72"];

export default function LangBreakdown({ data, color }) {
  return (
    <div className="bg-gh-surface border border-gh-border rounded-xl p-5">
      <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-1">
        Languages
      </h2>
      <p className="text-xs text-gray-600 mb-4">@{data.profile.login}</p>

      {data.languages.length === 0 ? (
        <p className="text-gray-500 text-sm">No language data</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {data.languages.map((l, i) => (
            <div key={l.lang}>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{l.lang}</span>
                <span>{l.pct}%</span>
              </div>
              <div className="h-1.5 bg-gh-bg rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${l.pct}%`, background: COLORS[i % COLORS.length] }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
