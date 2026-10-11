---
layout: page
title: Contact Me
permalink: /contact/
description: "Contact Jan Michael Wallace II about fractional product design leadership, product strategy, design systems, or team development."
---
<main class="main contact" id="main-content" tabindex="-1">
    <section class="page-hero page-intro-frame contact-hero" id="contact-jan" aria-labelledby="contact-heading" data-search-section data-search-title="Contact Jan Michael Wallace II" data-search-category="Contact" data-search-keywords="email phone cell message leadership opportunity conversation collaboration">
        <div class="content-wrapper page-hero-content">
            <h1 class="h1 page-hero-title" id="contact-heading">Let’s create a clear path forward, <span class="contact-heading-together">together</span>.</h1>
        </div>
        <div class="contact-portrait-composition">
          <div class="contact-portrait-artwork">
        <picture class="contact-avatar">
            <source type="image/avif" srcset="{{ '/images/headshots/bio-pic-512.avif' | relative_url }}?v={{ site.asset_version }}">
            <source type="image/webp" srcset="{{ '/images/headshots/bio-pic-512.webp' | relative_url }}?v={{ site.asset_version }}">
            <img src="{{ '/images/headshots/bio-pic-512.png' | relative_url }}?v={{ site.asset_version }}" width="512" height="512" alt="Portrait of Jan Michael Wallace II" decoding="async">
        </picture>
          </div>
          <div class="contact-direct-links" aria-label="Reach out directly">
            <a href="https://www.linkedin.com/in/jmwii1981/" class="contact-direct-pill" target="_blank" rel="noopener noreferrer" aria-label="Message me on LinkedIn (opens in a new tab)"><img src="{{ '/images/ui/emoji-paper-plane.png' | relative_url }}" width="26" height="26" alt="">Message me on LinkedIn</a>
            <a href="mailto:hello@janmichael.io" class="contact-direct-pill"><img src="{{ '/images/ui/emoji-envelope.png' | relative_url }}" width="26" height="26" alt="">hello@janmichael.io</a>
            <a href="tel:+14155069867" class="contact-direct-pill"><img src="{{ '/images/ui/emoji-telephone-receiver.png' | relative_url }}" width="26" height="26" alt="">+1.415.506.9867</a>
          </div>
        </div>
    </section>

    <section class="contact-section" id="send-a-message" aria-label="Send a message" data-search-section data-search-title="Send Jan Michael Wallace II a message" data-search-category="Contact" data-search-keywords="contact form email phone cell message">
        <form class="contact-form" action="https://api.web3forms.com/submit" method="POST" data-contact-form aria-label="Email contact form" aria-describedby="contact-required-note contact-form-status">
            <input type="hidden" name="access_key" value="8b2e7fb6-b67b-4e97-8bd9-b4786d165afc">
            <input type="hidden" name="from_name" value="janmichael.io Contact Form">
            <input class="contact-botcheck" type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true">


            <div class="contact-name-fields">
                <div class="contact-field">
                    <label class="contact-label" for="contact-first-name">First Name</label>
                    <input class="contact-input" id="contact-first-name" name="First Name" type="text" autocomplete="given-name" maxlength="80" required aria-describedby="contact-first-name-error">
                    <p class="p contact-field-error" id="contact-first-name-error" data-contact-error hidden></p>
                </div>

                <div class="contact-field">
                    <label class="contact-label" for="contact-last-name">Last Name</label>
                    <input class="contact-input" id="contact-last-name" name="Last Name" type="text" autocomplete="family-name" maxlength="80" required aria-describedby="contact-last-name-error">
                    <p class="p contact-field-error" id="contact-last-name-error" data-contact-error hidden></p>
                </div>
            </div>

            <div class="contact-field">
                <label class="contact-label" for="contact-email">Email</label>
                <input class="contact-input" id="contact-email" name="email" type="email" autocomplete="email" inputmode="email" maxlength="254" spellcheck="false" required aria-describedby="contact-email-error">
                <p class="p contact-field-error" id="contact-email-error" data-contact-error hidden></p>
            </div>

            <section class="contact-project-details" aria-labelledby="contact-project-detail-heading">
                <h2 class="contact-project-detail-heading" id="contact-project-detail-heading">Project Detail</h2>
            <div class="contact-timeline">
                <div class="contact-timeline-dates">
                    <div class="contact-field">
                        <label class="contact-label contact-date-label" for="contact-begin">Planned kick off</label>
                        <input class="contact-input" id="contact-begin" name="Preferred start date" type="date" required aria-describedby="contact-begin-error">
                        <p class="p contact-field-error" id="contact-begin-error" data-contact-error hidden></p>
                    </div>
                    <div class="contact-field">
                        <label class="contact-label contact-date-label" for="contact-ready">Target launch</label>
                        <input class="contact-input" id="contact-ready" name="Handoff or launch date" type="date" required aria-describedby="contact-ready-error">
                        <p class="p contact-field-error" id="contact-ready-error" data-contact-error hidden></p>
                    </div>
                </div>
            </div>

            <div class="contact-field">
                <label class="contact-label" for="contact-budget">Budget</label>
                <div class="contact-select-wrap">
                <select class="contact-input contact-select" id="contact-budget" name="Budget" required aria-describedby="contact-budget-error">
                    <option value="" disabled selected>Select a range</option>
                    <option>$5k+</option>
                    <option>$10k+</option>
                    <option>$25k+</option>
                    <option>$50k+</option>
                    <option>$100k+</option>
                    <option>$250k+</option>
                    <option>Let’s figure it out</option>
                </select>
                <span class="contact-select-toggle" aria-hidden="true"><img src="{{ '/images/ui/vega/arrow-right.svg' | relative_url }}" width="16" height="16" alt=""></span>
                </div>
                <p class="p contact-field-error" id="contact-budget-error" data-contact-error hidden></p>
            </div>
            </section>

            <div class="contact-field">
                <label class="contact-label" for="contact-subject">Subject</label>
                <input class="contact-input" id="contact-subject" name="subject" type="text" maxlength="120" required aria-describedby="contact-subject-error">
                <p class="p contact-field-error" id="contact-subject-error" data-contact-error hidden></p>
            </div>

            <div class="contact-field">
                <label class="contact-label" for="contact-message">Message</label>
                <textarea class="contact-input contact-textarea" id="contact-message" name="message" rows="7" maxlength="5000" required aria-describedby="contact-message-error"></textarea>
                <p class="p contact-field-error" id="contact-message-error" data-contact-error hidden></p>
            </div>

            <div class="contact-actions">
                <button class="button button-container primary contact-submit" type="submit" aria-label="Send message">Send message<span class="button-shadow" aria-hidden="true"></span><span class="button-face-container" aria-hidden="true"><span class="button-face">Send message</span></span></button>
                <p class="p contact-required-note" id="contact-required-note">Fields marked with an asterisk (*) are required.</p>
                <p class="p contact-form-status" id="contact-form-status" data-contact-status role="status" aria-live="polite" aria-atomic="true"></p>
            </div>
        </form>
    </section>
</main>
<script type="module" src="{{ '/scripts/contactCalendar.mjs' | relative_url }}"></script>
