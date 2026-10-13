---
layout: page
title: Vitae
permalink: /vitae/
selected_projects: [vega, avenapay, ledgerflow]
description: "Selected product design leadership work spanning merchant operations, enterprise design systems, fintech workflows, and scalable product foundations."
---
<main class="main vitae" id="main-content" tabindex="-1">
    <section class="vitae-intro page-intro-frame" id="vitae-projects" aria-labelledby="vitae-intro-title" data-nav-section data-nav-title="Selected Projects">
        <h1 class="h1 page-hero-title vitae-intro-title" id="vitae-intro-title">Leading, Shaping &amp; Shipping.</h1>
        <div class="vitae-intro-copy">
            <p class="p vitae-intro-statement">Leading through service to my team and the people around us, I create to show what’s possible and collaborate to explore what it could become. A clear vision, creative freedom, and shared determination turn that possibility into an <strong class="vitae-intro-emphasis">excellent product</strong>.</p>
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
            <article class="vitae-project-summary" id="project-{{ project_slug }}" aria-labelledby="{{ project_slug }}-title" data-nav-section data-nav-title="{{ project.name }}">
                <header class="vitae-project-summary-copy" data-reveal="up">
                    <h2 class="h3 project-story-title" id="{{ project_slug }}-title"><a class="a project-story-title-link" href="{{ '/vitae/' | append: project_slug | append: '/' | relative_url }}">{{ project.headline }}</a></h2>
                </header>
                <div class="vitae-project-summary-detail" data-reveal="up">
                    <p class="p project-story-intro">{% if project_slug == 'vega' %}{{ project.introduction | replace_first: 'Vega', '<strong class="vitae-intro-emphasis">Vega</strong>' }}{% elsif project_slug == 'avenapay' %}{{ project.introduction | replace_first: 'AvenaPay', '<strong class="vitae-intro-emphasis">AvenaPay</strong>' }}{% elsif project_slug == 'ledgerflow' %}{{ project.introduction | replace_first: 'LedgerFlow', '<strong class="vitae-intro-emphasis">LedgerFlow</strong>' }}{% else %}{{ project.introduction }}{% endif %}</p>
                    <div class="button-group project-story-actions">
                        <a class="a button button-container secondary project-story-page-link" href="{{ '/vitae/' | append: project_slug | append: '/' | relative_url }}" aria-label="{{ project_button_label }}">{{ project_button_label }}<span class="button-shadow" aria-hidden="true"></span><span class="button-face-container" aria-hidden="true"><span class="button-face">{{ project_button_label }}</span></span></a>
                        {% if project.external_url %}
                        <a class="a vitae-editorial-link" href="{{ project.external_url }}" target="_blank" rel="noopener noreferrer"><span class="vitae-editorial-link-label">{{ project.external_label }}</span> <svg class="button-external-icon" aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M5 15 15 5M8 5h7v7" /></svg></a>
                        {% endif %}
                    </div>
                </div>
                <figure class="vitae-project-summary-visual vitae-device-lineup" aria-label="{{ project.name }} — laptop, tablet, and smartphone">
                    {% if project_slug == 'vega' %}
                    {% assign vega_devices = 'laptop,tablet,phone,landscape' | split: ',' %}
                    {% for device in vega_devices %}
                    <span class="vitae-device vitae-device--{{ device }} vega-screen-device" role="group" aria-label="Vega {{ device }} demo">
                        {% if device == 'laptop' %}{% assign frame = 'glass-laptop.png' %}{% elsif device == 'tablet' %}{% assign frame = 'glass-tablet.png' %}{% else %}{% assign frame = 'glass-smartphone.png' %}{% endif %}
                        <img class="vega-device-frame" src="{{ '/images/vitae/' | append: frame | relative_url }}" alt="" loading="lazy" decoding="async">
                        <span class="vega-screen-inset" data-vega-device="{{ device }}"><img class="vega-demo-fallback" src="{{ '/images/vitae/vega-screen-' | append: device | append: '-v3.png' | relative_url }}" alt="Vega {{ device }} dashboard concept with illustrative demo data" loading="lazy" decoding="async"></span>
                    </span>
                    {% endfor %}
                    {% elsif project_slug == 'ledgerflow' %}
                    {% assign ledger_devices = 'laptop,tablet,phone,landscape' | split: ',' %}
                    {% for device in ledger_devices %}
                    <span class="vitae-device vitae-device--{{ device }} vega-screen-device" role="group" aria-label="LedgerFlow {{ device }} sample interface">
                        {% if device == 'laptop' %}{% assign frame = 'glass-laptop.png' %}{% assign frame_width = 2858 %}{% assign frame_height = 1949 %}{% elsif device == 'tablet' %}{% assign frame = 'glass-tablet.png' %}{% assign frame_width = 1365 %}{% assign frame_height = 2025 %}{% else %}{% assign frame = 'glass-smartphone.png' %}{% assign frame_width = 522 %}{% assign frame_height = 998 %}{% endif %}
                        <img class="vega-device-frame" src="{{ '/images/vitae/' | append: frame | relative_url }}" width="{{ frame_width }}" height="{{ frame_height }}" alt="" loading="lazy" decoding="async">
                        <span class="vega-screen-inset" data-ledger-device="{{ device }}"></span>
                    </span>
                    {% endfor %}
                    {% else %}
                    <img class="vitae-device vitae-device--laptop" width="2858" height="1949" src="{{ '/images/vitae/glass-laptop.png' | relative_url }}?v=devices-20261004" alt="Glass laptop" loading="lazy" decoding="async">
                    <img class="vitae-device vitae-device--tablet" width="1365" height="2025" src="{{ '/images/vitae/glass-tablet.png' | relative_url }}?v=devices-20261004" alt="Glass tablet" loading="lazy" decoding="async">
                    <img class="vitae-device vitae-device--phone" width="522" height="998" src="{{ '/images/vitae/glass-smartphone.png' | relative_url }}?v=devices-20261004" alt="Glass smartphone" loading="lazy" decoding="async">
                    <span class="vitae-device vitae-device--landscape" aria-hidden="true"><img src="{{ '/images/vitae/glass-smartphone.png' | relative_url }}?v=devices-20261004" width="522" height="998" alt="" loading="lazy" decoding="async"></span>
                    {% endif %}
                </figure>
            </article>
            {% endfor %}
        </div>
    </section>

    <section class="vitae-summary vitae-contact" id="get-in-touch" aria-labelledby="vitae-contact-title" data-nav-section data-nav-title="Get in touch">
        <div class="vitae-contact-layout" data-reveal="up">
            <picture class="vitae-contact-artwork" aria-hidden="true">
                <img src="{{ '/images/vitae/rocket-ship-alpha.png' | relative_url }}?v={{ site.asset_version }}" width="2358" height="1967" alt="" loading="lazy" decoding="async">
            </picture>
            <div class="vitae-contact-copy">
            <h2 class="h2 home-section-title" id="vitae-contact-title">Let’s launch something</h2>
            <div>
                <p class="p vitae-contact-invitation">Tell me what’s on your mind. It doesn’t need a working title.</p>
            </div>
            <div class="button-group vitae-contact-actions">
                <a class="a button button-container secondary" href="{{ '/contact/' | relative_url }}" aria-label="Let’s talk">Let’s talk<span class="button-shadow" aria-hidden="true"></span><span class="button-face-container" aria-hidden="true"><span class="button-face">Let’s talk</span></span></a>
                <a class="a vitae-editorial-link" href="https://www.linkedin.com/in/jmwii1981/" target="_blank" rel="noopener noreferrer"><span class="vitae-editorial-link-label">Let’s connect</span> <svg class="button-external-icon" aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M5 15 15 5M8 5h7v7" /></svg></a>
            </div>
            </div>
        </div>
    </section>
</main>
<script type="module" src="{{ '/scripts/vegaDemo.mjs' | relative_url }}"></script>
<script type="module" src="{{ '/scripts/ledgerDemo.mjs' | relative_url }}"></script>
