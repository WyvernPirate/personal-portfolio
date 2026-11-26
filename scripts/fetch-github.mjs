// Runs before every build. Writes src/content/github.json so the site never calls
// api.github.com at runtime. On failure the previously committed file is kept.
import { writeFileSync } from "node:fs";

const USER = "WyvernPirate";
const OUT = new URL("../src/content/github.json", import.meta.url);

try {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "portfolio-build" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const profile = await (await fetch(`https://api.github.com/users/${USER}`, { headers })).json();
  const repos = await (await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&type=owner`, { headers })).json();
  if (!Array.isArray(repos) || typeof profile.public_repos !== "number") throw new Error("unexpected response");

  const counts = new Map();
  for (const r of repos) if (!r.fork && r.language) counts.set(r.language, (counts.get(r.language) || 0) + 1);
  const languages = [...counts].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));

  writeFileSync(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), publicRepos: profile.public_repos, languages }, null, 2) + "\n");
  console.log(`github.json updated: ${profile.public_repos} repos, ${languages.length} languages`);
} catch (err) {
  console.warn(`fetch-github skipped (${err.message}); keeping committed github.json`);
}
