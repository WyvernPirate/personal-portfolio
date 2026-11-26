import Workspace from "@/desktop/Workspace";
import Window from "@/desktop/Window";
import { skillGroups } from "@/content/skills";
import { projects } from "@/content/projects";

/** Projects whose stack mentions this skill (loose match so "Firebase (Firestore…)" finds "Firebase"). */
function usedIn(skill: string) {
  const s = skill.toLowerCase();
  return projects.filter((p) =>
    p.stack.some((t) => {
      const x = t.toLowerCase();
      return s.includes(x) || x.includes(s);
    })
  );
}

export default function StackWorkspace() {
  return (
    <Workspace id="stack" label="Skills">
      <div className="stack-grid">
        <Window app="kitty" title="tree ~/stack" primary as="section" labelledBy="stack-title" className="stack-main">
          <h2 id="stack-title">Skills</h2>
          <div className="tree">
            {skillGroups.map((g) => (
              <section key={g.name} className="tree-group">
                <h3 className="mono">{g.name}/</h3>
                <ul>
                  {g.items.map((item) => {
                    const hits = usedIn(item);
                    return (
                      <li key={item}>
                        <span className="branch mono" aria-hidden="true" />
                        <span>{item}</span>
                        {hits.length > 0 && (
                          <span className="used muted">
                            used in {hits.slice(0, 3).map((p) => p.name).join(", ")}
                            {hits.length > 3 && ` and ${hits.length - 3} more`}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </Window>

        <Window app="btop" title="ops-notes" as="aside" className="stack-side">
          <h3>Enterprise and security</h3>
          <ul className="bullets">
            <li>Endpoint monitoring and vulnerability assessment with Qualys at Debswana.</li>
            <li>Scripted update deployment and remediation of security findings.</li>
            <li>Azure and Active Directory onboarding and access control.</li>
            <li>Security-minded product work: a scam-awareness game, role-based moderation, audit logs and KYC flows.</li>
          </ul>
        </Window>
      </div>
    </Workspace>
  );
}
