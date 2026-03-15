import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, GitFork, Star, Users } from "lucide-react";

const GITHUB_USERNAME = "WyvernPirate";
const DEFAULT_BRANCH = "main";
const FALLBACK_IMAGE = "/fallback.png";

const SELECTED_PROJECTS = [
  { repo: "MediSync-App-Flutter", tags: ["Flutter", "Dart", "Mobile", "Firebase", "Maps"] },
  { repo: "MediSync-Admin-Portal", tags: ["React", "TypeScript", "Dashboard", "Firebase"] },
  { repo: "Employee-Training-Portal", tags: ["React", "TypeScript", "Training", "Web"] },
  { repo: "MyFirst2DGame", tags: ["Java", "Game Dev", "2D"] },
];

function getProjectImageUrl(repo: string) {
  return `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repo}/${DEFAULT_BRANCH}/src/docs/images/cover.png`;
}

type RepoApi = {
  name?: string;
  html_url?: string;
  homepage?: string;
  description?: string;
  language?: string;
  stargazers_count?: number;
  forks_count?: number;
  open_issues_count?: number;
};

type ProfileApi = {
  public_repos?: number;
  followers?: number;
  following?: number;
};

type Project = {
  repo: string;
  tags: string[];
  name: string;
  html_url: string;
  homepage?: string;
  description?: string;
  language?: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
};

type GithubStats = {
  selectedStars: number;
  selectedForks: number;
  selectedIssues: number;
  publicRepos: number;
  followers: number;
  following: number;
};

const EMPTY_STATS: GithubStats = {
  selectedStars: 0,
  selectedForks: 0,
  selectedIssues: 0,
  publicRepos: 0,
  followers: 0,
  following: 0,
};

const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<GithubStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGithubData() {
      try {
        const profilePromise = fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
          .then(async (res) => {
            if (!res.ok) {
              return {} as ProfileApi;
            }
            return (await res.json()) as ProfileApi;
          })
          .catch(() => ({} as ProfileApi));

        const repoPromises = SELECTED_PROJECTS.map(async (project) => {
          const fallback: Project = {
            ...project,
            name: project.repo,
            html_url: `https://github.com/${GITHUB_USERNAME}/${project.repo}`,
            stargazers_count: 0,
            forks_count: 0,
            open_issues_count: 0,
          };

          try {
            const res = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${project.repo}`);
            if (!res.ok) {
              return fallback;
            }

            const data = (await res.json()) as RepoApi;
            return {
              ...project,
              name: data.name || project.repo,
              html_url: data.html_url || fallback.html_url,
              homepage: data.homepage || undefined,
              description: data.description || "No description provided.",
              language: data.language || undefined,
              stargazers_count: data.stargazers_count ?? 0,
              forks_count: data.forks_count ?? 0,
              open_issues_count: data.open_issues_count ?? 0,
            } as Project;
          } catch {
            return fallback;
          }
        });

        const [profile, repoData] = await Promise.all([profilePromise, Promise.all(repoPromises)]);

        const selectedStars = repoData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        const selectedForks = repoData.reduce((sum, repo) => sum + repo.forks_count, 0);
        const selectedIssues = repoData.reduce((sum, repo) => sum + repo.open_issues_count, 0);

        setProjects(repoData);
        setStats({
          selectedStars,
          selectedForks,
          selectedIssues,
          publicRepos: profile.public_repos ?? 0,
          followers: profile.followers ?? 0,
          following: profile.following ?? 0,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchGithubData();
  }, []);

  const topProject = useMemo(() => {
    if (projects.length === 0) {
      return undefined;
    }
    return [...projects].sort((a, b) => b.stargazers_count - a.stargazers_count)[0];
  }, [projects]);

  return (
    <section id="projects" className="py-16 md:py-24" data-reveal>
      <div className="container mx-auto px-4">
        <div className="mb-10" data-reveal style={{ "--reveal-delay": "40ms" } as React.CSSProperties}>
          <span className="chapter-label">Chapter 03 / Build Log</span>
          <h2 className="terminal-title mt-4 text-3xl font-bold text-foreground md:text-4xl typing-caret">
            Projects + GitHub telemetry
          </h2>
          <p className="mt-4 max-w-3xl text-base text-muted-foreground md:text-lg">
            A curated set of production and learning builds, shown with live repository signals from GitHub.
          </p>
        </div>

        <div className="editorial-divider mb-10" />

        <div className="mb-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4" data-reveal style={{ "--reveal-delay": "80ms" } as React.CSSProperties}>
          <Card className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-primary/40" />
            <CardContent className="p-5">
              <p className="terminal-label">selected repos stars</p>
              <p className="mt-3 flex items-center gap-2 text-3xl font-semibold text-foreground">
                <Star className="h-5 w-5 text-primary" /> {stats.selectedStars}
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-primary/40" />
            <CardContent className="p-5">
              <p className="terminal-label">selected repos forks</p>
              <p className="mt-3 flex items-center gap-2 text-3xl font-semibold text-foreground">
                <GitFork className="h-5 w-5 text-primary" /> {stats.selectedForks}
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-primary/40" />
            <CardContent className="p-5">
              <p className="terminal-label">github public repos</p>
              <p className="mt-3 flex items-center gap-2 text-3xl font-semibold text-foreground">
                <Github className="h-5 w-5 text-primary" /> {stats.publicRepos}
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-primary/40" />
            <CardContent className="p-5">
              <p className="terminal-label">followers / following</p>
              <p className="mt-3 flex items-center gap-2 text-3xl font-semibold text-foreground">
                <Users className="h-5 w-5 text-primary" /> {stats.followers}/{stats.following}
              </p>
            </CardContent>
          </Card>
        </div>

        {topProject && (
          <Card className="mb-10 overflow-hidden border-primary/30" data-reveal style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
            <CardContent className="p-6 md:p-7">
              <p className="terminal-label">highlight</p>
              <h3 className="mt-3 text-2xl font-semibold text-foreground">Most starred in selected set: {topProject.name}</h3>
              <p className="mt-2 text-muted-foreground">
                {topProject.stargazers_count} stars, {topProject.forks_count} forks, {topProject.open_issues_count} open issues.
              </p>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="surface-panel px-6 py-8 text-center text-muted-foreground" data-reveal>
            Loading GitHub telemetry...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2" data-reveal style={{ "--reveal-delay": "160ms" } as React.CSSProperties}>
            {projects.map((project) => (
              <Card
                key={project.repo}
                className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/35"
              >
                <div className="relative flex h-48 items-center justify-center overflow-hidden bg-secondary/40">
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[1px] bg-primary/40" />
                  <img
                    src={getProjectImageUrl(project.repo)}
                    alt={project.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                </div>

                <CardContent className="p-6">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="terminal-label">repo/{project.repo}</p>
                    {project.language && <Badge variant="outline">{project.language}</Badge>}
                  </div>

                  <h3 className="mb-3 text-xl font-semibold text-foreground">{project.name}</h3>
                  <p className="mb-4 text-muted-foreground">{project.description || "No description provided."}</p>

                  <div className="mb-5 grid grid-cols-3 gap-3">
                    <div className="rounded-lg border border-border/80 bg-secondary/40 px-3 py-2 text-center">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Stars</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">{project.stargazers_count}</p>
                    </div>
                    <div className="rounded-lg border border-border/80 bg-secondary/40 px-3 py-2 text-center">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Forks</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">{project.forks_count}</p>
                    </div>
                    <div className="rounded-lg border border-border/80 bg-secondary/40 px-3 py-2 text-center">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Issues</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">{project.open_issues_count}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between border-t border-border/70 p-6 pt-4">
                  <a
                    href={project.html_url}
                    className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github size={16} /> Source Code
                  </a>
                  {project.homepage && (
                    <a
                      href={project.homepage}
                      className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={16} /> Live Demo
                    </a>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 text-center" data-reveal style={{ "--reveal-delay": "200ms" } as React.CSSProperties}>
          <p className="text-muted-foreground">
            Want full repository history and contribution details?
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              className="ml-2 text-primary transition-colors hover:text-cyan-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open GitHub profile
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
