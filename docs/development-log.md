# Development Log

## 2026-07-07 - Unlisted domain directory

- Intent: Add a polished, bookmarkable directory for tracking the public hub, hosted apps, utility pages, and support pages without adding it to the regular home page navigation.
- Research used: NN/g describes information architecture as structuring, organizing, and labeling site content, while sitemaps/directories help people understand what a site offers (`https://www.nngroup.com/articles/information-architecture-sitemaps/`, `https://www.nngroup.com/articles/site-map-usability/`). Texas A&M's IA guidance echoes clear labels, logical nesting, and navigation-aligned organization (`https://web.tamu.edu/aggie-ux-university/defining-and-organizing-your-sites-content/key-elements-of-user-experience/information-architecture/`).
- Design decision: Use a compact route-ledger layout instead of a plaintext sitemap or public marketing grid. Group entries by Static Hub, Project Pages, Live Apps, Utilities, and Support, with URL, host, and audience/status columns.
- Files touched: `docs/directory.html`, `docs/cndictstyle.css`.
- Visibility decision: The page includes `noindex, nofollow` and is not linked from the existing home page navigation, so it can be bookmarked without mixing regular visitor navigation with personal/site-ops tracking.
- Follow-up: Consider adding any future subdomains to this directory when DNS/deployment changes are made.

## 2026-07-07 - OSRS app deployment and expanded project tracking

- Intent: Host the OSRS calculator at `osrs.phantom.moe` and add the previously selected "add now" projects to the unlisted directory.
- Deployment: Deployed `C:\Users\GLENDIOS\Documents\GitHub\osrs-calculator` to Vercel project `osrs-calculator`. Production deployment URL is `https://osrs-calculator.vercel.app/`; Vercel project id is stored in `osrs-calculator/.vercel/project.json`.
- DNS state: Added `osrs.phantom.moe` to the Vercel project, but Cloudflare DNS still needs a record because this environment has no Cloudflare credentials. Vercel requested `A osrs.phantom.moe 76.76.21.21`; the directory marks OSRS as `DNS pending` until that record exists.
- Directory changes: Added OSRS to Live Apps and added Local Apps / Research Tools rows for Agentic Ops Console, Gacha Daily Checker, Live Transcript Buffer, League Settings Manager, Anime RSS Helper, Malware Detector, Yu-Gi-Oh Solver, SubPolymerGX, Symlink Helper, and Taobao Warehouse Tracker.
- Verification: `osrs-calculator` unit tests passed 10/10; `https://osrs-calculator.vercel.app/` returned `200 OK` with title `OSRS Damage Comparator`. `osrs.phantom.moe` did not resolve before the Cloudflare DNS record was added.

## 2026-06-22 - Public-facing showcase copy cleanup

- Intent: Rewrite project/showcase pages so they read for a human visitor evaluating the tools, not as internal portfolio or recruiter-planning notes.
- Pages touched: `docs/index.html`, `docs/dental-lab-automation.html`, `docs/hotelmonitor.html`, `docs/screentrigger.html`, `docs/task-dashboard.html`, `docs/work.html`, `docs/privacy.html`, and `docs/terms.html`.
- Changes: Removed or rewrote meta-facing labels such as "case study", "portfolio highlights", "engineering highlights", "what it proves", "demo approach", and recruiter/internal framing. Kept project copy focused on what each tool does, how the workflow runs, and what can be inspected.
- Privacy pass: Removed public full-name metadata from the home page and changed the About page heading to the site identity instead of a full personal name. GitHub remains the public contact path.
- Verification: Local static server returned `200 OK` for all HTML pages. `npm run audit -- --omit=dev` reported no vulnerabilities. Text scan found only false positives in legal copy and the technical phrase "PyQt signal handoff."
- Follow-up: Root repo safeguards are missing (`AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, CI, and e2e smoke-test scaffolding). Add them in a separate approved pass.
