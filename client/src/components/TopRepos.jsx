export default function TopRepos({ data }) {
  return (
    <div className="bg-gh-surface border border-gh-border rounded-xl p-5">
      <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-1">
        Top repos
      </h2>
      <p className="text-xs text-gray-600 mb-4">@{data.profile.login}</p>

      <div className="flex flex-col gap-2">
        {data.topRepos.map((repo) => (
          <a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gh-bg border border-gh-border rounded-lg px-3 py-2.5 hover:border-gray-500 transition-colors block"
          >
            <p className="text-gh-blue text-sm font-medium truncate">{repo.name}</p>
            {repo.description && (
              <p className="text-gray-500 text-xs mt-0.5 truncate">{repo.description}</p>
            )}
            <div className="flex gap-3 mt-1.5 text-xs text-gray-600">
              <span>⭐ {repo.stars}</span>
              <span>🍴 {repo.forks}</span>
              {repo.language && <span>{repo.language}</span>}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
