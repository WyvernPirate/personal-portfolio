import Workspace from "@/desktop/Workspace";
import Window from "@/desktop/Window";
import ContactForm from "./ContactForm";
import { profile } from "@/content/profile";

export default function MailWorkspace() {
  return (
    <Workspace id="mail" label="Contact">
      <div className="mail-grid">
        <Window app="aerc" title="compose" primary as="section" labelledBy="mail-title" className="mail-compose">
          <h2 id="mail-title">Contact</h2>
          <p className="muted">Hiring, a project or a question: write here or use the details on the right.</p>
          <ContactForm />
        </Window>

        <Window app="foot" title="cat contact.txt" as="aside" className="mail-info">
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
      <p className="colophon muted">
        © {new Date().getFullYear()} Phemelo Moloi. Built with React, GSAP and three.js, styled after my own Hyprland
        setup.
      </p>
    </Workspace>
  );
}
