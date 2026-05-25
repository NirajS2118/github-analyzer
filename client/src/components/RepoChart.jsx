import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

export default function RepoChart({ user1, user2 }) {
  const u1 = user1.profile.login;
  const u2 = user2.profile.login;

  const data = [
    { metric: "Repos", [u1]: user1.stats.repos, [u2]: user2.stats.repos },
    { metric: "Stars", [u1]: user1.stats.totalStars, [u2]: user2.stats.totalStars },
    { metric: "Forks", [u1]: user1.stats.totalForks, [u2]: user2.stats.totalForks },
    { metric: "Followers", [u1]: user1.stats.followers, [u2]: user2.stats.followers },
  ];

  return (
    <div className="bg-gh-surface border border-gh-border rounded-xl p-5">
      <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">
        Activity chart
      </h2>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
          <XAxis dataKey="metric" tick={{ fill: "#8b949e", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#8b949e", fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
          <Tooltip
            contentStyle={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: "#e6edf3" }}
            itemStyle={{ color: "#e6edf3" }}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Bar dataKey={u1} fill="#58a6ff" radius={[4, 4, 0, 0]} />
          <Bar dataKey={u2} fill="#3fb950" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
