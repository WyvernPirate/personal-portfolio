
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink } from "lucide-react";

const ProjectsSection = () => {
  const projects = [
    {
      id: 1,
      title: "Student Management System",
      description:
        "A full-stack web application for managing student records, courses, and grades with role-based access control.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
      tags: ["React", "Node.js", "MongoDB", "Express"],
      githubLink: "#",
      liveLink: "#",
    },
    {
      id: 2,
      title: "Weather Forecast App",
      description:
        "A responsive weather application that provides real-time forecasts using OpenWeatherMap API with location detection.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80",
      tags: ["React", "TypeScript", "Tailwind CSS", "REST API"],
      githubLink: "#",
      liveLink: "#",
    },
    {
      id: 3,
      title: "E-commerce Product Search",
      description:
        "An algorithm to efficiently search and filter products with advanced features like fuzzy matching and relevance scoring.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
      tags: ["Python", "Flask", "Elasticsearch", "Docker"],
      githubLink: "#",
      liveLink: "#",
    },
    {
      id: 4,
      title: "Personal Finance Tracker",
      description:
        "A mobile-first web app for tracking personal expenses, setting budgets, and visualizing spending patterns.",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600&q=80",
      tags: ["React", "Firebase", "Recharts", "Material UI"],
      githubLink: "#",
      liveLink: "#",
    },
  ];

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">My Projects</h2>
          <div className="h-1 w-20 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600">
            Here are some of the projects I've worked on during my academic journey and personal exploration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow border-slate-200">
              <div className="h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-6 pt-0 border-t border-slate-100">
                <a
                  href={project.githubLink}
                  className="text-gray-600 hover:text-blue-600 flex items-center gap-2 text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={16} /> Source Code
                </a>
                <a
                  href={project.liveLink}
                  className="text-gray-600 hover:text-blue-600 flex items-center gap-2 text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={16} /> Live Demo
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>

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