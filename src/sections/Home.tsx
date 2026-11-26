import Workspace from "@/desktop/Workspace";
import Window from "@/desktop/Window";
import { profile } from "@/content/profile";

const facts: [string, string][] = [
  ["user", profile.handle],
  ["role", profile.role],
  ["focus", profile.focus],
  ["base", `${profile.base} (CAT)`],
  ["edu", "BSc Computer Science and Software Engineering, BIUST 2026"],
  ["stack", "TypeScript, React, Node.js, Python, Flutter"],
  ["status", profile.status],
];

export default function HomeWorkspace() {
  return (
    <Workspace id="home" label="Home">
      <div className="home-grid">
        <Window app="kitty" title="fastfetch" primary index={0} className="fetch" as="section">
          <div className="fetch-body">
            <picture>
              <source srcSet="/profile.avif" type="image/avif" />
              <source srcSet="/profile.webp" type="image/webp" />
              <img
                className="portrait"
                src="/profile_pic.jpg"
                alt="Portrait of Phemelo Moloi"
                width={400}
                height={495}
                decoding="async"
                fetchPriority="high"
              />
            </picture>
            <dl className="facts">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
              <div className="swatches" aria-hidden="true">
                <i style={{ background: "#1B1A2E" }} />
                <i style={{ background: "#24223A" }} />
                <i style={{ background: "#9C99B4" }} />
                <i style={{ background: "#75AADB" }} />
                <i style={{ background: "#E3A869" }} />
                <i style={{ background: "#ECEAF4" }} />
              </div>
            </dl>
          </div>
        </Window>

        <Window app="foot" title="whoami" index={1} className="name" as="section">
          <h1 className="lockup mono">
            <span>Phemelo</span>
            <span>Moloi</span>
          </h1>
          <p className="tagline">{profile.tagline}</p>
          <div className="actions">
            <a className="btn btn-primary" href="#work">
              See projects
            </a>
            <a className="btn" href={profile.cv} download>
              Download CV
            </a>
          </div>
        </Window>

        <Window app="notify" title="now" index={2} className="now" as="aside">
          <h2 className="now-title">{profile.now.title}</h2>
          <p className="muted">{profile.now.detail}</p>
          <a href={profile.now.href} target="_blank" rel="noopener noreferrer">
            Open arrowgate-app.vercel.app
          </a>
        </Window>
      </div>
    </Workspace>
  );
}
