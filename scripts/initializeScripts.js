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

        initializeInquiryMailtoLinks();
        initializeConsentBanner();
        initializeScrollHeader();

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
