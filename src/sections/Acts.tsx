import { lazy, Suspense, useEffect, useState } from "react";
import Window from "@/desktop/Window";
import { profile } from "@/content/profile";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import { stationSide } from "@/world/layout";
import github from "@/content/github.json";

const ContactForm = lazy(() => import("./ContactForm"));

const facts: [string, string][] = [
  ["role", profile.role],
  ["focus", profile.focus],
  ["base", `${profile.base} (CAT)`],
  ["status", profile.status],
];

function Home() {
  return (
    <section id="home" className="act act-home" tabIndex={-1} aria-label="Home">
      <Window app="foot" title="whoami" primary className="card card-hero">
        <h1 className="lockup mono">
          <span>Phemelo</span>
          <span>Moloi</span>
        </h1>
        <p className="tagline">{profile.tagline}</p>
        <dl className="sr-only">
          {facts.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="actions">
          <a className="btn btn-primary" href="#work">
            See projects
          </a>
          <a className="btn" href={profile.cv} download>
            Download CV
          </a>
        </div>
      </Window>
    </section>
  );
}

function Dive() {
  return (
    <section id="dive" className="act act-dive" tabIndex={-1} aria-label="Dive into the screen">
      <p className="dive-line mono">
        <span className="prompt">$</span> cd ~/work
      </p>
    </section>
  );
}

function Work() {
  const live = projects.filter((p) => p.live).length;
  return (
    <section id="work" className="act act-work" tabIndex={-1} aria-labelledby="work-title" style={{ "--n": projects.length } as React.CSSProperties}>
      {projects.map((p, k) => {
        const side = stationSide(k) === 1 ? "left" : "right";
        return (
          <article key={p.slug} className="station" data-side={side} aria-labelledby={`project-${p.slug}`}>
            <Window app="nvim" title={`${p.slug}.md`} primary={k === 0} className="card card-project">
              {k === 0 && (
                <h2 id="work-title" className="act-title">
                  Projects
                </h2>
              )}
              <p className="status mono" data-status={p.status}>
                {p.status}
              </p>
              <h3 id={`project-${p.slug}`}>{p.name}</h3>
              <p>{p.summary}</p>
              <ul className="bullets">
                {p.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <ul className="chips" aria-label="Stack">
                {p.stack.map((s) => (
                  <li key={s} className="mono">
                    {s}
                  </li>
                ))}
              </ul>
              <p className="muted">{p.role}</p>
              <p className="links">
                {p.live && (
                  <a href={p.live} target="_blank" rel="noopener noreferrer">
                    Live site
                  </a>
                )}
                {p.repo && (
                  <a href={p.repo} target="_blank" rel="noopener noreferrer">
                    Source on GitHub
                  </a>
                )}
              </p>
              {k === projects.length - 1 && (
                <p className="muted more">
                  {github.publicRepos} public repositories in total, {live} of these projects are live.{" "}
                  <a href={profile.github} target="_blank" rel="noopener noreferrer">
                    github.com/WyvernPirate
                  </a>
                </p>
              )}
            </Window>
          </article>
        );
      })}
    </section>
  );
}

function Log() {
  // The 3D graph reads left to right, oldest first, so the cards follow the same order.
  const commits = [...experience].reverse();
  return (
    <section id="log" className="act act-log" tabIndex={-1} aria-labelledby="log-title" style={{ "--n": commits.length } as React.CSSProperties}>
      {commits.map((e, i) => (
        <article key={e.hash} className="commit-slot">
          <Window app="kitty" title={`git show ${e.hash}`} primary={i === 0} className="card card-commit">
            {i === 0 && (
              <h2 id="log-title" className="act-title">
                Experience
              </h2>
            )}
            <p className="commit-meta mono">
              <span className="hash" aria-hidden="true">
                {e.hash}
              </span>
              <span>{e.period}</span>
            </p>
            <h3>{e.title}</h3>
            <p className="muted">{e.org}</p>
            <ul className="bullets">
              {e.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </Window>
        </article>
      ))}
    </section>
  );
}

function usePhone() {
  const [phone, setPhone] = useState(() => window.matchMedia("(max-width: 767px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setPhone(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return phone;
}

function Stack() {
  const phone = usePhone();
  return (
    <section id="stack" className="act act-stack" tabIndex={-1} aria-labelledby="stack-title">
      <Window app="kitty" title="tree ~/stack" primary className="card card-stack">
        <h2 id="stack-title" className="act-title">
          Skills
        </h2>
        {/* On phones the list starts collapsed so the 3D keycaps stay visible above the card. */}
        <details className="skills-list" open={!phone}>
          <summary className="mono">All skills</summary>
          <div className="tree">
            {skillGroups.map((g) => (
              <section key={g.name} className="tree-group">
                <h3 className="mono">{g.name}/</h3>
                <ul>
                  {g.items.map((item) => (
                    <li key={item}>
                      <span className="branch mono" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </details>
      </Window>
    </section>
  );
}

function Mail() {
  return (
    <section id="mail" className="act act-mail" tabIndex={-1} aria-labelledby="mail-title">
      <div className="mail-cards">
        <Window app="aerc" title="compose" primary className="card card-mail">
          <h2 id="mail-title" className="act-title">
            Contact
          </h2>
          <p className="muted">Hiring, a project or a question: write here or use the details on the right.</p>
          <Suspense fallback={<p className="muted">Loading form…</p>}>
            <ContactForm />
          </Suspense>
        </Window>

        <Window app="foot" title="cat contact.txt" className="card card-info">
          <h3>Details</h3>
          <dl className="facts">
            <div>
              <dt>email</dt>
              <dd>
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </dd>
            </div>
            <div>
              <dt>phone</dt>
              <dd>
                <a href={profile.phoneHref}>{profile.phone}</a>
              </dd>
            </div>
            <div>
              <dt>github</dt>
              <dd>
                <a href={profile.github} target="_blank" rel="noopener noreferrer">
                  WyvernPirate
                </a>
              </dd>
            </div>
            <div>
              <dt>linkedin</dt>
              <dd>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                  Phemelo Moloi
                </a>
              </dd>
            </div>
            <div>
              <dt>base</dt>
              <dd>{profile.base}, open to remote work</dd>
            </div>
          </dl>
          <a className="btn btn-primary" href={profile.cv} download>
            Download CV (PDF)
          </a>
        </Window>
      </div>
      <p className="colophon muted">© {new Date().getFullYear()} Phemelo Moloi. Built with React and three.js.</p>
    </section>
  );
}

export default function Acts() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Home />
      <Dive />
      <Work />
      <Log />
      <Stack />
      <Mail />
    </main>
  );
}
