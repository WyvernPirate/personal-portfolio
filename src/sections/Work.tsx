import Workspace from "@/desktop/Workspace";
import Window from "@/desktop/Window";
import DeviceMockup from "@/desktop/mockups/DeviceMockup";
import { projects, type Project } from "@/content/projects";
import { profile } from "@/content/profile";
import github from "@/content/github.json";

function ProjectRow({ project, flip }: { project: Project; flip: boolean }) {
  const titleId = `project-${project.slug}`;
  return (
    <article className="project" data-flip={flip} aria-labelledby={titleId}>
      <Window app="nvim" title={`${project.slug}.md`} className="project-info">
        <p className="status mono" data-status={project.status}>
          {project.status}
        </p>
        <h3 id={titleId}>{project.name}</h3>
        <p>{project.summary}</p>
        <ul className="bullets">
          {project.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <ul className="chips" aria-label="Stack">
          {project.stack.map((s) => (
            <li key={s} className="mono">
              {s}
            </li>
          ))}
        </ul>
        <p className="muted">{project.role}</p>
        <p className="links">
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer">
              Live site
            </a>
          )}
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noopener noreferrer">
              Source on GitHub
            </a>
          )}
        </p>
      </Window>
      <Window app="mpv" title={project.device} className="project-device">
        <DeviceMockup device={project.device} shot={project.shot} name={project.name} stack={project.stack} />
      </Window>
    </article>
  );
}

export default function WorkWorkspace() {
  const languages = (github.languages as { name: string; count: number }[]).slice(0, 3);
  return (
    <Workspace id="work" label="Projects">
      <Window app="kitty" title="ls ~/work" primary as="section" labelledBy="work-title" className="work-intro">
        <h2 id="work-title">Projects</h2>
        <p className="muted">
          Products I have built end to end, from the SADC freight exchange to a Setswana-aware sentiment engine. Phone
          and laptop previews tilt as you scroll.
        </p>
      </Window>

      {projects.map((p, i) => (
        <ProjectRow key={p.slug} project={p} flip={i % 2 === 1} />
      ))}

      <Window app="gh" title="profile" as="aside" className="work-more">
        <h3>More on GitHub</h3>
        <p className="muted">
          {github.publicRepos} public repositories
          {languages.length > 0 && <>, mostly {languages.map((l) => l.name).join(", ")}</>}. Coursework, experiments and
          the Hyprland dotfiles behind this site.
        </p>
        <p className="links">
          <a href={profile.github} target="_blank" rel="noopener noreferrer">
            github.com/WyvernPirate
          </a>
        </p>
      </Window>
    </Workspace>
  );
}
