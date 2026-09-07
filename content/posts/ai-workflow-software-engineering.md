---
title: 'My Experience Building an AI Workflow — and What It Taught Me About Software Engineering'
subtitle: '97% of software engineers use AI. Only 3% trust it.'
category:
  - Technology
author: Sylvester Carolan
date: 2026-06-04T00:00:00.000Z
featureImage: /uploads/ai-workflow-hero.png
draft: true
---
97% of software engineers use AI. Only 3% trust it.

That statistic stopped me mid-scroll last week, and I've been turning it over since. The gap between adoption and trust isn't a gap in the technology — it's a gap in understanding. And most of what I've learned about that gap, I didn't learn from a course or a conference. I learned it the hard way, building something I wasn't sure would work.

## How it started

I was looking at LinkedIn profiles one day — recruiters, hiring managers, the usual stream — and a thought occurred to me: what if we ran elected representatives through the same kind of AI evaluation that job candidates routinely face? Not as a political statement. More as an experiment. A check on whether the standard we apply to job applicants holds up when applied to the people we actually entrust with power.

That question became CluedIn Democracy — an AI workflow designed to assess candidates against a consistent, non-partisan scoring guide: constitutional fidelity and constituent representation. The mission is straightforward. The build has been anything but.

## What building it actually looked like

The approach I've used to develop software for the better part of two decades is, for all practical purposes, gone. I don't mean that as a lament — it's just an accurate description of what happened. The workflow changed. The tools changed. The mental model changed.

What hasn't changed is the underlying need for engineering judgment.

The most consequential skill in an AI-assisted development workflow isn't prompt writing in the sense most people mean it. It's specification. Experienced engineers who understand technical dependencies, scaling constraints, tooling limitations, and edge cases are exactly the people who can translate those concerns into the kind of precise, unambiguous language that actually produces reliable output from an AI system.

I've learned the hard way that prompt quality isn't just about clarity — it comes down to word selection. A vague prompt produces vague code. An imprecise specification produces imprecise behavior. The same instincts that made a good technical spec in 2005 make a good AI prompt in 2025. The medium changed. The underlying discipline didn't.

What also hasn't changed: the value of being able to smell bad code. That instinct — developed over years of working across different stacks, different architectures, and different failure modes — is not something a model can replicate. It's pattern recognition built from scars. And it turns out to be one of the most useful things you can bring to an AI-assisted workflow.

## On model selection — a word of honesty

The question I get most often from engineers exploring this space is some version of: "Which model are you using?"

The honest answer: I jumped in and started testing. Trial and error across different models, different tooling, different parameters. It was often frustrating, sometimes expensive. It was, ultimately, the only way I found that actually worked.

Every model is genuinely different — different architecture, different training data, different weights and parameters. What performs well on one task will underperform on another. There's no universal answer, and anyone telling you otherwise is either selling something or working on a narrow enough problem that their experience doesn't generalize.

My background is broad rather than deep. I've worked across a lot of technologies without being a deep specialist in any of them. That turned out to be an advantage. I was less attached to any single approach, which made it easier to adapt, and my exposure to multiple failure modes meant I could recognize when something was going wrong before it became a bigger problem.

## What I'd tell someone starting this now

Three things:

The role of the experienced engineer isn't shrinking — it's shifting. The people who understand how systems actually fail are the same people who can specify systems that actually work.

Prompt engineering is a technical specification with a new name. Take it as seriously as you'd take any other technical artifact. Word selection matters.

Pick a problem you're genuinely curious about. The learning curve in this space is real, and the carrying cost — financially, cognitively, emotionally — is not trivial. Having a mission behind the work makes the frustrating stretches survivable.

CluedIn Democracy is still evolving. The workflow has gone through multiple iterations. Some of them didn't work. That's fine. What I'm confident in is the direction: apply the same standard to our representatives that we apply to everyone else, consistently, without partisan bias, and let the results speak.

That still seems worth building.
