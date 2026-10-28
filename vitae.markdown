---
layout: page
title: Vitae
permalink: /vitae/
selected_projects: [sundial, vega, avenapay, ledgerflow]
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
            {% include vitae-subnav.html label="Jump to a selected project" %}

            {% for project_slug in page.selected_projects %}
            {% assign project = site.data.vitae_projects[project_slug] %}
            {% include vitae-project-summary.html %}
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
