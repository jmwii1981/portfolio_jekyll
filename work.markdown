---
layout: page
title: Work
permalink: /work/
description: "Selected product design leadership work spanning merchant operations, enterprise design systems, fintech workflows, and scalable product foundations."
---
<main class="main work" id="main-content" tabindex="-1">
    <section class="work-intro page-intro-frame" id="selected-work" aria-labelledby="work-intro-title" data-search-section data-search-title="Selected Projects" data-search-category="Work" data-search-summary="Products and systems I’ve moved forward through complete project narratives and product walkthroughs." data-search-keywords="portfolio case studies product design systems teams">
        <div class="work-intro-copy">
            <p class="p section-label page-intro-eyebrow work-intro-eyebrow">Selected projects</p>
            <h1 class="h1 page-hero-title work-intro-title" id="work-intro-title">Products and systems I’ve moved forward.</h1>
        </div>
    </section>

    <section class="work-collection" aria-label="Selected projects">
        <div class="work-project-summaries">
            <nav class="work-project-index" aria-label="Jump to a selected project" data-liquid-ignore>
                <button class="work-project-index-scroll-button work-project-index-scroll-button--previous" type="button" data-project-index-previous aria-controls="work-project-index-list" aria-label="Show previous projects" hidden><svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M16 10H4M9 5l-5 5 5 5" /></svg></button>
                <ul class="work-project-index-list" id="work-project-index-list">
                    {% for project_entry in site.data.work_projects %}
                    {% assign project_slug = project_entry[0] %}
                    {% assign project = project_entry[1] %}
                    <li><a class="a" href="#project-{{ project_slug }}"><span aria-hidden="true">0{{ forloop.index }}</span> {{ project.index_label | default: project.organization }}</a></li>
                    {% endfor %}
                </ul>
                <button class="work-project-index-scroll-button work-project-index-scroll-button--next" type="button" data-project-index-next aria-controls="work-project-index-list" aria-label="Show more projects" hidden><svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M11 5l5 5-5 5" /></svg></button>
            </nav>

            {% for project_entry in site.data.work_projects %}
            {% assign project_slug = project_entry[0] %}
            {% assign project = project_entry[1] %}
            {% assign project_preview = project.work_cover | default: project.cover %}
            {% assign project_highlight = project.highlights | first %}
            <article class="work-project-summary" id="project-{{ project_slug }}" aria-labelledby="{{ project_slug }}-title" data-search-section data-search-title="{{ project.name }}" data-search-category="Selected Work" data-search-summary="{{ project.introduction }}" data-search-keywords="{{ project.keywords }}">
                <header class="work-project-summary-copy" data-reveal="up">
                    <p class="p project-story-meta">{{ project.organization }} <span aria-hidden="true">/</span> {{ project.discipline }}</p>
                    <h3 class="h3 project-story-title" id="{{ project_slug }}-title"><a class="a project-story-title-link" href="{{ '/work/' | append: project_slug | append: '/' | relative_url }}">{{ project.headline }}</a></h3>
                    <p class="p project-story-intro">{{ project.introduction }}</p>
                    <div class="button-group project-story-actions">
                        <a class="a button secondary project-story-page-link" href="{{ '/work/' | append: project_slug | append: '/' | relative_url }}"><span class="button-label">Explore project <svg class="button-external-icon" aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M11 5l5 5-5 5" /></svg></span></a>
                        {% if project.external_url %}
                        <a class="a button primary project-story-link" href="{{ project.external_url }}" target="_blank" rel="noopener noreferrer"><span class="button-label">{{ project.external_label }} <svg class="button-external-icon" aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M5 15 15 5M8 5h7v7" /></svg></span></a>
                        {% endif %}
                    </div>
                </header>
                <figure class="work-project-summary-visual" data-reveal="{% cycle 'right', 'left' %}">
                    <img width="1448" height="1086" src="{{ project_preview | relative_url }}?v={{ site.asset_version }}" alt="{{ project.organization }} — {{ project_highlight.title }}" loading="lazy" decoding="async">
                </figure>
            </article>
            {% endfor %}
        </div>
    </section>

    <section class="work-summary" id="design-leadership-principles" aria-labelledby="work-summary-title" data-search-section data-search-title="Product Design Leadership Principles" data-search-category="Approach" data-search-keywords="clarity complexity systems momentum leadership execution product territory">
        <div class="work-summary-intro" data-reveal="up">
            <p class="p work-summary-eyebrow">The throughline</p>
            <h2 class="h2 work-summary-title" id="work-summary-title">Every challenge is different. Progress starts with clarity.</h2>
            <p class="p work-summary-statement">Across platforms, systems, and teams, my role is consistent: make complexity understandable, create the structure people need to move together, and turn ambitious product decisions into work that can scale.</p>
        </div>

        <ul class="work-summary-principles" aria-label="Principles reflected across the selected work">
            <li data-reveal="right">
                <p class="p work-summary-number" aria-hidden="true">01</p>
                <h3 class="h3">Clarity before complexity</h3>
                <p class="p">Start with the decisions people need to make, then shape the product around helping them make those decisions well.</p>
            </li>
            <li data-reveal="up">
                <p class="p work-summary-number" aria-hidden="true">02</p>
                <h3 class="h3">Systems that create momentum</h3>
                <p class="p">Build reusable foundations that improve quality and speed without flattening the needs of the product or the people using it.</p>
            </li>
            <li data-reveal="left">
                <p class="p work-summary-number" aria-hidden="true">03</p>
                <h3 class="h3">Leadership through execution</h3>
                <p class="p">Align teams around a direction, stay close enough to the work to protect its intent, and help strong ideas make it into the product.</p>
            </li>
        </ul>

        <div class="work-summary-next" data-reveal="up">
            <div>
                <p class="p work-summary-eyebrow">What comes next</p>
                <h3 class="h3">If your team is entering unfamiliar product territory, let’s create a clear path forward together.</h3>
            </div>
            <div class="button-group work-summary-actions">
                <a class="a button secondary" href="https://www.figma.com/@jmwii1981" target="_blank" rel="noopener noreferrer"><span class="button-label">See more in Figma <svg class="button-external-icon" aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M5 15 15 5M8 5h7v7" /></svg></span></a>
                <a class="a button primary" href="{{ '/contact/' | relative_url }}"><span class="button-label">Start a conversation</span></a>
            </div>
        </div>
    </section>
</main>
