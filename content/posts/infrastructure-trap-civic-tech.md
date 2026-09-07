---
title: 'The Infrastructure Trap: Why Civic Tech Tools Never Ship'
subtitle: Confessions of an over-engineer building a cathedral for a congregation that doesn't exist
category:
  - Technology
author: Sylvester Carolan
date: 2025-10-15T20:00:00-05:00
featureImage: /uploads/infrastructure-trap-featured.jpeg
draft: true
---
My wife has a pet peeve about me. She calls it "infrastructure syndrome." I'll spend three hours configuring a backup system for a project that doesn't have any data worth backing up yet. The other night she walked by my desk, saw me tweaking nginx configs for the hundredth time, and just sighed. "You're building a cathedral for a congregation that doesn't exist."

She's not wrong.

## The WeVote Trap

I've been working on WeVote — a social voter network to help people make informed ballot decisions — for longer than I care to admit. The idea is simple: give voters a way to see what their friends and trusted organizations think about candidates and measures, so they walk into the voting booth actually knowing what's on their ballot.

Simple idea. Complicated execution.

The backend is Django. The frontend is React (v17, which was modern when I started). It needs a database, obviously. And it should probably be containerized for deployment. But wait — if it's containerized, I need orchestration. So I set up k3s on my Proxmox host. Then I need monitoring. And proper SSL. And a CI/CD pipeline. And security hardening. And suddenly I'm three weeks into configuring Tailscale networks and Ollama models and I haven't written a single line of code that actually helps someone vote smarter.

This isn't unique to me. I've talked to other civic tech builders who've fallen into the same trap. We convince ourselves that we need the "proper" infrastructure before we can serve users. We become architects of empty buildings.

## The AI Distraction

Then there's the AI piece. I've got Claude, Gemini, and a local Phi3 model all wired into my OpenClaw setup now. I can query them from Telegram. I can route between them based on task complexity. It's genuinely useful for coding help and research.

But here's the thing: I've spent more time optimizing my AI billing tracking (trying to get accurate spend data from Google Cloud's byzantine console) than I've spent using those AI tools to actually improve WeVote's voter matching algorithm.

The infrastructure became the product.

## What Actually Matters

I had a moment of clarity last week. I was debugging a CrashLoopBackOff in my k3s cluster — the nginx container was listening on port 8000 but the deployment spec said 3000. Classic gotcha. Twenty minutes of kubectl logs and I finally patched it.

But then I asked myself: how many users were affected by this outage?

Zero. There are no users. It's just me, testing locally.

Meanwhile, the actual product needs — better ballot data import, a smoother onboarding flow, mobile responsiveness — sit untouched in the backlog. Features that would actually help actual voters are deprioritized behind "proper" infrastructure for a theoretical future scale.

## The Fix (For Me, Maybe For You)

I'm not saying infrastructure doesn't matter. When you do have users, you want to keep them safe and keep the service running. But there's a difference between "minimum viable security" and "Fort Knox for a prototype."

Here's what I'm trying now:

**1. Ship the ugly version first.** My new rule: if it works on localhost with `python manage.py runserver`, that's good enough to show five people. Those five people's feedback matters more than perfect container orchestration.

**2. Time-box infrastructure work.** I'm giving myself one hour per week for "improvement" tasks — whether that's security hardening, CI/CD tweaks, or model optimization. When the hour's up, I go back to user-facing features.

**3. Separate exploration from production.** It's fine to tinker with k3s and AI model routing — that's how we learn. But I need to be honest about whether that tinkering is moving the product forward or just scratching an intellectual itch.

**4. Measure what matters.** I've started tracking "time spent on user-visible improvements" vs "time spent on infrastructure." The ratio was embarrassing at first. Now it's getting better.

## The Real Product

WeVote isn't going to succeed because it has the cleanest Kubernetes manifests or the most sophisticated AI assistant integration. It's going to succeed if it helps someone walk into their polling place and confidently vote for down-ballot candidates they've never heard of, based on recommendations from people they trust.

Everything else is just noise.

So if you're building something — especially something in civic tech where the problems feel urgent and the stakes feel high — take a hard look at what you're actually spending time on. Are you building the cathedral? Or are you serving the congregation?

Your users don't care about your infrastructure. They care about whether you solve their problem.

---

*If you're working on civic tech and want to compare notes on avoiding the infrastructure trap, hit me up. I'm still learning this lesson the hard way.*
