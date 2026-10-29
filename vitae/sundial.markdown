---
layout: page
title: Sundial — A clearer shape for the day
project: sundial
permalink: /vitae/sundial/
date_modified: 2026-10-28T11:30:00Z
description: "Jan Michael Wallace II on designing Sundial: making time visible, keeping progress in view and connecting a flexible planner through a shared design system."
social_image: /images/projects/sundial/planner.png
social_image_alt: "Sundial desktop prototype with a coherent illustrative day and completed tasks"
social_image_width: 1600
social_image_height: 740
social_image_type: image/png
---
<main class="main vitae sundial-case" id="main-content" tabindex="-1" data-dock-all-sections>
  <a class="sundial-return" href="{{ '/vitae/' | relative_url }}">Return to selected work</a>
  <header class="sundial-case-intro">
    <p class="sundial-eyebrow">SUNDIAL · PRODUCT DIRECTION &amp; DESIGN</p>
    <h1>A clearer shape<br>for the day.</h1>
    <p class="sundial-deck">I’m designing Sundial to make time easier to understand, the next step easier to see and progress worth noticing.</p>
    <p class="sundial-case-status">Independent product · Interaction design &amp; design system · Private beta in preparation</p>
  </header>
  {% include sundial-study.html %}
  <nav class="sundial-case-chapters" aria-label="Sundial case study chapters"><a href="#sundial-intent">01 · Intent</a><a href="#sundial-decisions">02 · Time</a><a href="#sundial-progress">03 · Progress</a><a href="#sundial-system">04 · System</a></nav>
  <section class="sundial-case-section" id="sundial-intent" aria-labelledby="sundial-intent-title" data-dock-section data-dock-label="Intent">
    <div class="sundial-section-title"><p class="sundial-eyebrow">01 · STARTING POINT</p><h2 id="sundial-intent-title">Start with the next decision.</h2></div>
    <div class="sundial-prose"><p>I care about building useful structure for people with ADHD and different ways of thinking. That is a central reason I’m developing Sundial. I wanted a planner that helps someone understand what is in front of them without asking them to organize everything before they can begin.</p><p>I set the product direction, refined the Figma design and guided the interaction and design-system decisions through implementation review. My focus has been the relationship between the parts: how a day is divided, where a task belongs, what its duration means and how the interface responds when it is finished.</p><p>I separated work that belongs on today’s schedule from work that needs a place to wait. Today offers Grid, Timeline, List and Kanban. The Next up, Don’t forget and Want to collections use List only. The choice of view stays close to the kind of decision someone is making.</p></div>
  </section>
  <section class="sundial-case-section" id="sundial-decisions" aria-labelledby="sundial-decisions-title" data-dock-section data-dock-label="Time">
    <div class="sundial-section-title"><p class="sundial-eyebrow">02 · MAKING TIME VISIBLE</p><h2 id="sundial-decisions-title">Show what time actually holds.</h2></div>
    <div class="sundial-prose"><p>A list can give a fifteen-minute task and ninety minutes of focused work the same visual weight. In Sundial’s scheduled views, duration determines the space a task occupies. Hour labels, task placement and the current-time marker follow one scale, so the day can be read as time rather than as a stack of equally sized items.</p><p>I wanted open time to feel available. Each free interval has one place to add something, and a new task begins with an explicit fifteen-minute duration. It does not silently take over the whole gap.</p><p>Grid divides the day into parts, but a task can cross those boundaries. I kept that work connected through continuation edges and a repeated title. In the example below, a review begins at 11:30 and continues into the afternoon. It remains one task even though the view shows it in two places.</p></div>
    <div class="sundial-detail-pair">
      <figure class="sundial-detail"><a href="{{ '/images/projects/sundial/duration.png' | relative_url }}" aria-label="Open full-size morning duration detail"><img src="{{ '/images/projects/sundial/duration.png' | relative_url }}" width="526" height="603" alt="Desktop Morning card: a short priorities task, a ninety-minute layout exploration and a design review beginning at 11:30" loading="lazy" decoding="async"></a><figcaption><span>01 · Relative duration</span>A short task and a focused work block occupy different amounts of time. The current-time marker uses that same scale.</figcaption></figure>
      <figure class="sundial-detail"><a href="{{ '/images/projects/sundial/continuation.png' | relative_url }}" aria-label="Open full-size afternoon continuation detail"><img src="{{ '/images/projects/sundial/continuation.png' | relative_url }}" width="526" height="603" alt="Desktop Afternoon card: the same design review continues at noon, followed by distinct prototype, reading and preparation tasks" loading="lazy" decoding="async"></a><figcaption><span>02 · Continuity across noon</span>The review carries into the next daypart. Its continuation edge and title preserve the connection.</figcaption></figure>
    </div>
  </section>
  <section class="sundial-case-section sundial-completion-section" id="sundial-progress" aria-labelledby="sundial-progress-title" data-dock-section data-dock-label="Progress">
    <div class="sundial-section-title"><p class="sundial-eyebrow">03 · CLOSING THE LOOP</p><h2 id="sundial-progress-title">Keep finished work in view.</h2></div>
    <div class="sundial-prose"><p>Finishing a task should change the experience. I kept a completed task visible in the schedule and brought it into a dedicated progress panel. The day still shows where the time went, while the completed work has a place of its own.</p><p>In this example, setting priorities and reviewing the brief are finished. Their checked states appear in the morning, and both tasks appear under “You did it!” The action can be reversed by unchecking a task. History provides another route back to completed work.</p><p>I kept the feedback restrained. The check, the task title and its new place in the completion panel do the work. Motion is limited to the deliberate clock-hands interaction, with reduced-motion behavior respected.</p></div>
    <figure class="sundial-detail sundial-completion-detail"><a href="{{ '/images/projects/sundial/completion.png' | relative_url }}" aria-label="Open full-size completed-task detail"><img src="{{ '/images/projects/sundial/completion.png' | relative_url }}" width="296" height="215" alt="Desktop completion panel headed You did it, with Review the brief and Set priorities checked and struck through" loading="lazy" decoding="async"></a><figcaption><span>03 · Visible completion</span>Two completed sample tasks, captured after using the planner’s checkboxes.</figcaption></figure>
  </section>
  <section class="sundial-case-section" id="sundial-system" aria-labelledby="sundial-system-title" data-dock-section data-dock-label="System">
    <div class="sundial-section-title"><p class="sundial-eyebrow">04 · CONNECTING THE DETAILS</p><h2 id="sundial-system-title">Make the decisions hold together.</h2></div>
    <div class="sundial-prose"><p>I refined the visual language around Inter, the supplied SVG artwork, shared spacing and semantic colors. Grid and Flex layouts carry those decisions across the interface. The aim is for a change to improve a pattern wherever it appears, rather than fixing one screen in isolation.</p><p>That work reaches into the quieter moments: a form label that stays visible, an error that explains what needs to change, a selected duration that is clear, and a calendar that stays in place while dates change. These details are part of the planning experience, not finishing touches around it.</p><p>Review also led to stronger empty-state text contrast and larger activation areas for compact controls. A dense time scale still creates a real constraint: a fifteen-minute block cannot hold every control at a generous size. The refined compact targets and the more spacious List view are part of the response. Real-device and assistive-technology evaluation remain ahead.</p><p>Sundial is in private-beta preparation. The interface shown here has been reviewed locally for visual and interaction behavior. I can show the design decisions and working interactions here; how the product supports people over time is the next thing to learn.</p></div>
  </section>
  <footer class="sundial-case-close"><h2>Thoughtful structure.<br>Room to move forward.</h2><p>I’m interested in products that make complex work easier to approach. Sundial is an ongoing exploration of how clarity, flexibility and visible progress can work together.</p><a href="{{ '/contact/' | relative_url }}">Let’s talk about what you’re building</a><a href="{{ '/vitae/' | relative_url }}">Explore more selected work</a></footer>
</main>
