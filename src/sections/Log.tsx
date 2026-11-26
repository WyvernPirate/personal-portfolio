import Workspace from "@/desktop/Workspace";
import Window from "@/desktop/Window";
import { experience } from "@/content/experience";

export default function LogWorkspace() {
  return (
    <Workspace id="log" label="Experience">
      <div className="log-grid">
        <Window app="kitty" title="git log --graph" primary as="section" labelledBy="log-title" className="log-main">
          <h2 id="log-title">Experience</h2>
          <ol className="commits">
            {experience.map((e) => (
              <li key={e.hash} className="commit" data-kind={e.kind}>
                <span className="node" aria-hidden="true" />
                <div>
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
                </div>
              </li>
            ))}
          </ol>
        </Window>

        <Window app="zathura" title="Phemelo_Moloi_CV.pdf" as="aside" className="log-side">
          <h3>Education</h3>
          <p>
            <strong>BSc Computer Science and Software Engineering</strong>
            <br />
            <span className="muted">BIUST, 2022 – 2026</span>
          </p>
          <p>
            <strong>BGCSE, Grade A</strong>
            <br />
            <span className="muted">Maun Senior Secondary School, 2020 – 2021</span>
          </p>
          <h3>Recognition</h3>
          <p>
            <strong>3rd place</strong>, ISACA Gaborone Chapter Hackathon, Nov 2024, as lead developer of a gamified
            cybersecurity awareness platform.
          </p>
        </Window>
      </div>
    </Workspace>
  );
}
