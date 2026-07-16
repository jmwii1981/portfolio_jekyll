---
layout: page
title: Work
permalink: /work/
description: "Selected product design leadership work spanning merchant operations, enterprise design systems, fintech workflows, and scalable product foundations."
---
{% assign work_image_sizes = '(min-width: 110.5rem) 52rem, (min-width: 60.0625rem) calc(56vw - 6rem), (min-width: 42.0625rem) calc(100vw - 9rem), (min-width: 26.3125rem) calc(100vw - 5rem), calc(100vw - 3rem)' %}
<main class="main work" id="main-content" tabindex="-1">
    <section class="work-intro" aria-labelledby="work-intro-title">
        <div class="work-intro-copy">
            <p class="p work-intro-eyebrow">Selected work</p>
            <h2 class="h1 work-intro-title" id="work-intro-title">Clarity for what comes next.</h2>
            <p class="p work-intro-statement">I help teams navigate unfamiliar product challenges—bringing clarity to complexity, aligning people around a direction, and turning innovation into products that can scale.</p>
        </div>
        <div class="work-intro-transition" aria-hidden="true">
            <span class="work-intro-transition-line"></span>
            <p class="p">Scroll to explore</p>
        </div>
    </section>

    <section class="work-collection" aria-labelledby="work-collection-title">
        <header class="work-collection-header">
            <p class="p work-collection-eyebrow">Selected projects</p>
            <h2 class="h2 work-collection-title" id="work-collection-title">Products, systems, and teams I’ve helped move forward.</h2>
        </header>

        <nav class="work-project-index" aria-label="Jump to a selected project" data-reveal="up">
            <ul class="work-project-index-list">
                <li><a class="a" href="#project-lionfinancial"><span aria-hidden="true">01</span> LionFinancial</a></li>
                <li><a class="a" href="#project-vega"><span aria-hidden="true">02</span> Vega</a></li>
                <li><a class="a" href="#project-avenapay"><span aria-hidden="true">03</span> AvenaPay</a></li>
                <li><a class="a" href="#project-paladin"><span aria-hidden="true">04</span> Paladin</a></li>
                <li><a class="a" href="#project-ledgerflow"><span aria-hidden="true">05</span> LedgerFlow</a></li>
                <li><a class="a" href="#project-northstar"><span aria-hidden="true">06</span> Northstar</a></li>
            </ul>
        </nav>

        <div class="work-items-wrapper">
            <article class="project-story" id="project-lionfinancial" aria-labelledby="lmms-title">
                <header class="project-story-header" data-reveal="up">
                    <p class="p project-story-meta">LionFinancial <span aria-hidden="true">/</span> Merchant operations</p>
                    <h3 class="h3 project-story-title" id="lmms-title">A calmer operating system for merchant performance.</h3>
                    <p class="p project-story-intro">LionFinancial Merchant Management System brings the information behind a large merchant network into one connected experience, so teams can focus on decisions instead of wrangling disconnected tools.</p>
                </header>
                <div class="project-story-overview">
                    <figure class="project-cover" data-reveal="right">
                        <img width="750" height="500" src="{{ '/images/projects/lmms/750x500 Toptal Submission Frame.webp' | relative_url }}" srcset="{{ '/images/projects/lmms/750x500%20Toptal%20Submission%20Frame-375w.webp' | relative_url }} 375w, {{ '/images/projects/lmms/750x500%20Toptal%20Submission%20Frame.webp' | relative_url }} 750w" sizes="{{ work_image_sizes }}" alt="LionFinancial merchant management dashboard displayed on a laptop" loading="lazy" decoding="async">
                    </figure>
                    <div class="project-story-details" data-reveal="up">
                        <section>
                            <h4 class="h4">The challenge</h4>
                            <p class="p">The people responsible for merchant performance are often forced to make important decisions from scattered systems, disconnected reports, and partial information. Simple questions become stressful: Which merchants are healthy? Which need attention? Where are transactions slowing down? What needs to be approved, scheduled, reported, or fixed?</p>
                        </section>
                        <section>
                            <h4 class="h4">The design response</h4>
                            <p class="p">I designed LMMS to connect accounts, customers, transactions, approvals, scheduled payouts, and reporting in a clearer operating environment. The experience streamlines the work around the data, helping teams understand performance and act without reconstructing the story across multiple platforms.</p>
                        </section>
                    </div>
                </div>
                <div class="project-walkthrough" data-project-gallery data-reveal="up">
                    <header class="project-walkthrough-header">
                        <div class="project-gallery-controls">
                            <button class="project-gallery-button" type="button" data-gallery-previous aria-label="View previous LionFinancial screen"><svg class="project-gallery-icon" aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M16 10H4M9 5l-5 5 5 5" /></svg></button>
                            <p class="p project-gallery-count" aria-live="polite"><span data-gallery-current>1</span> / 6</p>
                            <button class="project-gallery-button" type="button" data-gallery-next aria-label="View next LionFinancial screen"><svg class="project-gallery-icon" aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M11 5l5 5-5 5" /></svg></button>
                        </div>
                    </header>
                    <div class="project-gallery-viewport" data-gallery-viewport tabindex="0" aria-label="LionFinancial product walkthrough">
                        <div class="project-gallery-track">
                            <figure class="project-screen" data-gallery-slide>
                                <div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/lmms/LMMS – Accounts.webp' | relative_url }}" srcset="{{ '/images/projects/lmms/LMMS%20%E2%80%93%20Accounts-560w.webp' | relative_url }} 560w, {{ '/images/projects/lmms/LMMS%20%E2%80%93%20Accounts-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/lmms/LMMS%20%E2%80%93%20Accounts.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="LionFinancial merchant network dashboard" loading="lazy" decoding="async"></div>
                                <figcaption class="project-screen-caption"><h4 class="h4">The merchant network as an operating view</h4><p class="p">A merchant list should do more than act as a directory. This view brings status, services, volume, recent activity, risk, approvals, onboarding, and network health together so platform teams can identify which businesses are growing and which need intervention without opening every record.</p><p class="p project-screen-outcome"><strong>Representative outcome</strong> 30% greater efficiency in merchant review by making risk, activity, adoption, and volume visible at the list level.</p></figcaption>
                            </figure>
                            <figure class="project-screen" data-gallery-slide>
                                <div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/lmms/LMMS – Accounts-1.webp' | relative_url }}" srcset="{{ '/images/projects/lmms/LMMS%20%E2%80%93%20Accounts-1-560w.webp' | relative_url }} 560w, {{ '/images/projects/lmms/LMMS%20%E2%80%93%20Accounts-1-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/lmms/LMMS%20%E2%80%93%20Accounts-1.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="LionFinancial payment methods and services interface" loading="lazy" decoding="async"></div>
                                <figcaption class="project-screen-caption"><h4 class="h4">Service configuration meets adoption</h4><p class="p">Payment methods affect cash flow, friction, and revenue opportunity. I paired configuration with adoption so teams can see what is enabled, how many merchants use it, the volume and fees it drives, and where setup requests are waiting—shifting the question from “Is it on?” to “Is it creating value?”</p><p class="p project-screen-outcome"><strong>Representative outcome</strong> A 15–20% improvement in the ease of driving service adoption, visibility, and conversion.</p></figcaption>
                            </figure>
                            <figure class="project-screen" data-gallery-slide>
                                <div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/lmms/LMMS – Customers.webp' | relative_url }}" srcset="{{ '/images/projects/lmms/LMMS%20%E2%80%93%20Customers-560w.webp' | relative_url }} 560w, {{ '/images/projects/lmms/LMMS%20%E2%80%93%20Customers-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/lmms/LMMS%20%E2%80%93%20Customers.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="LionFinancial customer management view" loading="lazy" decoding="async"></div>
                                <figcaption class="project-screen-caption"><h4 class="h4">Customer behavior as a merchant-health signal</h4><p class="p">Volume alone does not explain business health. Active customers, repeat purchase rate, payment preferences, lifetime value, support issues, and health scores reveal whether a merchant is retaining customers or beginning to lose momentum—and give platform teams a stronger basis for advising them.</p><p class="p project-screen-outcome"><strong>Representative outcome</strong> A projected 35–60% improvement in merchant advisory conversations through clearer customer and payment-behavior signals.</p></figcaption>
                            </figure>
                            <figure class="project-screen" data-gallery-slide>
                                <div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/lmms/LMMS – Payout Scheduling.webp' | relative_url }}" srcset="{{ '/images/projects/lmms/LMMS%20%E2%80%93%20Payout%20Scheduling-560w.webp' | relative_url }} 560w, {{ '/images/projects/lmms/LMMS%20%E2%80%93%20Payout%20Scheduling-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/lmms/LMMS%20%E2%80%93%20Payout%20Scheduling.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="LionFinancial payout scheduling workflow" loading="lazy" decoding="async"></div>
                                <figcaption class="project-screen-caption"><h4 class="h4">Predictable future money movement</h4><p class="p">I reframed scheduled payments as a financial-operations tool supporting vendor payouts, platform fees, settlements, lease payments, payroll advances, insurance premiums, and merchant disbursements. Upcoming, successful, and failed activity remains visible alongside reusable templates because uncertainty is the enemy when users are responsible for money movement.</p></figcaption>
                            </figure>
                            <figure class="project-screen" data-gallery-slide>
                                <div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/lmms/LMMS – Reports.webp' | relative_url }}" srcset="{{ '/images/projects/lmms/LMMS%20%E2%80%93%20Reports-560w.webp' | relative_url }} 560w, {{ '/images/projects/lmms/LMMS%20%E2%80%93%20Reports-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/lmms/LMMS%20%E2%80%93%20Reports.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="LionFinancial reports interface" loading="lazy" decoding="async"></div>
                                <figcaption class="project-screen-caption"><h4 class="h4">Reporting without rebuilding the work</h4><p class="p">A report library, scheduled reports, saved views, quick exports, ownership, dates, and categories turn historical reporting into reusable operational knowledge. Teams can generate leadership summaries, monitor merchants and payouts, export what they need, and move on without repeatedly reconstructing the same analysis.</p><p class="p project-screen-outcome"><strong>Representative outcome</strong> Approximately 80% less report-preparation time.</p></figcaption>
                            </figure>
                            <figure class="project-screen" data-gallery-slide>
                                <div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/lmms/LMMS – Transactions.webp' | relative_url }}" srcset="{{ '/images/projects/lmms/LMMS%20%E2%80%93%20Transactions-560w.webp' | relative_url }} 560w, {{ '/images/projects/lmms/LMMS%20%E2%80%93%20Transactions-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/lmms/LMMS%20%E2%80%93%20Transactions.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="LionFinancial transaction management interface" loading="lazy" decoding="async"></div>
                                <figcaption class="project-screen-caption"><h4 class="h4">From audit trail to pattern recognition</h4><p class="p">The transaction table covers payments, refunds, disputes, payouts, settlement timing, fees, methods, and status across merchants. Supporting views expose mix, volume by time of day, and settlement aging so users can move from “What happened?” to “What does this mean?” without exporting the data first.</p><p class="p project-screen-outcome"><strong>Representative outcome</strong> A projected 50–75% reduction in manual transaction research and export dependency, depending on the business and user.</p></figcaption>
                            </figure>
                        </div>
                    </div>
                </div>
            </article>

            <article class="project-story" id="project-vega" aria-labelledby="vega-title">
                <header class="project-story-header project-story-header--right" data-reveal="up">
                    <p class="p project-story-meta">Global Payments <span aria-hidden="true">/</span> Enterprise design system</p>
                    <h3 class="h3 project-story-title" id="vega-title">A north star for product design across a global ecosystem.</h3>
                    <p class="p project-story-intro">All roads intersect at Vega—a shared foundation for software product design across three continents, numerous countries, and distributed product, design, and engineering teams.</p>
                    <a class="a project-story-link" href="https://vega.globalpayments.com/" target="_blank" rel="noopener noreferrer">Visit Vega <svg class="button-external-icon" aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M5 15 15 5M8 5h7v7" /></svg></a>
                </header>
                <div class="project-story-overview project-story-overview--reverse">
                    <figure class="project-cover" data-reveal="left">
                        <img width="750" height="500" src="{{ '/images/projects/vega/750x500 Toptal Submission Frame.webp' | relative_url }}" srcset="{{ '/images/projects/vega/750x500%20Toptal%20Submission%20Frame-375w.webp' | relative_url }} 375w, {{ '/images/projects/vega/750x500%20Toptal%20Submission%20Frame.webp' | relative_url }} 750w" sizes="{{ work_image_sizes }}" alt="Vega enterprise design system shown across product interfaces" loading="lazy" decoding="async">
                    </figure>
                    <div class="project-story-details" data-reveal="up">
                        <section>
                            <h4 class="h4">The opportunity</h4>
                            <p class="p">Our product ecosystem needed a stronger shared foundation—one that could make products more consistent, accessible, and thoughtfully designed without slowing teams down or preventing them from solving for their own product needs.</p>
                        </section>
                        <section>
                            <h4 class="h4">My leadership</h4>
                            <p class="p">As design system lead and product design manager, I kicked off and led Vega’s creation and evolution across reusable components, accessibility standards, design tokens, documentation, governance, and Figma-to-code alignment. I partnered closely with engineering to reduce rework and help teams build better software with greater speed and confidence.</p>
                        </section>
                    </div>
                </div>
                <div class="project-walkthrough" data-project-gallery data-reveal="up">
                    <header class="project-walkthrough-header">
                        <div class="project-gallery-controls">
                            <button class="project-gallery-button" type="button" data-gallery-previous aria-label="View previous Vega screen"><svg class="project-gallery-icon" aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M16 10H4M9 5l-5 5 5 5" /></svg></button>
                            <p class="p project-gallery-count" aria-live="polite"><span data-gallery-current>1</span> / 6</p>
                            <button class="project-gallery-button" type="button" data-gallery-next aria-label="View next Vega screen"><svg class="project-gallery-icon" aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M11 5l5 5-5 5" /></svg></button>
                        </div>
                    </header>
                    <div class="project-gallery-viewport" data-gallery-viewport tabindex="0" aria-label="Vega design system walkthrough">
                        <div class="project-gallery-track">
                            <figure class="project-screen" data-gallery-slide>
                                <div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/vega/Vega - 02.webp' | relative_url }}" srcset="{{ '/images/projects/vega/Vega%20-%2002-560w.webp' | relative_url }} 560w, {{ '/images/projects/vega/Vega%20-%2002-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/vega/Vega%20-%2002.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="Vega design system foundations and interface components" loading="lazy" decoding="async"></div>
                                <figcaption class="project-screen-caption"><h4 class="h4">A foundation teams can share</h4><p class="p">Vega establishes common visual and interaction foundations so separate products can feel like parts of one ecosystem without erasing their individual requirements.</p></figcaption>
                            </figure>
                            <figure class="project-screen" data-gallery-slide>
                                <div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/vega/Vega - 03.webp' | relative_url }}" srcset="{{ '/images/projects/vega/Vega%20-%2003-560w.webp' | relative_url }} 560w, {{ '/images/projects/vega/Vega%20-%2003-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/vega/Vega%20-%2003.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="Vega component library and design guidance" loading="lazy" decoding="async"></div>
                                <figcaption class="project-screen-caption"><h4 class="h4">Components with intent</h4><p class="p">Reusable components pair visual consistency with behavioral guidance, helping designers and engineers understand not only what to use, but why and when to use it.</p></figcaption>
                            </figure>
                            <figure class="project-screen" data-gallery-slide>
                                <div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/vega/Vega - 04.webp' | relative_url }}" srcset="{{ '/images/projects/vega/Vega%20-%2004-560w.webp' | relative_url }} 560w, {{ '/images/projects/vega/Vega%20-%2004-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/vega/Vega%20-%2004.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="Vega reusable product patterns" loading="lazy" decoding="async"></div>
                                <figcaption class="project-screen-caption"><h4 class="h4">Patterns for real product work</h4><p class="p">The system moves beyond isolated UI pieces into repeatable product patterns, giving teams a faster path through common workflows and complex states.</p></figcaption>
                            </figure>
                            <figure class="project-screen" data-gallery-slide>
                                <div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/vega/Vega - 05.webp' | relative_url }}" srcset="{{ '/images/projects/vega/Vega%20-%2005-560w.webp' | relative_url }} 560w, {{ '/images/projects/vega/Vega%20-%2005-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/vega/Vega%20-%2005.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="Vega accessibility and interaction standards" loading="lazy" decoding="async"></div>
                                <figcaption class="project-screen-caption"><h4 class="h4">Accessibility built into the decision</h4><p class="p">Standards and usage guidance bring accessibility into component selection and interaction design from the beginning instead of treating it as a final audit.</p></figcaption>
                            </figure>
                            <figure class="project-screen" data-gallery-slide>
                                <div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/vega/Vega - 06.webp' | relative_url }}" srcset="{{ '/images/projects/vega/Vega%20-%2006-560w.webp' | relative_url }} 560w, {{ '/images/projects/vega/Vega%20-%2006-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/vega/Vega%20-%2006.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="Vega design tokens and implementation details" loading="lazy" decoding="async"></div>
                                <figcaption class="project-screen-caption"><h4 class="h4">A durable bridge to code</h4><p class="p">Shared tokens and aligned naming reduce translation between Figma and engineering, protecting decisions as components move from design into production.</p></figcaption>
                            </figure>
                            <figure class="project-screen" data-gallery-slide>
                                <div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/vega/Vega - 07.webp' | relative_url }}" srcset="{{ '/images/projects/vega/Vega%20-%2007-560w.webp' | relative_url }} 560w, {{ '/images/projects/vega/Vega%20-%2007-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/vega/Vega%20-%2007.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="Vega documentation and component guidance" loading="lazy" decoding="async"></div>
                                <figcaption class="project-screen-caption"><h4 class="h4">Documentation that supports adoption</h4><p class="p">Clear examples, governance, and contribution guidance make the system usable across distributed teams and give it a structure that can evolve with the organization.</p></figcaption>
                            </figure>
                        </div>
                    </div>
                </div>
            </article>

            <article class="project-story" id="project-avenapay" aria-labelledby="avena-title">
                <header class="project-story-header" data-reveal="up">
                    <p class="p project-story-meta">AvenaPay <span aria-hidden="true">/</span> Disputes management</p>
                    <h3 class="h3 project-story-title" id="avena-title">Turning dispute complexity into actionable clarity.</h3>
                    <p class="p project-story-intro">A representative disputes analytics platform designed to help merchants manage high-volume chargebacks, understand what changed, identify what needs attention, and find the strongest recovery opportunities.</p>
                </header>
                <div class="project-story-overview">
                    <figure class="project-cover" data-reveal="right">
                        <img width="750" height="500" src="{{ '/images/projects/avena/750x500 Toptal Submission Frame.webp' | relative_url }}" srcset="{{ '/images/projects/avena/750x500%20Toptal%20Submission%20Frame-375w.webp' | relative_url }} 375w, {{ '/images/projects/avena/750x500%20Toptal%20Submission%20Frame.webp' | relative_url }} 750w" sizes="{{ work_image_sizes }}" alt="AvenaPay disputes management experience across desktop and mobile" loading="lazy" decoding="async">
                    </figure>
                    <div class="project-story-details" data-reveal="up">
                        <section>
                            <h4 class="h4">The challenge</h4>
                            <p class="p">Merchants struggled to understand which disputes were worth defending, why cases were being lost, and how to recover more funds without relying on manual reports from support or client services. Complex dispute data needed to become easier to understand, filter, and act on.</p>
                        </section>
                        <section>
                            <h4 class="h4">My approach</h4>
                            <p class="p">I designed the dashboard strategy, information architecture, dispute-health KPIs, probability scoring, filtered queue shortcuts, case detail views, alerts, custom reports, and natural-language analytics. The interface, branding, data, and identifying details were recreated to protect confidential work while preserving the product’s complexity and design strategy.</p>
                        </section>
                    </div>
                </div>
                <div class="project-walkthrough" data-project-gallery data-reveal="up">
                    <header class="project-walkthrough-header">
                        <div class="project-gallery-controls">
                            <button class="project-gallery-button" type="button" data-gallery-previous aria-label="View previous AvenaPay screen"><svg class="project-gallery-icon" aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M16 10H4M9 5l-5 5 5 5" /></svg></button>
                            <p class="p project-gallery-count" aria-live="polite"><span data-gallery-current>1</span> / 6</p>
                            <button class="project-gallery-button" type="button" data-gallery-next aria-label="View next AvenaPay screen"><svg class="project-gallery-icon" aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M11 5l5 5-5 5" /></svg></button>
                        </div>
                    </header>
                    <div class="project-gallery-viewport" data-gallery-viewport tabindex="0" aria-label="AvenaPay product walkthrough">
                        <div class="project-gallery-track">
                            <figure class="project-screen" data-gallery-slide>
                                <div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/avena/Dashboard - Outcomes.webp' | relative_url }}" srcset="{{ '/images/projects/avena/Dashboard%20-%20Outcomes-560w.webp' | relative_url }} 560w, {{ '/images/projects/avena/Dashboard%20-%20Outcomes-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/avena/Dashboard%20-%20Outcomes.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="AvenaPay outcomes dashboard with case metrics and trend visualization" loading="lazy" decoding="async"></div>
                                <figcaption class="project-screen-caption"><h4 class="h4">Lead with outcomes</h4><p class="p">The primary dashboard reframes disputes around recovery, loss, and performance—giving merchants an immediate understanding of what changed and where attention matters.</p></figcaption>
                            </figure>
                            <figure class="project-screen" data-gallery-slide>
                                <div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/avena/Dashboard - Volume.webp' | relative_url }}" srcset="{{ '/images/projects/avena/Dashboard%20-%20Volume-560w.webp' | relative_url }} 560w, {{ '/images/projects/avena/Dashboard%20-%20Volume-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/avena/Dashboard%20-%20Volume.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="AvenaPay dispute volume dashboard" loading="lazy" decoding="async"></div>
                                <figcaption class="project-screen-caption"><h4 class="h4">Volume with meaningful context</h4><p class="p">Trends and comparisons help teams distinguish routine fluctuations from signals that require investigation, keeping raw case volume connected to business impact.</p></figcaption>
                            </figure>
                            <figure class="project-screen" data-gallery-slide>
                                <div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/avena/My Cases _ Case Details.webp' | relative_url }}" srcset="{{ '/images/projects/avena/My%20Cases%20_%20Case%20Details-560w.webp' | relative_url }} 560w, {{ '/images/projects/avena/My%20Cases%20_%20Case%20Details-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/avena/My%20Cases%20_%20Case%20Details.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="AvenaPay case detail workflow" loading="lazy" decoding="async"></div>
                                <figcaption class="project-screen-caption"><h4 class="h4">Evidence where decisions happen</h4><p class="p">The case view brings status, value, evidence, timing, and recommended action into one workspace so merchants can move from analysis into resolution with confidence.</p></figcaption>
                            </figure>
                            <figure class="project-screen" data-gallery-slide>
                                <div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/avena/Alerts and Notifications.webp' | relative_url }}" srcset="{{ '/images/projects/avena/Alerts%20and%20Notifications-560w.webp' | relative_url }} 560w, {{ '/images/projects/avena/Alerts%20and%20Notifications-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/avena/Alerts%20and%20Notifications.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="AvenaPay alerts and notifications interface" loading="lazy" decoding="async"></div>
                                <figcaption class="project-screen-caption"><h4 class="h4">Attention, carefully directed</h4><p class="p">Alerts prioritize changes, deadlines, and high-value opportunities without turning every update into noise, helping teams intervene at the right moment.</p></figcaption>
                            </figure>
                            <figure class="project-screen" data-gallery-slide>
                                <div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/avena/Reports _ Q2 Exec Overview.webp' | relative_url }}" srcset="{{ '/images/projects/avena/Reports%20_%20Q2%20Exec%20Overview-560w.webp' | relative_url }} 560w, {{ '/images/projects/avena/Reports%20_%20Q2%20Exec%20Overview-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/avena/Reports%20_%20Q2%20Exec%20Overview.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="AvenaPay executive disputes report" loading="lazy" decoding="async"></div>
                                <figcaption class="project-screen-caption"><h4 class="h4">From operations to executive narrative</h4><p class="p">Custom reporting translates case activity into an outcome-oriented view leaders can use to understand performance, risk, and recovery over time.</p></figcaption>
                            </figure>
                            <figure class="project-screen" data-gallery-slide>
                                <div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/avena/Ask AI.webp' | relative_url }}" srcset="{{ '/images/projects/avena/Ask%20AI-560w.webp' | relative_url }} 560w, {{ '/images/projects/avena/Ask%20AI-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/avena/Ask%20AI.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="AvenaPay AI-assisted case analysis interface" loading="lazy" decoding="async"></div>
                                <figcaption class="project-screen-caption"><h4 class="h4">Natural-language analysis</h4><p class="p">A conversational layer lets users investigate their dispute data in familiar language, shortening the path from an emerging question to a useful answer.</p></figcaption>
                            </figure>
                        </div>
                    </div>
                </div>
            </article>

            <article class="project-story" id="project-paladin" aria-labelledby="paladin-title">
                <header class="project-story-header project-story-header--right" data-reveal="up">
                    <p class="p project-story-meta">Paladin <span aria-hidden="true">/</span> UX framing kit</p>
                    <h3 class="h3 project-story-title" id="paladin-title">A shared language for solving complex product problems.</h3>
                    <p class="p project-story-intro">A reusable wireframing system that helps teams explore structure, workflow, content priorities, accessibility, and edge cases before visual polish gets in the way.</p>
                </header>
                <div class="project-story-overview project-story-overview--reverse">
                    <figure class="project-cover" data-reveal="left">
                        <img width="750" height="500" src="{{ '/images/projects/paladin/750x500 Toptal Submission Frame.webp' | relative_url }}" srcset="{{ '/images/projects/paladin/750x500%20Toptal%20Submission%20Frame-375w.webp' | relative_url }} 375w, {{ '/images/projects/paladin/750x500%20Toptal%20Submission%20Frame.webp' | relative_url }} 750w" sizes="{{ work_image_sizes }}" alt="Paladin wireframing kit showing reusable product patterns" loading="lazy" decoding="async">
                    </figure>
                    <div class="project-story-details" data-reveal="up">
                        <section>
                            <h4 class="h4">Why it was needed</h4>
                            <p class="p">Early product work gets messy when teams jump into high-fidelity design before understanding user needs, information hierarchy, workflow logic, interaction states, and edge cases. Paladin was designed to let that confusion melt away and bring the UX problem into focus.</p>
                        </section>
                        <section>
                            <h4 class="h4">The system</h4>
                            <p class="p">I created reusable, accessibility-minded components, established patterns, and annotation-friendly layouts for complex tables, reporting, payment workflows, and data-heavy products. The kit helps teams align earlier, uncover challenges sooner, reduce rework, and move more confidently into detailed design.</p>
                        </section>
                    </div>
                </div>
                <div class="project-walkthrough" data-project-gallery data-reveal="up">
                    <header class="project-walkthrough-header">
                        <div class="project-gallery-controls">
                            <button class="project-gallery-button" type="button" data-gallery-previous aria-label="View previous Paladin screen"><svg class="project-gallery-icon" aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M16 10H4M9 5l-5 5 5 5" /></svg></button>
                            <p class="p project-gallery-count" aria-live="polite"><span data-gallery-current>1</span> / 6</p>
                            <button class="project-gallery-button" type="button" data-gallery-next aria-label="View next Paladin screen"><svg class="project-gallery-icon" aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M11 5l5 5-5 5" /></svg></button>
                        </div>
                    </header>
                    <div class="project-gallery-viewport" data-gallery-viewport tabindex="0" aria-label="Paladin UX framing kit walkthrough">
                        <div class="project-gallery-track">
                            <figure class="project-screen" data-gallery-slide><div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/paladin/Wireframing Kit – General Dashboard and Data Visualization.webp' | relative_url }}" srcset="{{ '/images/projects/paladin/Wireframing%20Kit%20%E2%80%93%20General%20Dashboard%20and%20Data%20Visualization-560w.webp' | relative_url }} 560w, {{ '/images/projects/paladin/Wireframing%20Kit%20%E2%80%93%20General%20Dashboard%20and%20Data%20Visualization-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/paladin/Wireframing%20Kit%20%E2%80%93%20General%20Dashboard%20and%20Data%20Visualization.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="Paladin dashboard and data visualization wireframing components" loading="lazy" decoding="async"></div><figcaption class="project-screen-caption"><h4 class="h4">Structure before styling</h4><p class="p">Dashboard and visualization frames help teams establish hierarchy, comparison, and decision priority before color or brand details influence the conversation.</p></figcaption></figure>
                            <figure class="project-screen" data-gallery-slide><div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/paladin/Wireframing Kit –  Tables and Data.webp' | relative_url }}" srcset="{{ '/images/projects/paladin/Wireframing%20Kit%20%E2%80%93%20%20Tables%20and%20Data-560w.webp' | relative_url }} 560w, {{ '/images/projects/paladin/Wireframing%20Kit%20%E2%80%93%20%20Tables%20and%20Data-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/paladin/Wireframing%20Kit%20%E2%80%93%20%20Tables%20and%20Data.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="Paladin table and data wireframing components" loading="lazy" decoding="async"></div><figcaption class="project-screen-caption"><h4 class="h4">Dense data with a clear job</h4><p class="p">Table patterns account for scanning, filtering, bulk actions, pagination, status, and empty states so teams can solve the workflow around the data—not merely draw rows.</p></figcaption></figure>
                            <figure class="project-screen" data-gallery-slide><div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/paladin/Wireframing Kit – Workflows and Payment Forms.webp' | relative_url }}" srcset="{{ '/images/projects/paladin/Wireframing%20Kit%20%E2%80%93%20Workflows%20and%20Payment%20Forms-560w.webp' | relative_url }} 560w, {{ '/images/projects/paladin/Wireframing%20Kit%20%E2%80%93%20Workflows%20and%20Payment%20Forms-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/paladin/Wireframing%20Kit%20%E2%80%93%20Workflows%20and%20Payment%20Forms.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="Paladin workflow and payment form wireframing components" loading="lazy" decoding="async"></div><figcaption class="project-screen-caption"><h4 class="h4">Make consequential flows discussable</h4><p class="p">Payment and workflow frames expose steps, validation, decision points, and recovery states early, when changing the experience is still inexpensive.</p></figcaption></figure>
                            <figure class="project-screen" data-gallery-slide><div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/paladin/Wireframing Kit – Reporting.webp' | relative_url }}" srcset="{{ '/images/projects/paladin/Wireframing%20Kit%20%E2%80%93%20Reporting-560w.webp' | relative_url }} 560w, {{ '/images/projects/paladin/Wireframing%20Kit%20%E2%80%93%20Reporting-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/paladin/Wireframing%20Kit%20%E2%80%93%20Reporting.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="Paladin reporting wireframing patterns" loading="lazy" decoding="async"></div><figcaption class="project-screen-caption"><h4 class="h4">Reporting as a reusable pattern</h4><p class="p">Flexible reporting structures help teams test what should be summarized, compared, saved, scheduled, and exported before committing to a final interface.</p></figcaption></figure>
                            <figure class="project-screen" data-gallery-slide><div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/paladin/Wireframing Kit – Buttons and Toggles.webp' | relative_url }}" srcset="{{ '/images/projects/paladin/Wireframing%20Kit%20%E2%80%93%20Buttons%20and%20Toggles-560w.webp' | relative_url }} 560w, {{ '/images/projects/paladin/Wireframing%20Kit%20%E2%80%93%20Buttons%20and%20Toggles-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/paladin/Wireframing%20Kit%20%E2%80%93%20Buttons%20and%20Toggles.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="Paladin buttons and toggles wireframing components" loading="lazy" decoding="async"></div><figcaption class="project-screen-caption"><h4 class="h4">Small controls, explicit behavior</h4><p class="p">Foundational controls include interaction and state considerations so accessibility and behavioral consistency enter the discussion alongside layout.</p></figcaption></figure>
                            <figure class="project-screen" data-gallery-slide><div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/paladin/Wireframing Kit – eCommerce.webp' | relative_url }}" srcset="{{ '/images/projects/paladin/Wireframing%20Kit%20%E2%80%93%20eCommerce-560w.webp' | relative_url }} 560w, {{ '/images/projects/paladin/Wireframing%20Kit%20%E2%80%93%20eCommerce-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/paladin/Wireframing%20Kit%20%E2%80%93%20eCommerce.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="Paladin ecommerce wireframing patterns" loading="lazy" decoding="async"></div><figcaption class="project-screen-caption"><h4 class="h4">Breadth without prescription</h4><p class="p">Commerce patterns demonstrate how the kit adapts to distinct product domains while remaining neutral enough for teams to explore their own content and business rules.</p></figcaption></figure>
                        </div>
                    </div>
                </div>
            </article>

            <article class="project-story" id="project-ledgerflow" aria-labelledby="ledger-title">
                <header class="project-story-header" data-reveal="up">
                    <p class="p project-story-meta">LedgerFlow <span aria-hidden="true">/</span> Payments and invoicing</p>
                    <h3 class="h3 project-story-title" id="ledger-title">One understandable flow from invoice to payment.</h3>
                    <p class="p project-story-intro">A modern fintech experience for businesses that need a clearer, calmer way to manage invoices, payments, customers, reminders, reporting, and mobile collection.</p>
                </header>
                <div class="project-story-overview">
                    <figure class="project-cover" data-reveal="right">
                        <img width="750" height="500" src="{{ '/images/projects/ledger/750x500 Toptal Submission Frame.webp' | relative_url }}" srcset="{{ '/images/projects/ledger/750x500%20Toptal%20Submission%20Frame-375w.webp' | relative_url }} 375w, {{ '/images/projects/ledger/750x500%20Toptal%20Submission%20Frame.webp' | relative_url }} 750w" sizes="{{ work_image_sizes }}" alt="LedgerFlow invoicing, payment, and collections product overview" loading="lazy" decoding="async">
                    </figure>
                    <div class="project-story-details" data-reveal="up">
                        <section>
                            <h4 class="h4">The goal</h4>
                            <p class="p">Getting paid should feel organized, trustworthy, and easy to act on—not scattered across disconnected tools or buried in confusing financial workflows. LedgerFlow needed to preserve the depth businesses rely on while making everyday financial work feel manageable.</p>
                        </section>
                        <section>
                            <h4 class="h4">My approach</h4>
                            <p class="p">I designed the core desktop and mobile flows, including the dashboard, reporting, invoice creation, payment links, customer billing, reminders, and payment collection. I focused on hierarchy, clarity, status visibility, and reusable patterns so users could quickly see what needed attention, what was handled, and where money was moving.</p>
                        </section>
                    </div>
                </div>
                <div class="project-walkthrough" data-project-gallery data-reveal="up">
                    <header class="project-walkthrough-header">
                        <div class="project-gallery-controls">
                            <button class="project-gallery-button" type="button" data-gallery-previous aria-label="View previous LedgerFlow screen"><svg class="project-gallery-icon" aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M16 10H4M9 5l-5 5 5 5" /></svg></button>
                            <p class="p project-gallery-count" aria-live="polite"><span data-gallery-current>1</span> / 6</p>
                            <button class="project-gallery-button" type="button" data-gallery-next aria-label="View next LedgerFlow screen"><svg class="project-gallery-icon" aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M11 5l5 5-5 5" /></svg></button>
                        </div>
                    </header>
                    <div class="project-gallery-viewport" data-gallery-viewport tabindex="0" aria-label="LedgerFlow product walkthrough">
                        <div class="project-gallery-track">
                            <figure class="project-screen" data-gallery-slide><div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/ledger/LedgerFlow - 01.webp' | relative_url }}" srcset="{{ '/images/projects/ledger/LedgerFlow%20-%2001-560w.webp' | relative_url }} 560w, {{ '/images/projects/ledger/LedgerFlow%20-%2001-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/ledger/LedgerFlow%20-%2001.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="LedgerFlow dashboard and financial workflow overview" loading="lazy" decoding="async"></div><figcaption class="project-screen-caption"><h4 class="h4">An actionable financial overview</h4><p class="p">The dashboard prioritizes status, movement, and exceptions so users can understand what needs attention before entering a detailed workflow.</p></figcaption></figure>
                            <figure class="project-screen" data-gallery-slide><div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/ledger/LedgerFlow - 2.webp' | relative_url }}" srcset="{{ '/images/projects/ledger/LedgerFlow%20-%202-560w.webp' | relative_url }} 560w, {{ '/images/projects/ledger/LedgerFlow%20-%202-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/ledger/LedgerFlow%20-%202.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="LedgerFlow reporting experience" loading="lazy" decoding="async"></div><figcaption class="project-screen-caption"><h4 class="h4">Reporting connected to the work</h4><p class="p">Financial summaries remain close to the underlying activity, helping businesses understand performance without moving between disconnected reporting tools.</p></figcaption></figure>
                            <figure class="project-screen" data-gallery-slide><div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/ledger/LedgerFlow - 3.webp' | relative_url }}" srcset="{{ '/images/projects/ledger/LedgerFlow%20-%203-560w.webp' | relative_url }} 560w, {{ '/images/projects/ledger/LedgerFlow%20-%203-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/ledger/LedgerFlow%20-%203.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="LedgerFlow invoice management interface" loading="lazy" decoding="async"></div><figcaption class="project-screen-caption"><h4 class="h4">Invoices organized by state</h4><p class="p">Clear status, value, customer, and due-date signals let users distinguish what is moving normally from what needs a reminder or intervention.</p></figcaption></figure>
                            <figure class="project-screen" data-gallery-slide><div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/ledger/LedgerFlow - 4.webp' | relative_url }}" srcset="{{ '/images/projects/ledger/LedgerFlow%20-%204-560w.webp' | relative_url }} 560w, {{ '/images/projects/ledger/LedgerFlow%20-%204-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/ledger/LedgerFlow%20-%204.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="LedgerFlow invoice creation workflow" loading="lazy" decoding="async"></div><figcaption class="project-screen-caption"><h4 class="h4">Create with confidence</h4><p class="p">The invoice flow uses progressive structure and immediate context to make a detailed financial task feel guided without removing the control businesses need.</p></figcaption></figure>
                            <figure class="project-screen" data-gallery-slide><div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/ledger/LedgerFlow - 5.webp' | relative_url }}" srcset="{{ '/images/projects/ledger/LedgerFlow%20-%205-560w.webp' | relative_url }} 560w, {{ '/images/projects/ledger/LedgerFlow%20-%205-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/ledger/LedgerFlow%20-%205.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="LedgerFlow payment and collections interface" loading="lazy" decoding="async"></div><figcaption class="project-screen-caption"><h4 class="h4">Collections without the chaos</h4><p class="p">Payment links, reminders, and collection activity share a common language, making the next action legible while preserving a complete record of what has happened.</p></figcaption></figure>
                            <figure class="project-screen" data-gallery-slide><div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/ledger/LedgerFlow - 6.webp' | relative_url }}" srcset="{{ '/images/projects/ledger/LedgerFlow%20-%206-560w.webp' | relative_url }} 560w, {{ '/images/projects/ledger/LedgerFlow%20-%206-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/ledger/LedgerFlow%20-%206.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="LedgerFlow mobile payment experience" loading="lazy" decoding="async"></div><figcaption class="project-screen-caption"><h4 class="h4">The same clarity on mobile</h4><p class="p">The mobile experience focuses the product around quick checks and high-value actions, extending the system without forcing a desktop interface into a smaller frame.</p></figcaption></figure>
                        </div>
                    </div>
                </div>
            </article>

            <article class="project-story" id="project-northstar" aria-labelledby="northstar-title">
                <header class="project-story-header project-story-header--right" data-reveal="up">
                    <p class="p project-story-meta">Northstar Commerce <span aria-hidden="true">/</span> Conversion strategy</p>
                    <h3 class="h3 project-story-title" id="northstar-title">A clearer path from first impression to confident conversion.</h3>
                    <p class="p project-story-intro">A conversion-focused commerce experience that helps small business owners understand the offer, compare payment products and rates, and choose the right setup for how they sell.</p>
                </header>
                <div class="project-story-overview project-story-overview--reverse">
                    <figure class="project-cover" data-reveal="left">
                        <img width="750" height="500" src="{{ '/images/projects/northstar/750x500 Toptal Submission Frame.webp' | relative_url }}" srcset="{{ '/images/projects/northstar/750x500%20Toptal%20Submission%20Frame-375w.webp' | relative_url }} 375w, {{ '/images/projects/northstar/750x500%20Toptal%20Submission%20Frame.webp' | relative_url }} 750w" sizes="{{ work_image_sizes }}" alt="Northstar Commerce landing page displayed on a transparent desktop screen" loading="lazy" decoding="async">
                    </figure>
                    <div class="project-story-details" data-reveal="up">
                        <section>
                            <h4 class="h4">The opportunity</h4>
                            <p class="p">The page needed to feel more approachable than a typical fintech experience while still communicating legitimacy, trust, and business value. Product choices and competitive rates had to become easier to evaluate without making the experience feel pushy or overbuilt.</p>
                        </section>
                        <section>
                            <h4 class="h4">My approach</h4>
                            <p class="p">I designed the landing-page structure, visual direction, product presentation, CTA strategy, trust-building sections, responsive direction, and supporting brand elements. Color, spacing, and progressive information reduce cognitive load while guiding visitors through a clear conversion path.</p>
                        </section>
                    </div>
                </div>
                <div class="project-walkthrough" data-project-gallery data-reveal="up">
                    <header class="project-walkthrough-header">
                        <div class="project-gallery-controls">
                            <button class="project-gallery-button" type="button" data-gallery-previous aria-label="View previous Northstar screen"><svg class="project-gallery-icon" aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M16 10H4M9 5l-5 5 5 5" /></svg></button>
                            <p class="p project-gallery-count" aria-live="polite"><span data-gallery-current>1</span> / 6</p>
                            <button class="project-gallery-button" type="button" data-gallery-next aria-label="View next Northstar screen"><svg class="project-gallery-icon" aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M11 5l5 5-5 5" /></svg></button>
                        </div>
                    </header>
                    <div class="project-gallery-viewport" data-gallery-viewport tabindex="0" aria-label="Northstar Commerce landing-page walkthrough">
                        <div class="project-gallery-track">
                            <figure class="project-screen" data-gallery-slide><div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/northstar/Landing Page – 01.webp' | relative_url }}" srcset="{{ '/images/projects/northstar/Landing%20Page%20%E2%80%93%2001-560w.webp' | relative_url }} 560w, {{ '/images/projects/northstar/Landing%20Page%20%E2%80%93%2001-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/northstar/Landing%20Page%20%E2%80%93%2001.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="Northstar Commerce landing-page introduction" loading="lazy" decoding="async"></div><figcaption class="project-screen-caption"><h4 class="h4">Make the offer immediately legible</h4><p class="p">The opening establishes audience, value, and next action quickly, using approachable product presentation to make a fintech decision feel less intimidating.</p></figcaption></figure>
                            <figure class="project-screen" data-gallery-slide><div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/northstar/Landing Page – 02.webp' | relative_url }}" srcset="{{ '/images/projects/northstar/Landing%20Page%20%E2%80%93%2002-560w.webp' | relative_url }} 560w, {{ '/images/projects/northstar/Landing%20Page%20%E2%80%93%2002-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/northstar/Landing%20Page%20%E2%80%93%2002.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="Northstar Commerce business benefits section" loading="lazy" decoding="async"></div><figcaption class="project-screen-caption"><h4 class="h4">Translate features into business value</h4><p class="p">The narrative moves from the product promise into recognizable small-business needs, helping visitors see how the platform fits the way they already sell.</p></figcaption></figure>
                            <figure class="project-screen" data-gallery-slide><div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/northstar/Landing Page – 03.webp' | relative_url }}" srcset="{{ '/images/projects/northstar/Landing%20Page%20%E2%80%93%2003-560w.webp' | relative_url }} 560w, {{ '/images/projects/northstar/Landing%20Page%20%E2%80%93%2003-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/northstar/Landing%20Page%20%E2%80%93%2003.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="Northstar Commerce product comparison content" loading="lazy" decoding="async"></div><figcaption class="project-screen-caption"><h4 class="h4">Make comparison feel manageable</h4><p class="p">Product options are structured around meaningful differences so visitors can evaluate fit without decoding a dense matrix or leaving the conversion path.</p></figcaption></figure>
                            <figure class="project-screen" data-gallery-slide><div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/northstar/Landing Page – 04.webp' | relative_url }}" srcset="{{ '/images/projects/northstar/Landing%20Page%20%E2%80%93%2004-560w.webp' | relative_url }} 560w, {{ '/images/projects/northstar/Landing%20Page%20%E2%80%93%2004-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/northstar/Landing%20Page%20%E2%80%93%2004.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="Northstar Commerce rates and pricing content" loading="lazy" decoding="async"></div><figcaption class="project-screen-caption"><h4 class="h4">Use transparency to build trust</h4><p class="p">Pricing and rates are introduced with enough context to support evaluation, balancing clarity with the nuance required for different business models.</p></figcaption></figure>
                            <figure class="project-screen" data-gallery-slide><div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/northstar/Landing Page – 05.webp' | relative_url }}" srcset="{{ '/images/projects/northstar/Landing%20Page%20%E2%80%93%2005-560w.webp' | relative_url }} 560w, {{ '/images/projects/northstar/Landing%20Page%20%E2%80%93%2005-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/northstar/Landing%20Page%20%E2%80%93%2005.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="Northstar Commerce trust and support content" loading="lazy" decoding="async"></div><figcaption class="project-screen-caption"><h4 class="h4">Reduce risk before asking for commitment</h4><p class="p">Support, proof, and trust signals answer the doubts that naturally appear late in consideration, strengthening confidence without relying on aggressive persuasion.</p></figcaption></figure>
                            <figure class="project-screen" data-gallery-slide><div class="project-screen-image"><img width="1600" height="1200" src="{{ '/images/projects/northstar/Landing Page – 06.webp' | relative_url }}" srcset="{{ '/images/projects/northstar/Landing%20Page%20%E2%80%93%2006-560w.webp' | relative_url }} 560w, {{ '/images/projects/northstar/Landing%20Page%20%E2%80%93%2006-1120w.webp' | relative_url }} 1120w, {{ '/images/projects/northstar/Landing%20Page%20%E2%80%93%2006.webp' | relative_url }} 1600w" sizes="{{ work_image_sizes }}" alt="Northstar Commerce final conversion section" loading="lazy" decoding="async"></div><figcaption class="project-screen-caption"><h4 class="h4">End with a clear next step</h4><p class="p">The final invitation resolves the story into a focused action, preserving the page’s friendly tone while making the path forward unmistakable.</p></figcaption></figure>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    </section>

    <section class="work-summary" aria-labelledby="work-summary-title">
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
                <a class="a button secondary" href="https://www.figma.com/@jmwii1981" target="_blank" rel="noopener noreferrer"><span class="button-label">See more in Figma <svg class="button-external-icon" aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M5 15 15 5M8 5h7v7" /></svg></span><span class="button-fill"></span></a>
                <a class="a button primary" href="{{ '/contact/' | relative_url }}"><span class="button-label">Start a conversation</span><span class="button-fill"></span></a>
            </div>
        </div>
    </section>
</main>
