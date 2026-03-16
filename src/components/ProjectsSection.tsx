import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Medal, Sparkles, Trophy } from "lucide-react";
import TerminalCommand from "@/components/TerminalCommand";

const GITHUB_USERNAME = "WyvernPirate";
const DEFAULT_BRANCH = "main";
const FALLBACK_IMAGE = "/fallback.png";
const PINNED_REPOS = [
  "MediSync-App-Flutter",
  "MediSync-Admin-Portal",
  "Employee-Training-Portal",
  "MyFirst2DGame",
];

type RepoApi = {
  name: string;
  html_url: string;
  homepage: string | null;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  topics?: string[];
  archived: boolean;
  fork: boolean;
};

type ProfileApi = {
  public_repos: number;
  followers: number;
  created_at: string;
};

type LanguageStat = {
  name: string;
  count: number;
  share: number;
};

type Achievement = {
  title: string;
  detail: string;
};

type Project = {
  repo: string;
  name: string;
  html_url: string;
  homepage?: string;
  description: string;
  language?: string;
  stars: number;
  forks: number;
  issues: number;
  tags: string[];
};

type GithubIntelligence = {
  topLanguages: LanguageStat[];
  achievements: Achievement[];
  projects: Project[];
};

function getProjectImageUrl(repo: string) {
  return `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repo}/${DEFAULT_BRANCH}/src/docs/images/cover.png`;
}

function calculateYearsOnGithub(createdAt: string): number {
  const from = new Date(createdAt).getTime();
  const now = Date.now();
  const years = (now - from) / (1000 * 60 * 60 * 24 * 365.25);
  return Math.max(0, Math.floor(years));
}

async function fetchAllRepos(username: string): Promise<RepoApi[]> {
  let page = 1;
  const allRepos: RepoApi[] = [];

  while (page <= 4) {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&page=${page}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (!response.ok) {
      break;
    }

    const repos = (await response.json()) as RepoApi[];
    allRepos.push(...repos);

    if (repos.length < 100) {
      break;
    }

    page += 1;
  }

  return allRepos;
}

function buildIntelligence(repos: RepoApi[], profile: ProfileApi): GithubIntelligence {
  const sourceRepos = repos.filter((repo) => !repo.fork);

  const languageMap = new Map<string, number>();
  sourceRepos.forEach((repo) => {
    if (!repo.language) {
      return;
    }
    languageMap.set(repo.language, (languageMap.get(repo.language) || 0) + 1);
  });

  const totalLanguageRepos = Array.from(languageMap.values()).reduce((sum, count) => sum + count, 0);
  const topLanguages = Array.from(languageMap.entries())
    .map(([name, count]) => ({
      name,
      count,
      share: totalLanguageRepos > 0 ? Math.round((count / totalLanguageRepos) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const totalStars = sourceRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
  const totalForks = sourceRepos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);
  const shippedRepos = sourceRepos.filter((repo) => !repo.archived).length;
  const yearsOnGithub = calculateYearsOnGithub(profile.created_at);

  const achievements: Achievement[] = [
    {
      title: "Polyglot Builder",
      detail: `${topLanguages.length} active languages across repositories`,
    },
    {
      title: "Open Source Momentum",
      detail: `${totalStars} stars and ${totalForks} forks across source repos`,
    },
    {
      title: "Shipped Repositories",
      detail: `${shippedRepos} active repos, ${profile.public_repos} public total`,
    },
    {
      title: "GitHub Presence",
      detail: `${profile.followers} followers with ${yearsOnGithub}+ years on platform`,
    },
  ];

  const pinned = PINNED_REPOS.map((name) => sourceRepos.find((repo) => repo.name === name)).filter(
    (repo): repo is RepoApi => Boolean(repo)
  );

  const fallbackProjects = [...sourceRepos]
    .sort((a, b) => b.stargazers_count + b.forks_count - (a.stargazers_count + a.forks_count))
    .slice(0, 6);

  const selectedRepos = (pinned.length > 0 ? pinned : fallbackProjects).slice(0, 6);

  const projects = selectedRepos.map((repo) => ({
    repo: repo.name,
    name: repo.name,
    html_url: repo.html_url,
    homepage: repo.homepage || undefined,
    description: repo.description || "No description provided.",
    language: repo.language || undefined,
    stars: repo.stargazers_count || 0,
    forks: repo.forks_count || 0,
    issues: repo.open_issues_count || 0,
    tags:
      repo.topics && repo.topics.length > 0
        ? repo.topics.slice(0, 4)
        : [repo.language || "General", repo.archived ? "archived" : "active"],
  }));

  return {
    topLanguages,
    achievements,
    projects,
  };
}

const ProjectsSection = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intelligence, setIntelligence] = useState<GithubIntelligence>({
    topLanguages: [],
    achievements: [],
    projects: [],
  });

  useEffect(() => {
    async function loadGithubIntelligence() {
      try {
        setLoading(true);
        setError(null);

        const [profileResponse, repos] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
            headers: { Accept: "application/vnd.github+json" },
          }),
          fetchAllRepos(GITHUB_USERNAME),
        ]);

        if (!profileResponse.ok) {
          throw new Error("Unable to fetch GitHub profile.");
        }

        const profile = (await profileResponse.json()) as ProfileApi;
        const computed = buildIntelligence(repos, profile);
        setIntelligence(computed);
      } catch {
        setError("Could not load GitHub insights right now.");
      } finally {
        setLoading(false);
      }
    }

    loadGithubIntelligence();
  }, []);

  const languageCommandOutput = useMemo(
    () =>
      intelligence.topLanguages
        .map((language) => `${language.name.padEnd(14, " ")} ${String(language.count).padStart(2, " ")} repos  ${String(language.share).padStart(2, " ")}%`)
        .join("\n"),
    [intelligence.topLanguages]
  );

  return (
    <section id="projects" className="px-5 pb-8 pt-4 md:px-8 md:pb-10">
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
        Live language distribution and profile-based achievements fetched from GitHub API.
      </p>

      <div className="editorial-divider my-6 opacity-40" />

      <div className="grid gap-8 lg:grid-cols-2">
          <div className="border-l-2 border-primary/20 pl-6 py-2">
            <h3 className="mb-4 text-lg font-semibold text-primary/90 uppercase tracking-widest glitch-text">06. Intelligence</h3>
            <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-foreground/90">
{loading ? "querying github engine..." : languageCommandOutput || "no source data returned"}
            </pre>
          </div>

          <div className="border-l-2 border-primary/20 pl-6 py-2">
            <h3 className="mb-4 text-lg font-semibold text-primary/90 uppercase tracking-widest glitch-text">07. Achievements</h3>
            <div className="space-y-4">
              {loading && <p className="text-xs text-muted-foreground">Analyzing commit clusters...</p>}
              {!loading &&
                intelligence.achievements.map((item, index) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="mt-1 text-primary/60">
                      {index % 3 === 0 && <Trophy size={14} />}
                      {index % 3 === 1 && <Medal size={14} />}
                      {index % 3 === 2 && <Sparkles size={14} />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{item.title}</p>
                      <p className="text-[10px] text-muted-foreground">{item.detail}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
      </div>

      <div className="mt-12">
        <h3 className="mb-8 text-xl font-semibold text-primary/90 uppercase tracking-widest glitch-text">08. Repository Index</h3>
        
        {loading && <div className="text-sm text-muted-foreground">Index sync in progress...</div>}
        {error && <div className="text-sm text-red-300">{error}</div>}
        
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {intelligence.projects.map((project) => (
              <article
                key={project.repo}
                className="group relative flex flex-col rounded border border-primary/10 bg-primary/5 p-4 transition-all hover:border-primary/30 hover:bg-primary/8"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-primary/70">{project.language || "Shell"}</span>
                  <div className="flex gap-2">
                    <a href={project.html_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                      <Github size={14} />
                    </a>
                    {project.homepage && (
                      <a href={project.homepage} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>

                <div className="relative mb-3 aspect-video overflow-hidden rounded border border-primary/10 grayscale-[0.2] transition-all group-hover:grayscale-0">
                  <img
                    src={getProjectImageUrl(project.repo)}
                    alt={project.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                </div>

                <h4 className="text-sm font-bold text-foreground mb-1">
                  {project.name.replace(/-/g, " ")}
                </h4>
                <p className="mb-4 line-clamp-2 text-[11px] text-muted-foreground leading-relaxed">
                  {project.description}
                </p>

                <div className="mt-auto pt-3 border-t border-primary/5 flex items-center gap-4 font-mono text-[10px] text-muted-foreground/70">
                  <span className="flex items-center gap-1"><Sparkles size={10} /> {project.stars}</span>
                  <span className="flex items-center gap-1"><Github size={10} /> {project.forks}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="mt-12 border-t border-primary/10 pt-6 text-center">
        <p className="text-[11px] text-muted-foreground italic">
          More projects available at 
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            className="ml-1 text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/{GITHUB_USERNAME}
          </a>
        </p>
      </div>
    </section>
  );
};

export default ProjectsSection;
