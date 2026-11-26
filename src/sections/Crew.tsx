import Workspace from "@/desktop/Workspace";
import Window from "@/desktop/Window";
import { profile } from "@/content/profile";

export default function CrewWorkspace() {
  return (
    <Workspace id="crew" label="Leadership">
      <div className="crew-grid">
        <Window app="kitty" title="cat ~/crew" primary as="section" labelledBy="crew-title">
          <h2 id="crew-title">Leadership</h2>
          <ul className="crew-list">
            <li>
              <h3>Chairperson, BIUST Innovation Club</h3>
              <p className="muted">Aug 2025 – Aug 2026, after joining as a member in Oct 2024</p>
              <p>Runs the club, takes part in hackathons and innovation programmes, and contributes to open source.</p>
            </li>
            <li>
              <h3>Lead developer, ISACA Gaborone hackathon</h3>
              <p className="muted">Nov 2024, 3rd place</p>
              <p>Led a team that built a gamified platform for online safety and scam awareness.</p>
            </li>
            <li>
              <h3>Documentation and support</h3>
              <p className="muted">The Clicking Generation, Maun</p>
              <p>Wrote the user manual for a new internal system, which improved adoption and cut repeat requests.</p>
            </li>
          </ul>
          <p>
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              Open-source work on GitHub
            </a>
          </p>
        </Window>
      </div>
    </Workspace>
  );
}
