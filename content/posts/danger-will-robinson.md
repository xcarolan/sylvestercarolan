---
title: Danger Will Robinson
subtitle: AI Safety
category:
  - Technology
author: Sylvester Carolan
date: 2026-11-23T15:49:36.584Z
featureImage: /uploads/danger-will-robinson-hero.jpg
draft: false
---
I've been in IT for a long time. I've seen plenty of production issues—and yes, caused a few myself. Like the time when I was much younger and ignored a compiler warning (it was only a warning, after all). An 'O' that should have been a '0' caused trade reporting at a major investment bank to stop processing. I fixed the bug quickly, but spent most of the next few weeks cleaning up the mess.


That's the catch with automation: get it wrong, and the blast radius travels through a company faster than a bad rumor. These days, we have much better safeguards—automated tests, release pipelines, CVE checks, and static code analysis. Even so, the landscape today is far more complex.


There is constant pressure to deliver, deliver, deliver. Too often, safety and security get pushed to another day, with only the bare minimum delivered to satisfy internal controls or external regulations. Leadership wants the next shiny thing, lower costs, and a quick win. Nobody wants an outage, yet guardrails routinely get de-prioritized when the upside feels clear and the risk feels distant.


That risk isn't distant anymore. Over the past few weeks, we've seen a wave of outages across major U.S. firms—grounded flights, banks offline, Microsoft services down. The causes are still being sorted out, but some have reportedly been linked to rushed fixes for vulnerabilities that AI tools had discovered. Urgency, tight deadlines, cut corners: I've watched that pattern play out time and again.

And what about AI itself? The rush to adopt it—and the fear of falling behind—is everywhere.


I've been working with AI for a while now. Early on, the hallucinations and errors made it hard to trust for serious work. As models improved and integrations like RAG and MCP matured, real automation became possible—building software, training models, and wiring up production workflows.


That's when something stopped me cold: how easily the safeguards on open-weights models can be bypassed. Frontier models are harder to break, though not impossible, but open-weights models have become remarkably capable, and anyone who downloads one can strip its guardrails out.


My compiler warning was a safeguard I chose to ignore. With open weights, anyone can delete the warning entirely.


So what's to be done? I don't have the answers — I'm not sure anyone does yet. But something needs to be done, and some people are already trying. In Part 2, I'll highlight the organizations working on keeping AI safe — and where they're falling short.

![Two engineers gesturing at large monitors displaying "CRITICAL ERROR — ALL PROCESS TERMINATED"](/uploads/danger-will-robinson-1.jpg)
