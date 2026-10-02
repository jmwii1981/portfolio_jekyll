---
layout: page
title: Vitae
permalink: /vitae/
selected_projects: [vega, avenapay, ledgerflow]
description: "Selected product design leadership work spanning merchant operations, enterprise design systems, fintech workflows, and scalable product foundations."
---
<main class="main vitae" id="main-content" tabindex="-1">
    <section class="vitae-intro page-intro-frame" id="vitae-projects" aria-labelledby="vitae-intro-title" data-search-section data-search-title="Selected Projects" data-search-category="Vitae" data-search-summary="Products and systems I’ve moved forward through complete project narratives and product walkthroughs." data-search-keywords="portfolio vitae case studies product design systems teams">
        <h1 class="h1 page-hero-title vitae-intro-title" id="vitae-intro-title">Leading, Shaping <span class="vitae-intro-title-finish">&amp; Shipping.</span></h1>
        <div class="vitae-intro-copy">
            <p class="p vitae-intro-statement">Leading through service to my team and the people around us, I create to show what’s possible and collaborate to explore what it could become—asking questions, offering perspective, and challenging assumptions along the way.</p>
            <p class="p vitae-intro-statement">A clear vision, creative freedom, and shared determination turn that possibility into an <strong class="vitae-intro-emphasis">excellent product</strong>. I’m excited to share the outcomes of that work with you now.</p>
        </div>
        <picture class="vitae-intro-artwork" aria-hidden="true">
            <source type="image/webp" srcset="{{ '/images/vitae/glass-glasses.webp' | relative_url }}?v={{ site.asset_version }}">
            <img class="vitae-intro-artwork-image" src="{{ '/images/vitae/glass-glasses.png' | relative_url }}?v={{ site.asset_version }}" width="1218" height="882" alt="" decoding="async" fetchpriority="high">
        </picture>
    </section>

    <section class="vitae-collection" aria-label="Selected projects">
        <div class="vitae-project-summaries">
            <nav class="vitae-project-index" aria-label="Jump to a selected project" data-liquid-ignore>
                <ul class="vitae-project-index-list" id="vitae-project-index-list">
                    {% for project_slug in page.selected_projects %}
                    {% assign project = site.data.vitae_projects[project_slug] %}
                    <li><a class="a" href="#project-{{ project_slug }}">{{ project.index_label | default: project.organization }}</a></li>
                    {% endfor %}
                </ul>
            </nav>

            {% for project_slug in page.selected_projects %}
            {% assign project = site.data.vitae_projects[project_slug] %}
            {% assign project_preview = project.vitae_cover | default: project.cover %}
            {% assign project_highlight = project.highlights | first %}
            {% assign project_button_label = 'Explore project' %}
            {% if project_slug == 'vega' %}{% assign project_button_label = 'Explore Vega' %}{% elsif project_slug == 'avenapay' %}{% assign project_button_label = 'Introducing AvenaPay' %}{% elsif project_slug == 'ledgerflow' %}{% assign project_button_label = 'Discover LedgerFlow' %}{% endif %}
            <article class="vitae-project-summary" id="project-{{ project_slug }}" aria-labelledby="{{ project_slug }}-title" data-search-section data-search-title="{{ project.name }}" data-search-category="Vitae" data-search-summary="{{ project.introduction }}" data-search-keywords="{{ project.keywords }}">
                <header class="vitae-project-summary-copy" data-reveal="up">
                    <h2 class="h3 project-story-title" id="{{ project_slug }}-title"><a class="a project-story-title-link" href="{{ '/vitae/' | append: project_slug | append: '/' | relative_url }}">{{ project.headline }}</a></h2>
                </header>
                <div class="vitae-project-summary-detail" data-reveal="up">
                    <p class="p project-story-intro">{% if project_slug == 'vega' %}{{ project.introduction | replace_first: 'Vega', '<strong class="vitae-intro-emphasis">Vega</strong>' }}{% elsif project_slug == 'avenapay' %}{{ project.introduction | replace_first: 'AvenaPay', '<strong class="vitae-intro-emphasis">AvenaPay</strong>' }}{% elsif project_slug == 'ledgerflow' %}{{ project.introduction | replace_first: 'LedgerFlow', '<strong class="vitae-intro-emphasis">LedgerFlow</strong>' }}{% else %}{{ project.introduction }}{% endif %}</p>
                    <div class="button-group project-story-actions">
                        <a class="a button button-container secondary project-story-page-link" href="{{ '/vitae/' | append: project_slug | append: '/' | relative_url }}" aria-label="{{ project_button_label }}">{{ project_button_label }}<span class="button-shadow" aria-hidden="true"></span><span class="button-face-container" aria-hidden="true"><span class="button-face">{{ project_button_label }}</span></span></a>
                        {% if project.external_url %}
                        <a class="a vitae-editorial-link" href="{{ project.external_url }}" target="_blank" rel="noopener noreferrer">{{ project.external_label }} <span aria-hidden="true">↗</span></a>
                        {% endif %}
                    </div>
                </div>
                <figure class="vitae-project-summary-visual" data-reveal="{% cycle 'right', 'left' %}">
                    <img width="1448" height="1086" src="{{ project_preview | relative_url }}?v={{ site.asset_version }}" alt="{{ project.organization }} — {{ project_highlight.title }}" loading="lazy" decoding="async">
                </figure>
            </article>
            {% endfor %}
        </div>
    </section>

    <section class="vitae-summary vitae-contact" id="get-in-touch" aria-labelledby="vitae-contact-title" data-search-section data-search-title="Get in touch" data-search-category="Contact" data-search-keywords="contact connect linkedin conversation">
        <div class="vitae-contact-layout" data-reveal="up">
            <h2 class="h2 home-section-title" id="vitae-contact-title">Let’s launch something</h2>
            <picture class="vitae-contact-artwork" aria-hidden="true">
                <source type="image/webp" srcset="{{ '/images/vitae/rocket-ship.webp' | relative_url }}?v={{ site.asset_version }}">
                <img src="{{ '/images/vitae/rocket-ship.png' | relative_url }}?v={{ site.asset_version }}" width="1448" height="1086" alt="" loading="lazy" decoding="async">
            </picture>
            <div class="vitae-contact-copy">
            <div>
                <p class="p vitae-contact-invitation">Tell me what’s on your mind. It doesn’t need a working title.</p>
            </div>
            <div class="button-group vitae-contact-actions">
                <a class="a button button-container secondary" href="{{ '/contact/' | relative_url }}" aria-label="Let’s talk">Let’s talk<span class="button-shadow" aria-hidden="true"></span><span class="button-face-container" aria-hidden="true"><span class="button-face">Let’s talk</span></span></a>
                <a class="a vitae-editorial-link" href="https://www.linkedin.com/in/jmwii1981/" target="_blank" rel="noopener noreferrer">Let’s connect <span aria-hidden="true">↗</span></a>
            </div>
            </div>
        </div>
    </section>
</main>
