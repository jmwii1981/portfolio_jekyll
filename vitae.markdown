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
            <h1 class="h1 page-hero-title vitae-intro-title" id="vitae-intro-title">Leading, Shaping &amp; Shipping.</h1>
            <p class="p vitae-intro-statement">Leading through service to my team and the people around us, I create to show what’s possible and collaborate to explore what it could become—asking questions, offering perspective, and challenging assumptions along the way.</p>
            <p class="p vitae-intro-statement">A clear vision, creative freedom, and shared determination turn that possibility into an excellent product. I’m excited to share the outcomes of that work with you now.</p>
        </div>
    </section>

    <section class="vitae-collection" aria-label="Selected projects">
        <div class="vitae-project-summaries">
            <nav class="vitae-project-index" aria-label="Jump to a selected project" data-liquid-ignore>
                <button class="button-container secondary vitae-project-index-scroll-button vitae-project-index-scroll-button--previous" type="button" data-project-index-previous aria-controls="vitae-project-index-list" aria-label="Show previous projects" hidden><span class="button-shadow" aria-hidden="true"></span><span class="button-face-container" aria-hidden="true"><span class="button-face"><svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M16 10H4M9 5l-5 5 5 5" /></svg></span></span></button>
                <ul class="vitae-project-index-list" id="vitae-project-index-list">
                    {% for project_slug in page.selected_projects %}
                    {% assign project = site.data.vitae_projects[project_slug] %}
                    <li><a class="a" href="#project-{{ project_slug }}">{{ project.index_label | default: project.organization }}</a></li>
                    {% endfor %}
                </ul>
                <button class="button-container secondary vitae-project-index-scroll-button vitae-project-index-scroll-button--next" type="button" data-project-index-next aria-controls="vitae-project-index-list" aria-label="Show more projects" hidden><span class="button-shadow" aria-hidden="true"></span><span class="button-face-container" aria-hidden="true"><span class="button-face"><svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M11 5l5 5-5 5" /></svg></span></span></button>
            </nav>

            {% for project_slug in page.selected_projects %}
            {% assign project = site.data.vitae_projects[project_slug] %}
            {% assign project_preview = project.vitae_cover | default: project.cover %}
            {% assign project_highlight = project.highlights | first %}
            <article class="vitae-project-summary" id="project-{{ project_slug }}" aria-labelledby="{{ project_slug }}-title" data-search-section data-search-title="{{ project.name }}" data-search-category="Vitae" data-search-summary="{{ project.introduction }}" data-search-keywords="{{ project.keywords }}">
                <header class="vitae-project-summary-copy" data-reveal="up">
                    <p class="p project-story-meta">{{ project.discipline }}</p>
                    <h2 class="h3 project-story-title" id="{{ project_slug }}-title"><a class="a project-story-title-link" href="{{ '/vitae/' | append: project_slug | append: '/' | relative_url }}">{{ project.headline }}</a></h2>
                    <p class="p project-story-intro">{{ project.introduction }}</p>
                    <div class="button-group project-story-actions">
                        <a class="a button button-container secondary project-story-page-link" href="{{ '/vitae/' | append: project_slug | append: '/' | relative_url }}" aria-label="Explore project">Explore project<span class="button-shadow" aria-hidden="true"></span><span class="button-face-container" aria-hidden="true"><span class="button-face">Explore project</span></span></a>
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

    <section class="vitae-summary vitae-contact" id="get-in-touch" aria-labelledby="vitae-contact-title" data-search-section data-search-title="Get in touch" data-search-category="Contact" data-search-keywords="contact connect linkedin conversation">
        <div class="vitae-contact-layout" data-reveal="up">
            <picture class="vitae-contact-artwork" aria-hidden="true">
                <source type="image/webp" srcset="{{ '/images/vitae/glass-shapes-v2.webp' | relative_url }}?v={{ site.asset_version }}">
                <img src="{{ '/images/vitae/glass-shapes-v2.png' | relative_url }}?v={{ site.asset_version }}" width="1148" height="1042" alt="" loading="lazy" decoding="async">
            </picture>
            <div class="vitae-contact-copy">
            <div>
                <h2 class="h2 home-section-title" id="vitae-contact-title">Let’s get in touch</h2>
                <p class="p vitae-contact-invitation">Tell me a little about yourself and what you're <span class="keep-together">working on.</span></p>
            </div>
            <div class="button-group vitae-contact-actions">
                <a class="a button button-container secondary" href="{{ '/contact/' | relative_url }}" aria-label="Let’s talk">Let’s talk<span class="button-shadow" aria-hidden="true"></span><span class="button-face-container" aria-hidden="true"><span class="button-face">Let’s talk</span></span></a>
                <a class="a button button-container primary about-me-linkedin-button" href="https://www.linkedin.com/in/jmwii1981/" target="_blank" rel="noopener noreferrer" aria-label="Let’s connect">Let’s connect<span class="button-shadow" aria-hidden="true"></span><span class="button-face-container" aria-hidden="true"><span class="button-face"><span class="about-me-linkedin-icon">{% include icon.html name="linked-in-cutout" %}</span>Let’s connect <svg class="button-external-icon" viewBox="0 0 20 20" fill="none"><path d="M5 15 15 5M8 5h7v7" /></svg></span></span></a>
            </div>
            </div>
        </div>
    </section>
</main>
