const axios = require("axios");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 300 }); // cache for 5 minutes

const githubApi = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github.v3+json",
    ...(process.env.GITHUB_TOKEN && {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    }),
  },
});

async function getUser(username) {
  const key = `user:${username}`;
  if (cache.has(key)) return cache.get(key);
  const { data } = await githubApi.get(`/users/${username}`);
  cache.set(key, data);
  return data;
}

async function getRepos(username) {
  const key = `repos:${username}`;
  if (cache.has(key)) return cache.get(key);
  const { data } = await githubApi.get(
    `/users/${username}/repos?per_page=100&sort=updated`
  );
  cache.set(key, data);
  return data;
}

function computeStats(user, repos) {
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);

  const langCounts = {};
  repos.forEach((r) => {
    if (r.language) langCounts[r.language] = (langCounts[r.language] || 0) + 1;
  });
  const totalLangRepos = Object.values(langCounts).reduce((a, b) => a + b, 0);
  const languages = Object.entries(langCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([lang, count]) => ({
      lang,
      count,
      pct: Math.round((count / totalLangRepos) * 100),
    }));

  const topRepos = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5)
    .map((r) => ({
      name: r.name,
      description: r.description,
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language,
      url: r.html_url,
    }));

  const score = Math.round(
    user.followers * 2 +
      user.public_repos * 3 +
      totalStars * 1.5 +
      user.public_gists
  );

  const accountAge = Math.floor(
    (Date.now() - new Date(user.created_at)) / (1000 * 60 * 60 * 24 * 365)
  );

  return {
    profile: {
      login: user.login,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar_url,
      location: user.location,
      company: user.company,
      blog: user.blog,
      url: user.html_url,
      accountAge,
    },
    stats: {
      repos: user.public_repos,
      followers: user.followers,
      following: user.following,
      gists: user.public_gists,
      totalStars,
      totalForks,
    },
    languages,
    topRepos,
    score,
  };
}

module.exports = { getUser, getRepos, computeStats };
