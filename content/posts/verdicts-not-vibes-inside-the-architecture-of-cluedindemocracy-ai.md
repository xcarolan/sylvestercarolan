---
title: "Verdicts, Not Vibes: Inside the Architecture of cluedindemocracy.ai"
subtitle: A non-partisan platform scores political candidates against the
  documented public record — and the whole system is engineered so the AI can't
  fudge the math. How we built a pipeline where models research and draft, the
  publisher owns the score, and nothing ships without a human review or
  spot-check.
category:
  - Politics
  - Technology
author: Sylvester Carolan
date: 2026-09-07T20:37:32.374Z
featureImage: /uploads/code.jpg
draft: false
---
The design brief was simple to state and brutal to build: **take a candidate's documented public record and render a verdict on whether they fit the office they're running for.** Not a poll, not a vibe check, not "both sides have points" — a verdict, with citations, on a scored scale, for every candidate in a race.

The engineering problem hiding inside that brief is trust. When you publish a defensible score of a real person running for real office, you do not get to hand the arithmetic to a language model and hope. Every number on the page has to be derivable, checkable, and attributable to a source. So we built the system around one governing principle that shows up in every layer of the stack:

> **The publisher owns the score.** Models do the reading and the drafting. The platform recomputes every stored number deterministically from source facts at write time. Draft numbers from the model are advisory; published numbers are recomputed, reproducible, and reviewed by a human before they go live.

---

## 1. The product contract: office fitness, not character

Before we could build anything, we had to decide what a "score" means. The answer is an **office-fitness assessment**: a candidate is scored against a job description for the specific office they're running for — its duties, priorities, and requirements — not as a general statement of their worth. The same record can fit one office differently than another. Every assessment is rendered with its office and its evidence, and it is never a standalone character verdict.

An assessment has four parts: **five dimension scores** (0–10) for the documented record; **a composite score** (0–10); **an assessment class** (Strong / Moderate / Weak fit / Not qualified); and **per-dimension evidence chains** — the facts each score rests on, with citations. And the whole thing runs on a constraint that shapes everything downstream: **documented public record only.** If a claim can't be cited to a primary or public source, it doesn't move a score.

### The rubric

Two dimensions carry the weight. **Constitutional alignment** (4×) measures commitment to democratic norms, the rule of law, the oath of office, and free and fair elections. **Constituent representation** (4×) measures a documented record of serving constituents — not donors, not party. Three contextual dimensions at 1× each fill out the picture: **cross-partisan issues** (breadth and depth of documented positions across all **23 policy topics** the rubric tracks, in five domains — Democracy & Governance; Rights & Justice; Economy; Environment & Infrastructure; Foreign Policy — where strategic avoidance after years in office counts as a documentation failure); **campaign finance** (transparency, donor patterns, dark money, conflicts of interest); and **competency match** (relevant experience for the specific office).

The composite is a weighted mean over eleven weight units:

```
overall_score = (4·constitutional + 4·constituent + cross_partisan + campaign_finance + competency) / 11
```

From there the bands are simple: ≥7.5 **Strong**, ≥5.5 **Moderate**, below 5.5 **Weak** (with the sub-3.0 range rendered separately, as a severe-qualification-failure band) — plus one categorical override: **Not qualified**, for disqualifying conduct, which overrides the score no matter what it is. (The override class shipped as "Disqualified" and was renamed in August 2026. Same conduct, same rule, same computation — a verdict-string change only.) That formula is deliberately trivial; the interesting engineering is in everything around it.

---

## 2. Why the model never does the math

The decision every other one hangs off: **language models never compute, store, or classify a published number.** Models research and draft. The Publisher — the FastAPI service at the center of the system — recomputes everything at write time in dependency-free Python. Its core scoring module is a ~1,200-line file with no external dependencies encoding the entire product logic: weights, band boundaries, the Not-qualified override, boundary flags. When any pipeline stage writes a fit assessment, the write endpoint does not trust the score the model emitted; it takes the stored dimensional scores and recomputes the composite, the verdict band, the confidence level, and the review flags from scratch.

This wasn't paranoia. Auditing earlier LLM-produced rows, **97 of 265 had been overstated by the model** — confidently, plausibly, wrong. The fix wasn't a better prompt; it was moving the arithmetic out of the model's hands entirely. (A prior generation of prompts even carried a wrong internal weighting — 1.5× where the code now says 4×/1× — which is exactly what happens when scoring rules live in prose instead of code. They now live in both, and the code is authoritative.)

The determinism extends to the fine print:

- **Rounding never crosses a band floor.** A true 82/11 = 7.4545 must store as 7.4 — Moderate — never round up to 7.5 and flip the band to Strong.
- **Boundary proximity is flagged, not guessed.** Scores within 0.3 of a band floor are marked for human review automatically.
- **Confidence is counted, not felt.** "Recruiter confidence" derives from how many of the 23 topics have documented positions: ≥18 → High, 10–17 → Medium, <10 → Low.
- **Mechanical overrides run before the composite.** The cross-partisan score is recalculated from the documented-topic count via a lookup table (with a small district-representation modifier); the campaign-finance score is derived from the assessor's own structured facts — never from its emitted digit.
- **Verdict prose is reconciled with the verdict.** A scan catches an assessor writing "disqualified" in prose while emitting a non-override class, and stale wording is rewritten to match the banded verdict at write time.

Two kill switches round it out: an authoritative-record flag so Not-qualified determinations are only possible once the disqualifier records are populated, and a guard so a re-write can never silently un-reject an already-published verdict as a side effect.

The lesson generalizes: **when an LLM produces a number that matters, treat it as a claim, not a computation.** Models don't testify — they generate, fluently and confidently, and sometimes they simply invent. A claim is something you verify against the record before it means anything; computation is something your code should do.

---

## 3. Data: only what's documented

"Documented public record only" isn't a slogan — it's an ingestion problem. The data layer pulls from a deliberately boring set of authoritative sources:

- **FEC** — federal candidates and contests via the OpenFEC API; the full campaign-money picture via FEC's bulk-download ZIPs. The individual-contributions file alone runs tens of millions of rows — far too large for the API — so the bulk loader streams the ZIPs straight into PostgreSQL `COPY`, measured ~100× faster than row-wise inserts, truncating and reloading on each filing deadline.
- **State election boards** — North Carolina's board, for example, publishes candidate rolls down to county offices; the loader handles federal and state in one pass and defers to FEC where the two overlap.
- **IRS Form 990s** (via ProPublica) — the 501(c)(4) dark-money layer: which nonprofits sit between undisclosed donors and the PACs that spend on races, including c4 → PAC feeder chains.
- **Ad libraries** — Meta's Ad Library and Google's political-ad data, for spend, impressions, and targeting.
- **News and web search** — not for scores directly, but for the agents that find and cite what's on the record. The sourcing rules are hard: social-media-only sources are rejected outright, opposition-research characterizations never source a position, and aggregate scorecard ratings never justify a score on their own — the underlying record must.

Everything lands in **PostgreSQL** — managed Neon in production, with dev branches for local work. The codebase is deliberately old-school about the database: **raw `psycopg2`, no ORM**, additive migrations applied before the code that reads them rolls out (expand/contract), and paranoia-level guardrails: refuse to boot a development environment pointed at the production database, require SSL, and give the database host no default so a misconfiguration fails loudly instead of silently redirecting to a dev database.

Two schema decisions are the difference between an audit trail and a rumor:

**Slugs are identity, and identity is hard.** Races and candidates get UEI-format slugs (e.g. `US26NC0CL2`) — always ten characters, never hand-constructed, with central helpers that must mirror the frontend exactly. This sounds trivial until a name collision quietly merges two candidates: we had a real incident where the same name in two different states was conflated until office-slug decoding caught it. Identity bugs are the most expensive class of bug in a system that publishes verdicts, so slug handling is centralized and tested.

**Policy positions are append-only.** You never mutate an active position row in place; a correction deactivates the old row and appends a new version, and the content hash identifying the position survives the version bump so fixes don't orphan their citations. The same discipline governs the adjudication ledger where review decisions are recorded (each entry noting whether it was decided by script, model, or human) and the audit-findings log.

---

## 4. The pipeline: from race to verdict

The research pipeline is where the AI actually works, and it's built as a graph, not a script — on **LangGraph**, with three compiled graphs: a **per-candidate graph** (research, cross-model validation, revision loops, then writes), a **fit graph** (the three-stage drafting chain that produces dimension scores), and a **per-race graph** (generate the office job description once, then fan out to every candidate).

### Stage 1 — Research ("Sherlock")

For each race, agents research the office-level job description once. For each candidate: background and elected record (with a revision pass), then positions across all 23 policy topics — each carrying a position, a `no public position` flag when the record is silent, and citations — with a gap-fill pass that completes the rubric. Agents have explicit iteration budgets (policy research up to ~30 iterations per node) and source-quality rules. This is agentic search with a purpose: **find the record, don't compose an opinion.**

### Stage 2 — Cross-model verification ("Watson")

Every research product is reviewed by a **second, independent model family** before it's accepted — deliberately, so one vendor's blind spots get caught by a different vendor's reviewer. A resume flows review by one family → revision by another → re-review by a third. Policy research goes through a server-side audit pass with a retry loop, itself validated against the golden anchors (see §6).

### Stage 3 — The disqualifier scan

Every candidate on every tier is scanned for disqualifying conduct — deliberately outside the tier's normal model routing, always at temperature 0, with a fixed set of prescribed searches for six documented categories: false election-fraud claims, attempts to overturn certified results, obstruction of constitutional processes, abuse of office, voter suppression, and supporting pardons for those convicted of violence against constitutional processes.

The scan's error posture is worth stealing: **a false clean — missing a real disqualifier — is treated as the worst-direction failure.** A Not-qualified assessment always carries a documented disqualifier record with sources: an official roll-call vote, a court filing, a verified primary source. An audit of the disqualifier set found every active record resolving to an authoritative source.

### Stage 4 — The fit chain

The draft assessment is produced by a three-step pipeline — **Recruiter → Narrative → Formatter** — at temperatures 0, 0.3, and 0. The Recruiter weighs the evidence against the job description; the Narrative writes it up; the Formatter emits the structured draft scores. Then the draft hits the deterministic boundary: the Publisher recomputes the composite, band, confidence, and review flags exactly as described in §2. Draft scores are not authoritative; recomputed scores are.

### Stage 5 — Human review

Anything flagged — boundary proximity, disqualifier proximity, a failed evidence check, a Watson flag — routes into a review queue. Review nodes in the graph use an interrupt-only pattern with side effects in separate nodes, because a graph engine that re-executes an interrupted node would otherwise double-write. The reviewer workflow lives in a purpose-built admin application where reviewers sign off or revoke, escalate, correct, and — for disqualifiers — explicitly **verify** (which is what triggers the Not-qualified verdict) or **dismiss**. One hard rule governs all of it: **only humans can be verifiers** — batch jobs, tooling, and assistants are deliberately rejected. Verification worksheets cross-check records against cached primary documents — roll-call votes, court filings — and they "report, do not decide." The human decides.

---

## 5. Scoring at scale: the batch path

Research can't be batched — agentic search is inherently online. But the fit chain, once research exists, is embarrassingly parallel: the same three prompts over hundreds of candidates. So production splits the work. A **research phase** runs online, per race, at modest concurrency, with a per-job cost ceiling. A **fit phase** then submits three sequential batch rounds to the Anthropic Message Batches API — the same Recruiter → Narrative → Formatter chain, at roughly **half the price** of online calls, with a ≤24-hour SLA.

The batch path deliberately reuses the interactive path's **byte-identical prompts**, model registry, and write path, so batch and interactive verdicts reconcile exactly — and byte-identity is enforced mechanically: a prompt-freeze file holds SHA-256 hashes of the three fit prompts, and submission is blocked if the live prompts drift from the frozen hashes. Re-baselining a prompt is a deliberate, reviewable operation, not an accident of an edit. End to end, a full race costs on the order of a few dollars in model tokens (measured at roughly $4–6).

The part most people miss is the state machine: **all cross-round state lives in the database, never in memory.** Each batch job's phase, round, and items are rows; a poller advances one round per CronJob tick; errored and expired items are retried. That's because the poller is a CronJob — it can be killed and restarted at any tick, and the system must resume exactly where it left off. A deterministic share of each job is held out for audit sampling, and every written result is traced for observability.

The whole loop is a set of small, digest-pinned Kubernetes CronJobs: research every few minutes, the fit poller, the weekly narrative sweep, daily citation archiving with weekly citation verification, and a read-only data-integrity audit each morning.

---

## 6. Regression anchors: the anti-drift machinery

The scariest property of an LLM pipeline isn't that it fails — it's that it **silently changes**. A prompt edit, a model update, a temperature change, a rubric tweak: any of them can shift scores across verdict bands for candidates who never changed their record. For a platform publishing verdicts about real people, that's a credibility catastrophe: *"Why did this candidate's score drop? What changed?"* — with the honest answer being "nothing about them; something about us."

The answer is **golden regression anchors**: a small set of frozen, human-verified candidate dossiers whose verdicts are the ground truth the pipeline must reproduce. Before any critical re-run or configuration change touches production scoring, an **anchor gate** re-runs the current configuration against the anchors and refuses to proceed unless the outputs match — the verdict exactly, the composite within 0.4, with per-dimension tolerances on top. The gate is keyed by a **configuration fingerprint** — a SHA-256 over the models, the prompt hashes, the instruction builders, and runtime config — so the ledger records not just that a gate passed, but *exactly which configuration* it passed for. Anchors also anchor the people: re-baselining a record, including override-class cases, is a deliberate, reviewable event with a human verification requirement, never a side effect of a re-run.

The reproducibility study behind our adaptive-scoring design shows why this machinery exists. With the web frozen and the pipeline re-run end to end, single runs of the fit chain showed up to a ~1.1 half-spread — a full band of wobble for the same candidate, same record, same prompts. **Median-of-three scoring** collapsed the spread to a 0.45 maximum. Production became adaptive: score once; if the result sits near a band boundary, score again — up to a median of five for the most boundary-proximate cases — and label boundary-proximate verdicts with an explicit "boundary case" note on the public dossier rather than presenting them with false precision. Nearly a third of score-derived candidates sit within that 0.45 tolerance of a band floor; boundary proximity is the rule, not the exception, in competitive races.

---

## 7. What the system looks like from the outside

The public surface is deliberately thin: a React single-page app on Cloudflare Pages reads from the Publisher API — races, candidate assessments, report cards (PDFs rendered server-side), a per-address lookup — and a separate API edge serves licensed data. Under the hood:

- **The Publisher** is a FastAPI service whose entrypoint is tiny — it assembles ~28 route modules plus CORS and middleware; the real weight, ~18,000 lines, lives in per-domain modules: races, resumes, policy, fit, review, batch, finance, narrative, publishing.
- **Auth is layered.** A shared admin key (constant-time compared) guards write and admin endpoints. **Two separate Clerk apps** serve the two populations — public users of the site (accounts, payments, entitlements via Stripe) and pipeline-admin reviewers with role-based routing — because mixing them is how you accidentally give reviewers' powers to users. A staged write-auth mode (off → warn → enforce) governed the lockdown of machine write-back.
- **The edge does security work.** Admin surfaces sit behind Cloudflare Access with service tokens; open-internet requests to the publisher must carry an edge-injected origin-verification header, or come from the private cluster's network. CORS is an explicit allowlist, not a wildcard.

Deployment is GitOps. CI is **path-scoped**: changes under the pipeline directories build a container, push it to a registry, and roll out — to the managed runtime serving production and to a mirrored deployment on a private Kubernetes cluster, with CronJob image digests advanced in lockstep. Doc-only changes never trigger a deploy. The admin app follows a different path: source in one directory, a build step that stages a committed bundle, then a cluster sync — with a standing rule to edit source, never the bundle. ArgoCD-style app-of-apps syncs with pruning and self-healing; CronJob images are digest-pinned (the hard way — after a stale-image incident deployed week-old code and failed 16 of 34 races).

**The test suite is the other half of the trust story**: more than 1,500 test functions across 130 files — since grown past 2,000 — all database calls mocked, golden anchors included, and an integration tier that runs nightly against a real database. The repo treats methodology and tests as one artifact: fidelity-locked prompt tests, quirk tests pinning known oddities so score changes stay attributable to methodology rather than silent drift, and a pre-commit hook that rejects broken JSON (a config file once broke silently three times).

---

## 8. What the failures taught us

Every rule above has a scar behind it:

- **A search-quota failure mid-run once produced unsourced verdicts that were written to production.** The fix: a fail-fast guard — no evidence, no write — five-attempt backoff on upstream rate limits, and explicit research budgets, so a degraded run fails loudly instead of publishing thin work.
- **LLM labels can't be trusted even when they look right.** The 97-of-265 overstated rows, the wrong weighting living in prompt prose, the assessor whose prose said "disqualified" while its structured output said otherwise — each pushed more logic into deterministic code and more reconciliation into the write path.
- **Cross-round state in memory is a lie.** Any job that can be killed and restarted must keep its state where the restart can find it — in the database.
- **Names are not identity.** Same-name-different-state conflation produced wrong merges until slug decoding was made deterministic and central.
- **Migration is a trust exercise.** When the narrative pipeline was ported from its original orchestration DSL to code, the port was kept byte-verbatim — prompts fidelity-locked by tests, known quirks deliberately preserved and pinned — so that any score change after the migration was attributable to the migration, not an accidental behavior shift. The constraint was only relaxed after the legacy system was fully retired.

---

## 9. Why build it this way

There is a simpler architecture for a candidate-scoring site: point a model at a candidate, ask for a score out of ten, and publish. It would be cheaper, faster, and — in the most important sense — worthless. A verdict about a real person that cannot be traced to a source, recomputed by code, and defended in public is not information; it's an opinion wearing a number.

The architecture of cluedindemocracy.ai is an attempt to make the number mean something. Models do the reading — tens of millions of contribution records, roll-call votes, court filings, state election rolls — because that's what they're good at. Deterministic code owns the score because that's what it's for. Independent model families check each other; humans verify the few things that can end a candidacy; frozen regression anchors make sure the system can't quietly change its mind about a candidate who never changed their record. We built it this way because the output had to survive contact with the real world — a candidate's lawyers, an opponent's research, a reporter with a spreadsheet. If the system is working, the only winning move against a Clued In Democracy score is to change the record. That's the point.

---

*This describes the system as designed and built for the 2026 cycle. All scoring is office-relative and evidence-based; an assessment is a statement about documented fitness for a specific office, never a standalone character verdict. If you want more of this kind of work — the documented record, not the press release — subscribe.*

*Disclosure note: scores are computed from documented public record only, with human verification of disqualifying conduct. Nothing in this piece asserts that any individual has engaged in wrongdoing; disqualifier findings are stated as record-based assessments subject to the review process described above.*