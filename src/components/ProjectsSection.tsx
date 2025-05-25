import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink } from "lucide-react";

type Repo = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage?: string;
  topics?: string[];
  language?: string;
  fork: boolean;
};

const GITHUB_USERNAME = "WyvernPirate";

const ProjectsSection = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user's public repos from GitHub API
    fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&type=owner&per_page=100`
    )
      .then((res) => res.json())
      .then((data) => {
        // Optionally filter out forks or archived repos
        const filtered = data.filter(
          (repo: Repo) => !repo.fork // You can add more filters here
        );
        setRepos(filtered);
      })
      .catch((e) => {
        setRepos([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">My Projects</h2>
          <div className="h-1 w-20 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600">
            Here are some of the projects I've worked on and published to GitHub.
          </p>
        </div>
        {loading ? (
          <div className="text-center text-gray-600">Loading projects…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {repos.map((repo) => (
              <Card
                key={repo.id}
                className="overflow-hidden hover:shadow-lg transition-shadow border-slate-200"
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {repo.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {repo.description || "No description provided."}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {/* Display topics if available, fallback to language */}
                    {repo.topics && repo.topics.length > 0 ? (
                      repo.topics.map((topic) => (
                        <Badge
                          key={topic}
                          variant="secondary"
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                        >
                          {topic}
                        </Badge>
                      ))
                    ) : repo.language ? (
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                      >
                        {repo.language}
                      </Badge>
                    ) : null}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-6 pt-0 border-t border-slate-100">
                  <a
                    href={repo.html_url}
                    className="text-gray-600 hover:text-blue-600 flex items-center gap-2 text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github size={16} /> Source Code
                  </a>
                  {repo.homepage && repo.homepage.startsWith("http") && (
                    <a
                      href={repo.homepage}
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
            These are just a few examples. Check out my GitHub for more projects and contributions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;