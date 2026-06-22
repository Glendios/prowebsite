# Development Log

## 2026-06-22 - Public-facing showcase copy cleanup

- Intent: Rewrite project/showcase pages so they read for a human visitor evaluating the tools, not as internal portfolio or recruiter-planning notes.
- Pages touched: `docs/index.html`, `docs/dental-lab-automation.html`, `docs/hotelmonitor.html`, `docs/screentrigger.html`, `docs/task-dashboard.html`, `docs/work.html`, `docs/privacy.html`, and `docs/terms.html`.
- Changes: Removed or rewrote meta-facing labels such as "case study", "portfolio highlights", "engineering highlights", "what it proves", "demo approach", and recruiter/internal framing. Kept project copy focused on what each tool does, how the workflow runs, and what can be inspected.
- Privacy pass: Removed public full-name metadata from the home page and changed the About page heading to the site identity instead of a full personal name. GitHub remains the public contact path.
- Verification: Local static server returned `200 OK` for all HTML pages. `npm run audit -- --omit=dev` reported no vulnerabilities. Text scan found only false positives in legal copy and the technical phrase "PyQt signal handoff."
- Follow-up: Root repo safeguards are missing (`AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, CI, and e2e smoke-test scaffolding). Add them in a separate approved pass.
