export default function ProfileCard({ user, color }) {
  const accent = color === "blue" ? "border-gh-blue" : "border-gh-green";
  const textAccent = color === "blue" ? "text-gh-blue" : "text-gh-green";

  return (
    <div className={`bg-gh-surface border border-gh-border rounded-xl p-5 border-t-2 ${accent}`}>
      <div className="flex items-center gap-3 mb-4">
        <img
          src={user.profile.avatar}
          alt={user.profile.login}
          className="w-14 h-14 rounded-full border border-gh-border"
        />
        <div className="min-w-0">
          <a
            href={user.profile.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-medium text-base hover:underline ${textAccent}`}
          >
            {user.profile.name || user.profile.login}
          </a>
          <p className="text-gray-400 text-sm">@{user.profile.login}</p>
          {user.profile.location && (
            <p className="text-gray-500 text-xs mt-0.5">📍 {user.profile.location}</p>
          )}
        </div>
      </div>

      {user.profile.bio && (
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{user.profile.bio}</p>
      )}

      <div className="grid grid-cols-3 gap-2">
        {[
          ["Repos", user.stats.repos],
          ["Followers", user.stats.followers.toLocaleString()],
          ["Stars", user.stats.totalStars.toLocaleString()],
        ].map(([label, value]) => (
          <div key={label} className="bg-gh-bg rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-gray-500 mb-0.5">{label}</p>
            <p className="text-sm font-medium text-white">{value}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-600 mt-3 text-right">
        Account age: {user.profile.accountAge}y
      </p>
    </div>
  );
}
