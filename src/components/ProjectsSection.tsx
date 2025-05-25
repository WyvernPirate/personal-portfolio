import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink } from "lucide-react";

const GITHUB_USERNAME = "WyvernPirate";
const DEFAULT_BRANCH = "main";
const FALLBACK_IMAGE = "src/images/fallback.png";

const SELECTED_PROJECTS = [
  { repo: "MediSync-App-Flutter", tags: ["Flutter", "Dart", "Mobile", "Google Maps", "Firebase"] },
  { repo: "MediSync-Admin-Portal", tags: ["React", "TypeScript", "Admin Panel", "Firebase"] },
  { repo: "Employee-Training-Portal", tags: ["React", "TypeScript", "Training", "Web"] },
  { repo: "MyFirst2DGame", tags: ["Java", "Game Development", "2D"] },
];

function getProjectImageUrl(repo: string) {
  return `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repo}/${DEFAULT_BRANCH}/src/docs/images/cover.png`;
}

type RepoData = {
  name: string;
  html_url: string;
  homepage?: string;
  description?: string;
};

const ProjectsSection = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRepos() {
      const repoData = await Promise.all(
        SELECTED_PROJECTS.map(async (proj) => {
          try {
            const res = await fetch(
              `https://api.github.com/repos/${GITHUB_USERNAME}/${proj.repo}`
            );
            const data: RepoData = await res.json();
            return {
              ...proj,
              html_url: data.html_url || `https://github.com/${GITHUB_USERNAME}/${proj.repo}`,
              homepage: data.homepage,
              name: data.name || proj.repo,
              description: data.description,
            };
          } catch {
            return {
              ...proj,
              name: proj.repo,
              html_url: `https://github.com/${GITHUB_USERNAME}/${proj.repo}`,
            };
          }
        })
      );
      setProjects(repoData);
      setLoading(false);
    }
    fetchRepos();
  }, []);

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">My Projects</h2>
          <div className="h-1 w-20 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600">
            Here are some of the projects I've worked on and am most proud of.
          </p>
        </div>
        {loading ? (
          <div className="text-center text-gray-600">Loading projects…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <Card
                key={project.name}
                className="overflow-hidden hover:shadow-lg transition-shadow border-slate-200"
              >
                <div className="h-48 overflow-hidden bg-slate-100 flex items-center justify-center">
                  <img
                    src={getProjectImageUrl(project.repo)}
                    alt={project.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.onerror = null; // Prevent infinite loop
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {project.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {project.description || "No description provided."}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags?.map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-6 pt-0 border-t border-slate-100">
                  <a
                    href={project.html_url}
                    className="text-gray-600 hover:text-blue-600 flex items-center gap-2 text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github size={16} /> Source Code
                  </a>
                  {(project.homepage) && (
                    <a
                      href={project.homepage}
                      className="text-gray-600 hover:text-blue-600 flex items-center gap-2 text-sm"
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
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Want to see more? Check out my GitHub for all my repositories and contributions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;