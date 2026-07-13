/**
 * Initialize all scripts within this project.
 * This script manages the setup and execution of other module scripts.
 */

(async () => {
    try {
        // LET'S BEGIN ...
        console.log('Initializing all scripts...');

        const getCurrentDateStamp = () => {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');

            return `${year}${month}${day}`;
        };

        const getNextInquiryCount = () => {
            const storageKey = 'janmichaelInquiryCount';
            const currentCount = Number(localStorage.getItem(storageKey) || 0);
            const nextCount = currentCount + 1;

            localStorage.setItem(storageKey, nextCount);

            return String(nextCount).padStart(2, '0');
        };

        const initializeInquiryMailtoLinks = () => {
            const links = document.querySelectorAll('[data-randomized-mailto]');

            links.forEach((link) => {
                link.addEventListener('click', async (event) => {
                    event.preventDefault();

                    const dateStamp = getCurrentDateStamp();
                    const inquiryId = `${dateStamp}-${getNextInquiryCount()}`;
                    const subject = `Possible Project Lead – Inquiry #${inquiryId}`;
                    const body = `${subject}\r\n\r\nHi Jan Michael. Please connect with me at `;
                    const emailAddress = link.getAttribute('href').replace('mailto:', '').split('?')[0];
                    const mailto = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

                    link.href = mailto;
                    window.open(mailto, link.target || '_self', 'noopener');
                });
            });
        };

        const initializeConsentBanner = () => {
            const banner = document.querySelector('[data-consent-banner]');
            const acceptButton = document.querySelector('[data-consent-accept]');
            const rejectButton = document.querySelector('[data-consent-reject]');
            const storageKey = 'janmichaelConsentPreference';
            const acceptedValue = 'accepted';
            const rejectedValue = 'rejected';
            const gtmId = 'GTM-53BZRHG';

            const getStoredPreference = () => {
                try {
                    return localStorage.getItem(storageKey);
                } catch (error) {
                    console.warn('Unable to read consent preference:', error);
                    return null;
                }
            };

            const setStoredPreference = (value) => {
                try {
                    localStorage.setItem(storageKey, value);
                } catch (error) {
                    console.warn('Unable to save consent preference:', error);
                }
            };

            const hideBanner = () => {
                if (!banner) return;

                banner.hidden = true;
            };

            const showBanner = () => {
                if (!banner) return;

                banner.hidden = false;
            };

            const loadGoogleTagManager = () => {
                if (document.querySelector(`[data-gtm-id="${gtmId}"]`)) return;

                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    'gtm.start': new Date().getTime(),
                    event: 'gtm.js'
                });

                const script = document.createElement('script');
                script.async = true;
                script.dataset.gtmId = gtmId;
                script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;

                document.head.appendChild(script);
            };

            const preference = getStoredPreference();

            if (preference === acceptedValue) {
                hideBanner();
                loadGoogleTagManager();
                return;
            }

            if (preference === rejectedValue) {
                hideBanner();
                return;
            }

            showBanner();

            acceptButton?.addEventListener('click', () => {
                setStoredPreference(acceptedValue);
                hideBanner();
                loadGoogleTagManager();
            });

            rejectButton?.addEventListener('click', () => {
                setStoredPreference(rejectedValue);
                hideBanner();
            });
        };

        const initializeScrollHeader = () => {
            const header = document.querySelector('.header');

            if (!header) return;

            let isTicking = false;

            const updateHeaderState = () => {
                header.classList.toggle('is-scrolled', window.scrollY > 0);
                isTicking = false;
            };

            const requestHeaderUpdate = () => {
                if (isTicking) return;

                window.requestAnimationFrame(updateHeaderState);
                isTicking = true;
            };

            updateHeaderState();
            window.addEventListener('scroll', requestHeaderUpdate, { passive: true });
        };

        const initializeMobileNavigation = () => {
            const navContainer = document.querySelector('.nav-container');
            const toggle = navContainer?.querySelector('.nav-toggle');
            const nav = navContainer?.querySelector('.nav');

            if (!navContainer || !toggle || !nav) return;

            const mobileQuery = window.matchMedia('(max-width: 48rem)');

            const setMenuState = (isOpen, { restoreFocus = false } = {}) => {
                navContainer.classList.toggle('is-open', isOpen);
                document.body.classList.toggle('is-nav-open', isOpen);
                toggle.setAttribute('aria-expanded', String(isOpen));
                toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
                navContainer.dispatchEvent(new CustomEvent('navstatechange'));

                if (isOpen) {
                    window.requestAnimationFrame(() => nav.querySelector('.tab')?.focus());
                } else if (restoreFocus) {
                    toggle.focus();
                }
            };

            toggle.addEventListener('click', () => {
                setMenuState(!navContainer.classList.contains('is-open'));
            });

            nav.querySelectorAll('.tab').forEach((link) => {
                link.addEventListener('click', () => setMenuState(false));
            });

            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && navContainer.classList.contains('is-open')) {
                    setMenuState(false, { restoreFocus: true });
                }
            });

            mobileQuery.addEventListener('change', (event) => {
                if (!event.matches) setMenuState(false);
            });
        };

        const initializeScrollReveals = () => {
            const elements = Array.from(document.querySelectorAll('[data-reveal]'));

            if (!elements.length) return;

            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            if (reducedMotion || !('IntersectionObserver' in window)) {
                elements.forEach((element) => element.classList.add('is-visible'));
                return;
            }

            document.documentElement.classList.add('has-scroll-reveal');

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                });
            }, {
                rootMargin: '0px 0px -10% 0px',
                threshold: 0.12
            });

            elements.forEach((element) => observer.observe(element));
        };

        const initializeNavIndicator = () => {
            const navContainer = document.querySelector('.nav-container');
            const nav = document.querySelector('.nav');
            const toggle = navContainer?.querySelector('.nav-toggle');
            const indicator = navContainer?.querySelector('.nav-indicator');

            if (!navContainer || !nav || !toggle || !indicator) return;

            const links = Array.from(nav.querySelectorAll('.tab'));
            const activeLink = nav.querySelector('.tab.active');
            const mobileQuery = window.matchMedia('(max-width: 48rem)');
            let currentLink = activeLink;
            let isTicking = false;

            if (!links.length) return;

            const rootSize = () => parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
            const toRem = (value) => `${value / rootSize()}rem`;

            const setIndicatorGeometry = ({ x, y, width }) => {
                const containingBlock = indicator.closest('.header')?.getBoundingClientRect();
                const localX = x - (containingBlock?.left || 0);
                const localY = y - (containingBlock?.top || 0);

                indicator.style.setProperty('--nav-indicator-x', toRem(localX));
                indicator.style.setProperty('--nav-indicator-y', toRem(localY));
                indicator.style.setProperty('--nav-indicator-width', toRem(width));
                indicator.classList.add('is-ready');
            };

            const setDesktopTarget = (link) => {
                if (!link) return;

                const linkRect = link.getBoundingClientRect();
                const tabRect = link.closest('.tab-container')?.getBoundingClientRect() || linkRect;

                setIndicatorGeometry({
                    x: linkRect.left,
                    y: tabRect.bottom - (rootSize() * 0.375),
                    width: linkRect.width
                });
                currentLink = link;
            };

            const setMobileTarget = () => {
                const toggleRect = toggle.getBoundingClientRect();
                const lineWidth = rootSize() * 1.625;
                const isOpen = navContainer.classList.contains('is-open');

                setIndicatorGeometry({
                    x: toggleRect.left + ((toggleRect.width - lineWidth) / 2),
                    y: toggleRect.top + (toggleRect.height / 2) + (isOpen ? -1 : rootSize() * 0.25),
                    width: lineWidth
                });
            };

            const updateIndicator = () => {
                if (mobileQuery.matches) {
                    setMobileTarget();
                } else {
                    setDesktopTarget(currentLink || activeLink || links[0]);
                }
                isTicking = false;
            };

            const requestIndicatorUpdate = () => {
                if (isTicking) return;

                window.requestAnimationFrame(updateIndicator);
                isTicking = true;
            };

            nav.classList.add('has-sliding-underline');
            requestIndicatorUpdate();

            if (document.fonts?.ready) {
                document.fonts.ready.then(requestIndicatorUpdate).catch(requestIndicatorUpdate);
            } else {
                window.addEventListener('load', requestIndicatorUpdate, { once: true });
            }

            links.forEach((link) => {
                link.addEventListener('mouseenter', () => {
                    if (!mobileQuery.matches) setDesktopTarget(link);
                });
                link.addEventListener('focus', () => {
                    if (!mobileQuery.matches) setDesktopTarget(link);
                });
            });

            nav.addEventListener('mouseleave', () => {
                if (!mobileQuery.matches) setDesktopTarget(activeLink || links[0]);
            });

            navContainer.addEventListener('navstatechange', requestIndicatorUpdate);
            mobileQuery.addEventListener('change', requestIndicatorUpdate);
            window.addEventListener('resize', requestIndicatorUpdate);
        };

        const initializeCompanyLogoCarousel = () => {
            const carousel = document.querySelector('.logo-carousel');

            if (!carousel) return;

            const track = carousel.querySelector('.logo-carousel-track');
            const items = Array.from(carousel.querySelectorAll('.testimony-item'));

            if (!track || items.length < 2) return;

            const createSequence = (isDuplicate = false) => {
                const sequence = document.createElement('ul');

                sequence.className = 'testimony-list logo-carousel-sequence';

                if (isDuplicate) {
                    sequence.setAttribute('aria-hidden', 'true');
                }

                items.forEach((item) => {
                    sequence.appendChild(item.cloneNode(true));
                });

                return sequence;
            };

            track.replaceChildren(createSequence(), createSequence(true));
            carousel.classList.add('is-continuous');

            const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

            if (reducedMotionQuery.matches) return;

            const fadeLogosAtEdges = () => {
                const viewport = carousel.querySelector('.logo-carousel-viewport');

                if (!viewport) return;

                const viewportRect = viewport.getBoundingClientRect();
                const fadeWidth = Math.min(360, viewportRect.width * 0.4);
                const visibleItems = Array.from(track.querySelectorAll('.testimony-item'));

                visibleItems.forEach((item) => {
                    const itemRect = item.getBoundingClientRect();
                    const logo = item.querySelector('.company-logo');
                    const itemCenter = itemRect.left + itemRect.width / 2;
                    const leftOpacity = (itemCenter - viewportRect.left) / fadeWidth;
                    const rightOpacity = (viewportRect.right - itemCenter) / fadeWidth;
                    const opacity = Math.max(0, Math.min(1, leftOpacity, rightOpacity));

                    logo?.style.setProperty('--logo-opacity', opacity.toFixed(3));
                });

                window.requestAnimationFrame(fadeLogosAtEdges);
            };

            window.requestAnimationFrame(fadeLogosAtEdges);
        };

        const initializeRecommendationCarousel = () => {
            const carousel = document.querySelector('.recommendation-list');

            if (!carousel) return;

            const items = Array.from(carousel.querySelectorAll('.recommendation-item'));
            const intervalMs = 10000;
            const transitionDelayMs = 900;
            let currentIndex = 0;
            let timerId;
            let transitionTimerId;
            let isTransitioning = false;

            if (items.length < 2) return;

            const activateItem = (index) => {
                items.forEach((item, itemIndex) => {
                    item.classList.toggle('is-active', itemIndex === index);
                });

                currentIndex = index;
            };

            const transitionToItem = (index) => {
                if (isTransitioning) return;

                isTransitioning = true;
                window.clearTimeout(transitionTimerId);

                items[currentIndex]?.classList.remove('is-active');

                transitionTimerId = window.setTimeout(() => {
                    activateItem(index);
                    isTransitioning = false;
                }, transitionDelayMs);
            };

            const queueNextItem = () => {
                window.clearTimeout(timerId);
                timerId = window.setTimeout(showNextItem, intervalMs);
            };

            const showNextItem = () => {
                transitionToItem((currentIndex + 1) % items.length);
                queueNextItem();
            };

            carousel.classList.add('is-controlled');
            carousel.setAttribute('role', 'button');
            carousel.setAttribute('tabindex', '0');
            carousel.setAttribute('aria-label', 'Show next recommendation');

            activateItem(currentIndex);
            queueNextItem();

            carousel.addEventListener('click', showNextItem);
            carousel.addEventListener('keydown', (event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;

                event.preventDefault();
                showNextItem();
            });
        };

        initializeInquiryMailtoLinks();
        initializeConsentBanner();
        initializeScrollHeader();
        initializeMobileNavigation();
        initializeScrollReveals();
        initializeNavIndicator();
        initializeCompanyLogoCarousel();
        initializeRecommendationCarousel();

        // WHAT PAGE ARE WE ON?
        
        // Check if the current page path is '/'
        if (window.location.pathname === '/') {

            // Perspectives page scripts ...
            console.log('You are on the work page!');
        
        }
        
        // Check if the current page path is '/endorsements/'
        if (window.location.pathname === '/endorsements/') {

            // Perspectives page scripts ...
            console.log('You are on the endorsements page!');
        
        }
        
        // Check if the current page path is '/perspectives/'
        if (window.location.pathname === '/perspectives/') {

            // Perspectives page scripts ...
            console.log('You are on the perspectives page!');
            
            // Dynamically import the script
            const { renderPost } = await import('./perspectives/renderPost.mjs');
            
            // URL for initialization
            const feedUrl = 'https://medium.com/feed/@jmwii1981';
            
            // Render the most recent post
            await renderPost(feedUrl);
        }

        // Check if the current page path is '/about/'
        if (window.location.pathname === '/about/') {

            // Perspectives page scripts ...
            console.log('You are on the about page!');
        
        }

        // LET'S WRAP THIS UP!
        console.log('All scripts initialized successfully.');
    } catch (error) {
        console.error('Error initializing scripts:', error);
    }
})();
