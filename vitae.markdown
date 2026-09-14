---
layout: page
title: Vitae
permalink: /vitae/
selected_projects: [vega, avenapay, ledgerflow]
description: "Selected product design leadership work spanning merchant operations, enterprise design systems, fintech workflows, and scalable product foundations."
---
<main class="main vitae" id="main-content" tabindex="-1">
    <section class="vitae-intro page-intro-frame" id="vitae-projects" aria-labelledby="vitae-intro-title" data-search-section data-search-title="Selected Projects" data-search-category="Vitae" data-search-summary="Products and systems I’ve moved forward through complete project narratives and product walkthroughs." data-search-keywords="portfolio vitae case studies product design systems teams">
        <div class="vitae-intro-copy">
            <p class="p section-label page-intro-eyebrow vitae-intro-eyebrow">Selected projects</p>
            <h1 class="h1 page-hero-title vitae-intro-title" id="vitae-intro-title">Products and systems I’ve moved forward.</h1>
        </div>
        <picture class="vitae-intro-artwork" aria-hidden="true">
            <source type="image/avif" srcset="{{ '/images/vitae/hero-geometry.avif' | relative_url }}?v={{ site.asset_version }}">
            <source type="image/webp" srcset="{{ '/images/vitae/hero-geometry.webp' | relative_url }}?v={{ site.asset_version }}">
            <img class="vitae-intro-artwork-image" src="{{ '/images/vitae/hero-geometry.png' | relative_url }}?v={{ site.asset_version }}" width="1448" height="1086" alt="" decoding="async" fetchpriority="high">
        </picture>
    </section>

    <section class="vitae-collection" aria-label="Selected projects">
        <div class="vitae-project-summaries">
            <nav class="vitae-project-index" aria-label="Jump to a selected project" data-liquid-ignore>
                <button class="vitae-project-index-scroll-button vitae-project-index-scroll-button--previous" type="button" data-project-index-previous aria-controls="vitae-project-index-list" aria-label="Show previous projects" hidden><svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M16 10H4M9 5l-5 5 5 5" /></svg></button>
                <ul class="vitae-project-index-list" id="vitae-project-index-list">
                    {% for project_slug in page.selected_projects %}
                    {% assign project = site.data.vitae_projects[project_slug] %}
                    <li><a class="a" href="#project-{{ project_slug }}">{{ project.index_label | default: project.organization }}</a></li>
                    {% endfor %}
                </ul>
                <button class="vitae-project-index-scroll-button vitae-project-index-scroll-button--next" type="button" data-project-index-next aria-controls="vitae-project-index-list" aria-label="Show more projects" hidden><svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M11 5l5 5-5 5" /></svg></button>
            </nav>

            {% for project_slug in page.selected_projects %}
            {% assign project = site.data.vitae_projects[project_slug] %}
            {% assign project_preview = project.vitae_cover | default: project.cover %}
            {% assign project_highlight = project.highlights | first %}
            <article class="vitae-project-summary" id="project-{{ project_slug }}" aria-labelledby="{{ project_slug }}-title" data-search-section data-search-title="{{ project.name }}" data-search-category="Vitae" data-search-summary="{{ project.introduction }}" data-search-keywords="{{ project.keywords }}">
                <header class="vitae-project-summary-copy" data-reveal="up">
                    <p class="p project-story-meta">{{ project.discipline }}</p>
                    <h3 class="h3 project-story-title" id="{{ project_slug }}-title"><a class="a project-story-title-link" href="{{ '/vitae/' | append: project_slug | append: '/' | relative_url }}">{{ project.headline }}</a></h3>
                    <p class="p project-story-intro">{{ project.introduction }}</p>
                    <div class="button-group project-story-actions">
                        <a class="a button button-container secondary project-story-page-link" href="{{ '/vitae/' | append: project_slug | append: '/' | relative_url }}" aria-label="Explore project">Explore project<span class="button-shadow" aria-hidden="true"></span><span class="button-face-container" aria-hidden="true"><span class="button-face">Explore project <svg class="button-external-icon" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M11 5l5 5-5 5" /></svg></span></span></a>
                        {% if project.external_url %}
                        <a class="a button button-container primary project-story-link" href="{{ project.external_url }}" target="_blank" rel="noopener noreferrer" aria-label="{{ project.external_label }}">{{ project.external_label }}<span class="button-shadow" aria-hidden="true"></span><span class="button-face-container" aria-hidden="true"><span class="button-face">{{ project.external_label }} <svg class="button-external-icon" viewBox="0 0 20 20" fill="none"><path d="M5 15 15 5M8 5h7v7" /></svg></span></span></a>
                        {% endif %}
                    </div>
                </header>
                <figure class="vitae-project-summary-visual" data-reveal="{% cycle 'right', 'left' %}">
                    <img width="1448" height="1086" src="{{ project_preview | relative_url }}?v={{ site.asset_version }}" alt="{{ project.organization }} — {{ project_highlight.title }}" loading="lazy" decoding="async">
                </figure>
            </article>
            {% endfor %}
        </div>
    </section>

    <section class="vitae-summary" id="design-leadership-principles" data-search-section data-search-title="Product Design Leadership Principles" data-search-category="Approach" data-search-keywords="clarity complexity systems momentum leadership execution product territory">
        <div class="vitae-summary-next" data-reveal="up">
            <div>
                <p class="p vitae-summary-eyebrow">What comes next</p>
                <h3 class="h3">If your team is entering unfamiliar product territory, let’s create a clear path forward together.</h3>
            </div>
            <ul class="vitae-summary-principles" aria-label="Principles reflected across the selected work">
                <li data-reveal="right">
                    <p class="p vitae-summary-number" aria-hidden="true">01</p>
                    <h3 class="h3">Clarity from collaboration and coordination</h3>
                    <p class="p">Start with the decisions people need to make, then shape the product around helping them make those decisions well.</p>
                </li>
                <li data-reveal="up">
                    <p class="p vitae-summary-number" aria-hidden="true">02</p>
                    <h3 class="h3">Systems and teams that create momentum</h3>
                    <p class="p">Build reusable foundations that improve quality and speed without flattening the needs of the product or the people using it.</p>
                </li>
                <li data-reveal="left">
                    <p class="p vitae-summary-number" aria-hidden="true">03</p>
                    <h3 class="h3">Leading from vision and innovation</h3>
                    <p class="p">Align teams around a direction, stay close enough to the work to protect its intent, and help strong ideas make it into the product.</p>
                </li>
            </ul>
            <div class="button-group vitae-summary-actions">
                <a class="a button button-container secondary" href="https://www.figma.com/@jmwii1981" target="_blank" rel="noopener noreferrer" aria-label="See more in figma">See more in figma<span class="button-shadow" aria-hidden="true"></span><span class="button-face-container" aria-hidden="true"><span class="button-face">See more in figma <svg class="button-external-icon" viewBox="0 0 20 20" fill="none"><path d="M5 15 15 5M8 5h7v7" /></svg></span></span></a>
                <a class="a button button-container primary" href="{{ '/contact/' | relative_url }}" aria-label="Start a conversation">Start a conversation<span class="button-shadow" aria-hidden="true"></span><span class="button-face-container" aria-hidden="true"><span class="button-face">Start a conversation</span></span></a>
            </div>
        </div>
    </section>
</main>
