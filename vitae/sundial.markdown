---
layout: page
title: Sundial — A calmer way to plan
project: sundial
permalink: /vitae/sundial/
date_modified: 2026-10-28T03:30:00Z
description: "How Jan Michael Wallace II is shaping Sundial: an accessibility-led planning experience with clearer time, flexible views and an evolving design system."
social_image: /images/projects/sundial/history.png
social_image_alt: "Sundial local prototype showing an empty completed-task history"
social_image_width: 1480
social_image_height: 1221
social_image_type: image/png
---
<main class="main vitae sundial-case" id="main-content" tabindex="-1" data-dock-all-sections>
  <a class="sundial-return" href="{{ '/vitae/' | relative_url }}">Return to selected work</a>
  <header class="sundial-case-intro">
    <p class="sundial-eyebrow">SUNDIAL · PRODUCT DIRECTION &amp; DESIGN</p>
    <h1>Structure for the day.<br>Space for the person.</h1>
    <p class="sundial-deck">I’m shaping Sundial around a simple ambition: help people make sense of their day without making the planner another thing they have to manage.</p>
    <p class="sundial-case-status">An evolving product · Local prototype reviewed · Private beta in preparation</p>
  </header>
  {% include sundial-study.html %}
  <nav class="sundial-case-chapters" aria-label="Sundial case study chapters"><a href="#sundial-intent">Intent</a><a href="#sundial-decisions">Decisions</a><a href="#sundial-system">System</a><a href="#sundial-progress">Progress</a></nav>
  <section class="sundial-case-section" id="sundial-intent" aria-labelledby="sundial-intent-title" data-dock-section data-dock-label="Intent">
    <h2 id="sundial-intent-title">A planner should support the person using it.</h2>
    <div class="sundial-prose"><p>Accessibility is a central reason I’m building Sundial. I care about creating useful structure for people with ADHD, while leaving room for different ways of thinking and working. That focus shapes both the structure of the day and the freedom to approach it differently.</p><p>I wanted the experience to make the next step easier to see. The day should have a readable shape, tasks should be easy to distinguish, and finishing something should feel visible. At the same time, a planning tool needs enough flexibility to handle work that has a time, work that is coming up, and things someone simply does not want to forget.</p><p>My role has been to set that product direction, refine the Figma design and guide the decisions that connect the interface with its implementation. I’ve been working through those decisions as a system: how the views relate, how time is represented, how controls behave, and which details add clarity rather than distraction.</p></div>
  </section>
  <section class="sundial-case-section" id="sundial-decisions" aria-labelledby="sundial-decisions-title" data-dock-section data-dock-label="Decisions">
    <h2 id="sundial-decisions-title">Give time a shape, without forcing every task into it.</h2>
    <div class="sundial-prose"><p>Grid gives the day distinct parts. Timeline keeps it continuous. List removes the time axis, and Kanban makes the state of the work easier to see. Today offers those four views. Next up, Don’t forget and Want to are List-only. The distinction keeps the navigation connected to what someone is trying to do.</p><p>Scheduled tasks use their duration to determine their space. A short task should not look like an hour of work, and an open interval should read as available time rather than a stack of empty rows. The prototype uses one shared time scale so task placement, gaps and the current-time marker stay connected.</p><p>That visual choice creates a tradeoff. A fifteen-minute block is compact, and it cannot also contain every control at a large touch-target size without colliding with nearby time. The refined interface keeps compact controls at least 24 pixels wide and high, while List offers more space away from a time axis. Full titles remain available through editing. Real-device evaluation is still needed.</p></div>
    <div class="sundial-decision-pair"><article><p class="sundial-eyebrow">CLEARER TIME</p><h3>Duration carries meaning.</h3><p>One time scale connects scheduled work with the space between it. A new task starts with a small, explicit duration rather than consuming an entire open interval.</p></article><article><p class="sundial-eyebrow">LESS COMPETITION</p><h3>Feedback has a purpose.</h3><p>Completion gives progress a visible place. Decorative motion stays restrained, with a small clock-hands interaction as the deliberate exception.</p></article></div>
  </section>
  <section class="sundial-case-section" id="sundial-system" aria-labelledby="sundial-system-title" data-dock-section data-dock-label="System">
    <h2 id="sundial-system-title">Make the decisions reusable.</h2>
    <div class="sundial-prose"><p>I refined the interface around Inter, the supplied SVG icons, a shared palette and consistent component anatomy. Grid and Flex layouts let the structure respond to available space instead of scaling a fixed picture of the design.</p><p>The refinement went beyond the main dashboard. Forms needed persistent labels, readable errors and a clear selected duration. Collections needed more room than time-based blocks. Calendar controls needed a stable position as dates changed, and navigation needed to keep the selected category and view understandable.</p><p>Those details belong together. Shared spacing, semantic colors and repeated patterns help a change made in one surface remain coherent elsewhere. They also make accessibility questions easier to find and discuss before the visual language becomes harder to change.</p></div>
    <figure class="sundial-source-capture"><a href="{{ '/images/projects/sundial/history.png' | relative_url }}" aria-label="Open full-size Sundial history prototype screenshot"><img src="{{ '/images/projects/sundial/history.png' | relative_url }}" width="1480" height="1221" alt="Sundial local prototype: a History heading, return-to-planner action and an empty completed-task history with explanatory copy" loading="lazy" decoding="async"></a><figcaption>A captured local prototype state: history explains what will appear before a task is completed. This is interface evidence, not production usage.</figcaption></figure>
  </section>
  <section class="sundial-case-section" id="sundial-progress" aria-labelledby="sundial-progress-title" data-dock-section data-dock-label="Progress">
    <h2 id="sundial-progress-title">Progress I can show. Questions still to answer.</h2>
    <div class="sundial-prose"><p>The current work has a functional local prototype and a documented visual and interaction review. Local checks cover interaction paths and implementation rules, including scheduling conflicts, duration changes, navigation and task completion. The review documents what was inspected in the prototype. Learning how it supports people over time is still ahead.</p><p>The review led to stronger empty-state text contrast and larger activation areas for compact controls. Those improvements have been checked locally. Broader assistive-technology, device and real-use evaluation are still needed.</p><p>Private-beta preparation is underway. The next stage is to carry the reviewed design into a dependable integrated experience, then learn from people using it.</p><p>The next test is whether these decisions make planning feel clearer when a day changes.</p></div>
  </section>
  <footer class="sundial-case-close"><h2>Good structure makes room.</h2><p>I’m interested in products that bring clarity to complex work without making people feel they need to become more like the system.</p><a href="{{ '/contact/' | relative_url }}">Let’s talk about what you’re building</a><a href="{{ '/vitae/' | relative_url }}">Explore more selected work</a></footer>
</main>
