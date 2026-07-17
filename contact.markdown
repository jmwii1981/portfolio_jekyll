---
layout: page
title: Contact Me
permalink: /contact/
description: "Contact Jan Michael Wallace II about fractional product design leadership, product strategy, design systems, or team development."
---
<main class="main contact" id="main-content" tabindex="-1">
    <section class="contact-section" aria-labelledby="contact-heading">
        <div class="contact-intro">
            <h2 class="h2 massive" id="contact-heading">Let’s create a clear path forward.</h2>
            <p class="p">I’m open to leadership opportunities and conversations with teams navigating unfamiliar product territory, scaling design practice, or aligning around what comes next.</p>
        </div>

        <form class="contact-form" action="https://api.web3forms.com/submit" method="POST" data-contact-form aria-label="Email contact form" aria-describedby="contact-required-note contact-form-status">
            <input type="hidden" name="access_key" value="8b2e7fb6-b67b-4e97-8bd9-b4786d165afc">
            <input type="hidden" name="from_name" value="janmichael.io Contact Form">
            <input class="contact-botcheck" type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true">

            <p class="p contact-required-note" id="contact-required-note">Fields marked with an asterisk are required.</p>

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
                <button class="button primary contact-submit" type="submit">
                    <span class="button-label">Send message</span>
                    <span class="button-fill" aria-hidden="true"></span>
                </button>
                <p class="p contact-form-status" id="contact-form-status" data-contact-status role="status" aria-live="polite" aria-atomic="true"></p>
                <p class="p contact-direct-email" id="contact-direct-email">If you’re having trouble with the form or prefer to reach out directly, please feel free to email me at <a class="a" href="mailto:hello@janmichael.io">hello@janmichael.io</a> or call or text my personal cell at <a class="a" href="tel:+15027974994">+1 (502) 797-4994</a>.</p>
            </div>
        </form>
    </section>
</main>
