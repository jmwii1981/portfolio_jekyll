---
layout: page
title: Experience
permalink: /experience/
---
{% comment %} Assign start year and start month vars {% endcomment %}
{% assign primary_start_year = 2020 %}
{% assign primary_start_month = 6 %}
{% assign secondary_start_year = 2022 %}
{% assign secondary_start_month = 5 %}

{% comment %} Extract the current year and month dynamically (Liquid, Jekyll) {% endcomment %}
{% assign current_year = "now" | date: "%Y" | plus: 0 %}
{% assign current_month = "now" | date: "%m" | plus: 1 %}

{% comment %} Calculate the difference between start vars and now {% endcomment %}
{% assign primary_year_difference = current_year | minus: primary_start_year %}
{% assign primary_month_difference = current_month | minus: primary_start_month %}
{% assign secondary_year_difference = current_year | minus: secondary_start_year %}
{% assign secondary_month_difference = current_month | minus: secondary_start_month %}

<main class="main {% if page.url == '/experience/' %}experience{% endif %}">
    <div class="experience-content-wrapper">
        <section class="experience">
            <h2 class="h2 section-title">Work History</h2>
            <ul class="experience-list">
                <li class="experience-item">
                    <img class="experience-item-logo" src="/images/logos/global-payments.jpg" alt="Global Payments">
                    <h3 class="h5 role-held">Manager of Product Design</h3>
                    <h4 class="h6 employer-name">Global Payments</h4>
                    {% comment %} Output primary position years, months {% endcomment %}
                    <p class="dates-of-service"><strong>Current Role</strong> • {{ primary_year_difference }} years, {{ primary_month_difference }} months</p>
                </li>
                <li class="experience-item">
                    <img class="experience-item-logo" src="/images/logos/code-louisville.jpg" alt="Code Louisville">
                    <h3 class="h5 role-held">UX / Product Design Mentor</h3>
                    <h4 class="h6 employer-name">Code Louisville</h4>
                    {% comment %} Output secondary position years, months {% endcomment %}
                    <p class="dates-of-service"><strong>Current Role</strong> • {{ secondary_year_difference }} years, {{ secondary_month_difference }} months</p>
                </li>
                <li class="experience-item">
                    <img class="experience-item-logo" src="/images/logos/mightily.jpg" alt="Mightily">
                    <h3 class="h5 role-held">Web Developer / Designer</h3>
                    <h4 class="h6 employer-name">Mightily</h4>
                    <p class="dates-of-service">Dec 2017 - Jun 2020 • 2 years, 7 months</p>
                </li>
                <li class="experience-item">
                    <img class="experience-item-logo" src="/images/logos/humana.jpg" alt="Humana">
                    <h3 class="h5 role-held">Web Developer / Designer</h3>
                    <h4 class="h6 employer-name">Humana</h4>
                    <p class="dates-of-service">Aug 2017 - Dec 2017 • 5 months</p>
                </li>
                <li class="experience-item">
                    <img class="experience-item-logo" src="/images/logos/dbs-interactive.jpg" alt="DBS Interactive">
                    <h3 class="h5 role-held">Web Developer / Designer</h3>
                    <h4 class="h6 employer-name">DBS Interactive</h4>
                    <p class="dates-of-service">Jun 2016 - Aug 2017 • 1 year, 3 months</p>
                </li>
                <li class="experience-item">
                    <img class="experience-item-logo" src="/images/logos/projekt202.jpg" alt="Projekt202">
                    <h3 class="h5 role-held">Web Developer</h3>
                    <h4 class="h6 employer-name">Projekt202 <span class="light">(formerly&nbsp;Blackstone)</span></h4>
                    <p class="dates-of-service">Jun 2015 - Aug 2015 • 3 months</p>
                </li>
                <li class="experience-item">
                    <img class="experience-item-logo" src="/images/logos/media-marketers.jpg" alt="Media Marketer's">
                    <h3 class="h5 role-held">Web Developer</h3>
                    <h4 class="h6 employer-name">Media Marketer's</h4>
                    <p class="dates-of-service">Oct 2014 - Jun 2015 • 9 months</p>
                </li>
            </ul>
            <a class="a arrow-link" href="//linkedin.com/in/jmwii1981/details/experience/" target="_blank">
                View more experience
            </a>
        </section>
        <section class="certification">
            <h2 class="h2 section-title">Certifications</h2>
            <ul class="certification-list">
                <li class="certification-item">
                    <img class="certification-item-logo" src="/images/logos/nng.jpg" alt="Company Name">
                    <h3 class="h5 certification-held">UX Management</h3>
                    <h4 class="h6 certification-name">Nielsen Norman Group</h4>
                    <p class="dates-of-certification">Earned Oct 2024</p>
                </li>
                <li class="certification-item">
                    <img class="certification-item-logo" src="/images/logos/code-louisville.jpg" alt="Company Name">
                    <h3 class="h5 certification-held">JavaScript</h3>
                    <h4 class="h6 certification-name">Code Louisville</h4>
                    <p class="dates-of-certification">Earned Sep 2022</p>
                </li>
                <li class="certification-item">
                    <img class="certification-item-logo" src="/images/logos/scrum-alliance.jpg" alt="Company Name">
                    <h3 class="h5 certification-held">Scrum Product Owner</h3>
                    <h4 class="h6 certification-name">Scrum Alliance</h4>
                    <p class="dates-of-certification">Earned Jan 2022</p>
                </li>
                <li class="certification-item">
                    <img class="certification-item-logo" src="/images/logos/code-louisville.jpg" alt="Company Name">
                    <h3 class="h5 certification-held">Front-End Web Development</h3>
                    <h4 class="h6 certification-name">Code Louisville</h4>
                    <p class="dates-of-certification">Earned Sep 2014</p>
                </li>
            </ul>
        </section>
        <section class="volunteering">
            <h2 class="h2 section-title">Volunteering</h2>
            <ul class="volunteering-list">
                <li class="volunteering-item">
                    <img class="volunteering-item-logo" src="/images/logos/kmp.jpg" alt="Company Name">
                    <h3 class="h5 volunteering-role">Board Member At Large</h3>
                    <h4 class="h6 volunteering-name">Kentuckiana Marching Pride</h4>
                    <p class="dates-of-volunteering">Dec 2023 - Present</p>
                </li>
                <li class="volunteering-item">
                    <img class="volunteering-item-logo" src="/images/logos/global-payments.jpg" alt="Company Name">
                    <h3 class="h5 volunteering-role">Chair, International Pride Network</h3>
                    <h4 class="h6 volunteering-name">Global Payments Inc.</h4>
                    <p class="dates-of-volunteering">Nov 2021 - Dec 2022</p>
                </li>
                <li class="volunteering-item">
                    <img class="volunteering-item-logo" src="/images/logos/global-payments.jpg" alt="Company Name">
                    <h3 class="h5 volunteering-role">Accessibility Consultant, Index Design System</h3>
                    <h4 class="h6 volunteering-name">Global Payments Inc.</h4>
                    <p class="dates-of-volunteering">Jun 2020 - Jan 2021</p>
                </li>
            </ul>
            <a class="a arrow-link" href="//linkedin.com/in/jmwii1981/details/volunteering-experiences/" target="_blank">
                View more volunteering
            </a>
        </section>
        <section class="honors">
            <h2 class="h2 section-title">Honors & Awards</h2>
            <ul class="honors-list">
                <li class="honors-item">
                    <img class="honors-item-logo" src="/images/logos/ky-seal.jpg" alt="Company Name">
                    <h3 class="h5 honors-role">Kentucky Colonel</h3>
                    <h4 class="h6 honors-name">Governor Andy Beshear</h4>
                    <p class="dates-of-honors">Earned in 2023</p>
                </li>
                <li class="honors-item">
                    <img class="honors-item-logo" src="/images/logos/aaf.jpg" alt="Company Name">
                    <h3 class="h5 honors-role">Golden Addy Award</h3>
                    <h4 class="h6 honors-name">American Advertising Federation</h4>
                    <p class="dates-of-honors">Earned in 2019</p>
                </li>
                <li class="honors-item">
                    <img class="honors-item-logo" src="/images/logos/sia.jpg" alt="Company Name">
                    <h3 class="h5 honors-role">Emerging Media & Innovation</h3>
                    <h4 class="h6 honors-name">Summit International Awards</h4>
                    <p class="dates-of-honors">Earned in 2016</p>
                </li>
            </ul>
        </section>
    </div>
</main>