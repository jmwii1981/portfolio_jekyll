/**
 * Initialize all scripts within this project.
 * This script manages the setup and execution of other module scripts.
 */

(async () => {
    try {
        const initializeContactForm = () => {
            const form = document.querySelector('[data-contact-form]');

            if (!form) return;

            const submitButton = form.querySelector('[type="submit"]');
            const buttonLabel = submitButton?.querySelector('.button-label');
            const status = form.querySelector('[data-contact-status]');
            const requiredFields = Array.from(form.querySelectorAll('[required]'));

            if (!submitButton || !buttonLabel || !status || typeof window.fetch !== 'function') return;

            const defaultButtonLabel = buttonLabel.textContent;
            let isSubmitting = false;

            const setStatus = (message, state = '') => {
                status.textContent = message;

                if (state) {
                    status.dataset.state = state;
                } else {
                    status.removeAttribute('data-state');
                }
            };

            const withDirectEmailFallback = (message) => {
                const trimmedMessage = message.trim();
                const punctuation = /[.!?]$/.test(trimmedMessage) ? '' : '.';

                return `${trimmedMessage}${punctuation} You can also use the direct email link below.`;
            };

            const getFieldName = (field) => {
                const label = field.labels?.[0]?.textContent.trim();

                return label ? label.toLowerCase() : 'field';
            };

            const getFieldErrorMessage = (field) => {
                const fieldName = getFieldName(field);

                if (field.required && !field.value.trim()) {
                    return `Enter your ${fieldName}.`;
                }

                if (field.validity.typeMismatch && field.type === 'email') {
                    return 'Enter an email address in the format name@example.com.';
                }

                if (field.validity.tooLong) {
                    return `Keep your ${fieldName} to ${field.maxLength} characters or fewer.`;
                }

                if (!field.validity.valid) {
                    return `Review your ${fieldName}.`;
                }

                return '';
            };

            const setFieldError = (field, message = '') => {
                const error = document.getElementById(`${field.id}-error`);

                if (!error) return;

                error.textContent = message;
                error.hidden = !message;

                if (message) {
                    field.setAttribute('aria-invalid', 'true');
                } else {
                    field.removeAttribute('aria-invalid');
                }
            };

            const clearFieldErrors = () => {
                requiredFields.forEach((field) => setFieldError(field));
            };

            // Replace temporary browser bubbles only when the inline validation enhancement is active.
            // Without JavaScript, the authored constraints and direct form POST remain unchanged.
            form.noValidate = true;

            requiredFields.forEach((field) => {
                field.addEventListener('invalid', () => {
                    setFieldError(field, getFieldErrorMessage(field));
                });

                field.addEventListener('input', () => {
                    if (field.getAttribute('aria-invalid') === 'true') {
                        setFieldError(field, getFieldErrorMessage(field));
                    }

                    if (status.dataset.state && status.dataset.state !== 'pending') {
                        setStatus();
                    }
                });
            });

            form.addEventListener('submit', async (event) => {
                event.preventDefault();

                if (isSubmitting) return;

                const invalidFields = requiredFields
                    .map((field) => ({ field, message: getFieldErrorMessage(field) }))
                    .filter(({ message }) => message);

                if (invalidFields.length) {
                    setStatus();
                    invalidFields.forEach(({ field, message }) => setFieldError(field, message));
                    invalidFields[0].field.focus();
                    return;
                }

                clearFieldErrors();
                isSubmitting = true;
                form.setAttribute('aria-busy', 'true');
                submitButton.disabled = true;
                buttonLabel.textContent = 'Sending…';
                setStatus('Sending your message…', 'pending');

                try {
                    const response = await fetch(form.action, {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json'
                        },
                        body: new FormData(form)
                    });
                    const data = await response.json();

                    if (!response.ok || data?.success !== true) {
                        const responseMessage = [data?.message, data?.body?.message, data?.error]
                            .find((message) => typeof message === 'string' && message.trim());
                        const message = response.status === 429
                            ? 'Too many attempts were made. Please wait and try again, or use the direct email link below.'
                            : withDirectEmailFallback(responseMessage || 'I couldn’t send your message. Please try again.');
                        const submissionError = new Error(message);

                        submissionError.name = 'ContactSubmissionError';
                        throw submissionError;
                    }

                    form.reset();
                    clearFieldErrors();
                    setStatus('Thanks—your message has been sent.', 'success');
                } catch (error) {
                    console.error('Contact form submission failed:', error);

                    const message = error?.name === 'ContactSubmissionError'
                        ? error.message
                        : 'Something went wrong. Please try again or use the direct email link below.';

                    setStatus(message, 'error');
                } finally {
                    isSubmitting = false;
                    form.removeAttribute('aria-busy');
                    submitButton.disabled = false;
                    buttonLabel.textContent = defaultButtonLabel;
                }
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

        const initializeWorkProjectIndex = () => {
            const projectIndex = document.querySelector('.work-project-index');
            const projectList = projectIndex?.querySelector('.work-project-index-list');
            const previousProjectButton = projectIndex?.querySelector('[data-project-index-previous]');
            const nextProjectButton = projectIndex?.querySelector('[data-project-index-next]');
            const projectLinks = Array.from(projectIndex?.querySelectorAll('a[href^="#project-"]') || []);
            const projectEntries = projectLinks.map((link) => {
                const projectId = link.getAttribute('href')?.slice(1);
                const project = projectId ? document.getElementById(projectId) : null;
                const heading = project?.querySelector('.project-story-title');
                const item = link.closest('li');

                return project && heading && item ? { heading, item, link, project, projectId } : null;
            }).filter(Boolean);

            if (!projectIndex || !projectList || !projectEntries.length) return;

            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            let activeProjectId = null;
            let navigationFrameId = null;
            let isTicking = false;
            let navigationToken = 0;

            projectEntries.forEach((entry) => {
                entry.heading.tabIndex = -1;
            });

            const updateProjectScrollControls = () => {
                const maximumScrollLeft = Math.max(0, projectList.scrollWidth - projectList.clientWidth);
                const hasOverflow = maximumScrollLeft > 1;

                if (previousProjectButton) {
                    previousProjectButton.hidden = !hasOverflow || projectList.scrollLeft <= 1;
                }

                if (nextProjectButton) {
                    nextProjectButton.hidden = !hasOverflow || projectList.scrollLeft >= maximumScrollLeft - 1;
                }
            };

            const scrollProjectList = (direction) => {
                const step = projectEntries[0]?.item.offsetWidth || projectList.clientWidth * 0.5;

                projectList.scrollBy({
                    behavior: reducedMotion ? 'auto' : 'smooth',
                    left: direction * step
                });
            };

            const triggerProjectIndicatorSheen = () => {
                if (reducedMotion) return;

                projectList.classList.remove('is-sheening');
                void projectList.offsetWidth;
                projectList.classList.add('is-sheening');
            };

            const clearActiveProject = () => {
                projectLinks.forEach((link) => link.removeAttribute('aria-current'));
                projectList.classList.remove('has-active-project');
                activeProjectId = null;
            };

            const setActiveProject = (entry, { ensureVisible = false } = {}) => {
                const hasChanged = activeProjectId !== entry.projectId;

                projectList.style.setProperty('--work-project-indicator-x', `${entry.item.offsetLeft}px`);
                projectList.style.setProperty('--work-project-indicator-width', `${entry.item.offsetWidth}px`);
                projectLinks.forEach((link) => {
                    if (link === entry.link) {
                        link.setAttribute('aria-current', 'location');
                    } else {
                        link.removeAttribute('aria-current');
                    }
                });
                projectList.classList.add('has-active-project');
                activeProjectId = entry.projectId;

                if ((hasChanged || ensureVisible) && projectList.scrollWidth > projectList.clientWidth) {
                    const centeredLeft = entry.item.offsetLeft - ((projectList.clientWidth - entry.item.offsetWidth) / 2);

                    projectList.scrollTo({
                        behavior: reducedMotion ? 'auto' : 'smooth',
                        left: Math.max(0, centeredLeft)
                    });
                }
            };

            const cancelProjectNavigation = () => {
                navigationToken += 1;

                if (navigationFrameId !== null) {
                    window.cancelAnimationFrame(navigationFrameId);
                    navigationFrameId = null;
                }
            };

            const scrollToProject = (entry) => {
                cancelProjectNavigation();

                const currentNavigationToken = ++navigationToken;
                const destinationHash = `#${entry.projectId}`;

                if (window.location.hash !== destinationHash) {
                    window.history.pushState(null, '', destinationHash);
                }

                const expectedTop = Number.parseFloat(window.getComputedStyle(entry.project).scrollMarginTop) || 0;
                const maximumScrollTop = document.documentElement.scrollHeight - window.innerHeight;
                const startTop = window.scrollY;
                const destinationTop = Math.min(
                    maximumScrollTop,
                    Math.max(0, startTop + entry.project.getBoundingClientRect().top - expectedTop)
                );
                const distance = Math.abs(destinationTop - startTop);

                const finishNavigation = () => {
                    if (currentNavigationToken !== navigationToken) return;

                    navigationFrameId = null;
                    window.scrollTo(0, destinationTop);
                    entry.heading.focus({ preventScroll: true });
                };

                if (reducedMotion || distance < 2) {
                    window.scrollTo(0, destinationTop);
                    navigationFrameId = window.requestAnimationFrame(finishNavigation);
                    return;
                }

                const duration = Math.min(900, Math.max(500, 420 + Math.sqrt(distance) * 5));
                const animationStart = window.performance.now();

                const animateProjectScroll = (currentTime) => {
                    if (currentNavigationToken !== navigationToken) return;

                    const progress = Math.min(1, (currentTime - animationStart) / duration);
                    const easedProgress = progress < 0.5
                        ? 4 * progress ** 3
                        : 1 - ((-2 * progress + 2) ** 3) / 2;

                    window.scrollTo(0, startTop + (destinationTop - startTop) * easedProgress);

                    if (progress < 1) {
                        navigationFrameId = window.requestAnimationFrame(animateProjectScroll);
                    } else {
                        finishNavigation();
                    }
                };

                navigationFrameId = window.requestAnimationFrame(animateProjectScroll);
            };

            const updateProjectIndexState = () => {
                const stickyTop = Number.parseFloat(window.getComputedStyle(projectIndex).top) || 0;
                const projectIndexRect = projectIndex.getBoundingClientRect();
                const currentTop = projectIndexRect.top;
                const isStuck = Math.abs(currentTop - stickyTop) < 1.5;

                projectIndex.classList.toggle('is-stuck', isStuck);

                if (isStuck) {
                    const activationLine = Math.max(projectIndexRect.bottom + 2 * 16, window.innerHeight * 0.38);
                    const activeEntry = projectEntries.reduce((currentEntry, entry) => (
                        entry.project.getBoundingClientRect().top <= activationLine ? entry : currentEntry
                    ), projectEntries[0]);

                    setActiveProject(activeEntry);
                } else {
                    clearActiveProject();
                }

                isTicking = false;
            };

            const requestProjectIndexUpdate = () => {
                if (isTicking) return;

                window.requestAnimationFrame(updateProjectIndexState);
                isTicking = true;
            };

            const handleProjectIndexResize = () => {
                updateProjectScrollControls();
                requestProjectIndexUpdate();
                window.requestAnimationFrame(() => {
                    updateProjectScrollControls();
                    requestProjectIndexUpdate();
                });
            };

            previousProjectButton?.addEventListener('click', () => scrollProjectList(-1));
            nextProjectButton?.addEventListener('click', () => scrollProjectList(1));
            projectList.addEventListener('scroll', updateProjectScrollControls, { passive: true });
            projectList.addEventListener('animationend', (event) => {
                if (event.animationName === 'work-project-indicator-sheen') {
                    projectList.classList.remove('is-sheening');
                }
            });

            projectEntries.forEach((entry) => {
                entry.link.addEventListener('click', (event) => {
                    const hasModifier = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;

                    if (event.defaultPrevented || event.button !== 0 || hasModifier) return;

                    event.preventDefault();
                    triggerProjectIndicatorSheen();
                    scrollToProject(entry);
                });
            });

            ['wheel', 'touchstart'].forEach((eventName) => {
                window.addEventListener(eventName, cancelProjectNavigation, { passive: true });
            });

            window.addEventListener('keydown', (event) => {
                const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];

                if (scrollKeys.includes(event.key)) cancelProjectNavigation();
            });

            updateProjectScrollControls();
            updateProjectIndexState();
            window.addEventListener('scroll', requestProjectIndexUpdate, { passive: true });
            window.addEventListener('resize', handleProjectIndexResize);
        };

        const initializeMobileNavigation = () => {
            const navContainer = document.querySelector('.nav-container');
            const toggle = navContainer?.querySelector('.nav-toggle');
            const nav = navContainer?.querySelector('.nav');
            const backgroundRegions = Array.from(document.querySelectorAll('.skip-link, .site-identity, main, footer, [data-consent-banner]'));

            if (!navContainer || !toggle || !nav) return;

            const mobileQuery = window.matchMedia('(max-width: 44.25rem)');
            let transitionTimerId = null;

            const cancelMenuTransition = () => {
                window.clearTimeout(transitionTimerId);
                transitionTimerId = null;
                navContainer.classList.remove('is-transitioning');
            };

            const setMenuState = (isOpen, { animate = false, restoreFocus = false } = {}) => {
                const shouldAnimate = animate && mobileQuery.matches;

                cancelMenuTransition();
                navContainer.classList.toggle('is-transitioning', shouldAnimate);
                navContainer.classList.toggle('is-open', isOpen);
                document.documentElement.classList.toggle('is-nav-open', isOpen);
                document.body.classList.toggle('is-nav-open', isOpen);
                toggle.setAttribute('aria-expanded', String(isOpen));
                toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
                navContainer.dispatchEvent(new CustomEvent('navstatechange'));
                backgroundRegions.forEach((region) => {
                    region.inert = isOpen;
                });

                if (isOpen) {
                    window.requestAnimationFrame(() => nav.querySelector('.tab')?.focus());
                } else if (restoreFocus) {
                    toggle.focus();
                }

                if (shouldAnimate) {
                    transitionTimerId = window.setTimeout(cancelMenuTransition, 300);
                }
            };

            toggle.addEventListener('click', () => {
                setMenuState(!navContainer.classList.contains('is-open'), { animate: true });
            });

            nav.querySelectorAll('.tab').forEach((link) => {
                link.addEventListener('click', () => setMenuState(false));
            });

            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && navContainer.classList.contains('is-open')) {
                    setMenuState(false, { animate: true, restoreFocus: true });
                }
            });

            const handleMobileChange = (event) => {
                if (!event.matches) setMenuState(false);
            };

            if (typeof mobileQuery.addEventListener === 'function') {
                mobileQuery.addEventListener('change', handleMobileChange);
            } else if (typeof mobileQuery.addListener === 'function') {
                mobileQuery.addListener(handleMobileChange);
            }

            window.addEventListener('resize', cancelMenuTransition, { passive: true });
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

        const initializeProjectGalleries = () => {
            const galleries = document.querySelectorAll('[data-project-gallery]');

            galleries.forEach((gallery) => {
                const story = gallery.closest('.project-story');
                const overview = story?.querySelector('.project-story-overview');
                const cover = overview?.querySelector('.project-cover');
                const details = overview?.querySelector('.project-story-details');
                const viewport = gallery.querySelector('[data-gallery-viewport]');
                const track = gallery.querySelector('.project-gallery-track');
                const previousButton = gallery.querySelector('[data-gallery-previous]');
                const nextButton = gallery.querySelector('[data-gallery-next]');
                const copyItems = [];

                if (!viewport || !track || !previousButton || !nextButton) return;

                if (cover && details && overview) {
                    const coverSlide = document.createElement('figure');
                    const coverImageWrapper = document.createElement('div');
                    const coverImage = cover.querySelector('img')?.cloneNode(true);

                    if (coverImage) {
                        coverSlide.className = 'project-screen project-screen--cover';
                        coverSlide.dataset.gallerySlide = '';
                        coverImageWrapper.className = 'project-screen-image';
                        coverImageWrapper.append(coverImage);
                        coverSlide.append(coverImageWrapper);
                        track.prepend(coverSlide);
                    }

                    const overviewCopy = document.createElement('div');
                    overviewCopy.className = 'project-gallery-copy-item project-gallery-copy-item--overview';
                    overviewCopy.append(...Array.from(details.children));
                    details.classList.add('project-story-copy-panel');
                    details.setAttribute('aria-live', 'polite');
                    details.append(overviewCopy);
                    copyItems.push(overviewCopy);

                    gallery.dataset.reveal = cover.dataset.reveal || 'up';
                    gallery.classList.add('project-walkthrough--integrated');
                    overview.insertBefore(gallery, details);
                    cover.remove();
                }

                const slides = Array.from(gallery.querySelectorAll('[data-gallery-slide]'));

                slides.slice(copyItems.length).forEach((slide) => {
                    const caption = slide.querySelector('.project-screen-caption');

                    if (!caption || !details) return;

                    caption.classList.add('project-gallery-copy-item');
                    details.append(caption);
                    copyItems.push(caption);
                });
                const countLabel = gallery.querySelector('.project-gallery-count');
                const currentLabel = gallery.querySelector('[data-gallery-current]');

                if (slides.length < 2) return;

                if (countLabel?.lastChild) {
                    countLabel.lastChild.textContent = ` / ${slides.length}`;
                }

                let currentIndex = 0;
                let isTicking = false;
                let isProgrammaticNavigation = false;
                let navigationTimerId;
                let visibleCopyIndex = null;
                let copyTransitionToken = 0;

                const updateCopy = (index) => {
                    if (!copyItems.length || visibleCopyIndex === index) return;

                    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    const outgoing = visibleCopyIndex === null ? null : copyItems[visibleCopyIndex];
                    const incoming = copyItems[index];
                    const canAnimate = typeof incoming?.animate === 'function' && (!outgoing || typeof outgoing.animate === 'function');
                    const transitionToken = ++copyTransitionToken;

                    copyItems.forEach((item) => item.getAnimations?.().forEach((animation) => animation.cancel()));

                    const revealIncoming = () => {
                        if (transitionToken !== copyTransitionToken) return;

                        copyItems.forEach((item, itemIndex) => {
                            item.hidden = itemIndex !== index;
                        });
                        visibleCopyIndex = index;

                        if (!reducedMotion && canAnimate) {
                            incoming.animate(
                                [
                                    { opacity: 0, transform: 'translateY(0.5rem)' },
                                    { opacity: 1, transform: 'translateY(0)' }
                                ],
                                { duration: 240, easing: 'ease-out' }
                            );
                        }
                    };

                    if (!outgoing || reducedMotion || !canAnimate) {
                        revealIncoming();
                        return;
                    }

                    outgoing.animate(
                        [
                            { opacity: 1, transform: 'translateY(0)' },
                            { opacity: 0, transform: 'translateY(-0.25rem)' }
                        ],
                        { duration: 140, easing: 'ease-in' }
                    ).finished.then(revealIncoming).catch(() => {});
                };

                const updateState = (index) => {
                    currentIndex = Math.max(0, Math.min(index, slides.length - 1));
                    previousButton.disabled = currentIndex === 0;
                    nextButton.disabled = currentIndex === slides.length - 1;
                    updateCopy(currentIndex);

                    if (currentLabel) currentLabel.textContent = String(currentIndex + 1);
                };

                const getNearestSlideIndex = () => slides.reduce((nearestIndex, slide, index) => {
                    const nearestDistance = Math.abs(slides[nearestIndex].offsetLeft - viewport.scrollLeft);
                    const slideDistance = Math.abs(slide.offsetLeft - viewport.scrollLeft);

                    return slideDistance < nearestDistance ? index : nearestIndex;
                }, 0);

                const goToSlide = (index) => {
                    const targetIndex = Math.max(0, Math.min(index, slides.length - 1));
                    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

                    window.clearTimeout(navigationTimerId);
                    isProgrammaticNavigation = true;

                    viewport.scrollTo({
                        behavior: reducedMotion ? 'auto' : 'smooth',
                        left: slides[targetIndex].offsetLeft
                    });
                    updateState(targetIndex);

                    navigationTimerId = window.setTimeout(() => {
                        isProgrammaticNavigation = false;
                    }, reducedMotion ? 0 : 500);
                };

                previousButton.addEventListener('click', () => goToSlide(currentIndex - 1));
                nextButton.addEventListener('click', () => goToSlide(currentIndex + 1));

                viewport.addEventListener('keydown', (event) => {
                    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

                    event.preventDefault();
                    goToSlide(currentIndex + (event.key === 'ArrowRight' ? 1 : -1));
                });

                viewport.addEventListener('scroll', () => {
                    if (isTicking || isProgrammaticNavigation) return;

                    window.requestAnimationFrame(() => {
                        updateState(getNearestSlideIndex());
                        isTicking = false;
                    });
                    isTicking = true;
                }, { passive: true });

                window.addEventListener('resize', () => goToSlide(currentIndex));
                updateState(currentIndex);
            });
        };

        const initializeLogoAnimation = () => {
            const logo = document.querySelector('.logo-container.large .logo.large');
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            if (!logo || reducedMotion) return;

            const paths = [1, 2, 3, 4]
                .map((column) => logo.querySelector(`.anim-col-${column}`));

            if (paths.some((path) => !path)) return;

            const subpageFrames = [
                [
                    [0, 33, 92, 125, 1],
                    [0.22, 33, 72, 108, 1],
                    [0.48, 33, 58, 96, 1],
                    [0.72, 33, 76, 112, 1],
                    [0.88, 33, 88, 122, 1],
                    [1, 33, 92, 125, 1]
                ],
                [
                    [0, 64, 33, 125, 1],
                    [0.22, 64, 47, 112, 1],
                    [0.48, 64, 26, 130, 1],
                    [0.72, 64, 42, 118, 1],
                    [0.88, 64, 35, 124, 1],
                    [1, 64, 33, 125, 1]
                ],
                [
                    [0, 95, 33, 125, 1],
                    [0.22, 95, 52, 108, 1],
                    [0.48, 95, 40, 116, 1],
                    [0.72, 95, 22, 130, 1],
                    [0.88, 95, 31, 126, 1],
                    [1, 95, 33, 125, 1]
                ],
                [
                    [0, 126, 33, 125, 1],
                    [0.22, 126, 60, 98, 1],
                    [0.48, 126, 48, 112, 1],
                    [0.72, 126, 27, 130, 1],
                    [0.88, 126, 35, 123, 1],
                    [1, 126, 33, 125, 1]
                ]
            ];

            const homeFrames = [
                [
                    [0, 33, 114.9, 115, 1],
                    [0.23, 33, 114.9, 115, 1],
                    [0.31, 64, 95, 125, 1],
                    [0.39, 64, 95, 125, 1],
                    [0.47, 48.5, 43, 125, 1],
                    [0.55, 48.5, 43, 125, 1],
                    [0.63, 48.5, 43, 125, 1],
                    [0.71, 48.5, 43, 125, 1],
                    [0.79, 33, 114.9, 115, 0],
                    [0.87, 33, 114.9, 115, 0],
                    [1, 33, 92, 125, 1]
                ],
                [
                    [0, 64, 114.9, 115, 0],
                    [0.055, 64, 114.9, 115, 0],
                    [0.056, 64, 114.9, 115, 1],
                    [0.23, 64, 114.9, 115, 1],
                    [0.31, 95, 43, 125, 1],
                    [0.39, 95, 43, 125, 1],
                    [0.47, 79.5, 54, 92, 1],
                    [0.55, 79.5, 54, 92, 1],
                    [0.63, 79.5, 83, 111, 1],
                    [0.71, 79.5, 83, 111, 1],
                    [0.79, 64, 114.9, 115, 0],
                    [0.87, 64, 114.9, 115, 0],
                    [1, 64, 33, 125, 1]
                ],
                [
                    [0, 95, 114.9, 115, 0],
                    [0.11, 95, 114.9, 115, 0],
                    [0.111, 95, 114.9, 115, 1],
                    [0.23, 95, 114.9, 115, 1],
                    [0.31, 95, 114.9, 115, 0],
                    [0.39, 95, 114.9, 115, 0],
                    [0.47, 110.5, 43, 125, 1],
                    [0.55, 110.5, 43, 125, 1],
                    [0.63, 110.5, 43, 125, 1],
                    [0.71, 110.5, 43, 125, 1],
                    [0.79, 64, 43, 125, 1],
                    [0.87, 64, 43, 125, 1],
                    [1, 95, 33, 125, 1]
                ],
                [
                    [0, 126, 114.9, 115, 0],
                    [0.165, 126, 114.9, 115, 0],
                    [0.166, 126, 114.9, 115, 1],
                    [0.23, 126, 114.9, 115, 1],
                    [0.31, 126, 114.9, 115, 0],
                    [0.71, 126, 114.9, 115, 0],
                    [0.79, 95, 43, 125, 1],
                    [0.87, 95, 43, 125, 1],
                    [1, 126, 33, 125, 1]
                ]
            ];

            const isHome = logo.closest('.logo-container--home');
            const duration = isHome ? 3600 : 900;
            const delays = isHome ? [0, 0, 0, 0] : [0, 40, 80, 120];
            const framesByPath = isHome ? homeFrames : subpageFrames;
            const originals = paths.map((path) => path.getAttribute('d'));
            const ease = (value) => value < 0.5
                ? 4 * value * value * value
                : 1 - Math.pow(-2 * value + 2, 3) / 2;
            const interpolate = (start, end, progress) => start + ((end - start) * progress);

            const sampleFrames = (frames, progress) => {
                const nextIndex = frames.findIndex((frame) => frame[0] >= progress);

                if (nextIndex <= 0) return frames[0];
                if (nextIndex === -1) return frames[frames.length - 1];

                const previous = frames[nextIndex - 1];
                const next = frames[nextIndex];
                const span = next[0] - previous[0];
                const localProgress = span ? ease((progress - previous[0]) / span) : 1;

                return [
                    progress,
                    interpolate(previous[1], next[1], localProgress),
                    interpolate(previous[2], next[2], localProgress),
                    interpolate(previous[3], next[3], localProgress),
                    interpolate(previous[4], next[4], localProgress)
                ];
            };

            document.documentElement.classList.add('uses-scripted-logo-animation');

            const startedAt = window.performance.now();
            const animate = (timestamp) => {
                let isComplete = true;

                paths.forEach((path, index) => {
                    const elapsed = timestamp - startedAt - delays[index];
                    const progress = Math.max(0, Math.min(elapsed / duration, 1));
                    const [, x, y1, y2, opacity] = sampleFrames(framesByPath[index], progress);

                    path.setAttribute('d', `M${x} ${y1}L${x} ${y2}`);
                    path.style.opacity = opacity;

                    if (progress < 1) isComplete = false;
                });

                if (!isComplete) {
                    window.requestAnimationFrame(animate);
                    return;
                }

                paths.forEach((path, index) => {
                    path.setAttribute('d', originals[index]);
                    path.style.removeProperty('opacity');
                });
            };

            window.requestAnimationFrame(animate);
        };

        const initializeNavIndicator = () => {
            const navContainer = document.querySelector('.nav-container');
            const nav = document.querySelector('.nav');
            const toggle = navContainer?.querySelector('.nav-toggle');
            const indicator = navContainer?.querySelector('.nav-indicator');

            if (!navContainer || !nav || !toggle || !indicator) return;

            const links = Array.from(nav.querySelectorAll('.tab'));
            const activeLink = nav.querySelector('.tab.active');
            const mobileQuery = window.matchMedia('(max-width: 44.25rem)');
            let currentLink = activeLink;
            let hasPositionedIndicator = false;
            let isTicking = false;

            if (!links.length) return;

            const rootSize = () => parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
            const toRem = (value) => `${value / rootSize()}rem`;

            const setIndicatorGeometry = ({ x, y, width }) => {
                const containingElement = indicator.closest('.header');
                const containingBlock = containingElement?.getBoundingClientRect();
                const localX = x - (containingBlock?.left || 0) - (containingElement?.clientLeft || 0);
                const localY = y - (containingBlock?.top || 0) - (containingElement?.clientTop || 0);

                indicator.style.setProperty('--nav-indicator-x', toRem(localX));
                indicator.style.setProperty('--nav-indicator-width', toRem(width));

                if (!hasPositionedIndicator) {
                    const dropDistance = rootSize() * 0.75;

                    indicator.classList.add('is-positioning');
                    indicator.style.setProperty('--nav-indicator-y', toRem(localY - dropDistance));
                    indicator.getBoundingClientRect();
                    indicator.classList.add('is-ready');
                    indicator.classList.remove('is-positioning');
                    hasPositionedIndicator = true;

                    window.requestAnimationFrame(() => {
                        indicator.style.setProperty('--nav-indicator-y', toRem(localY));
                    });
                    return;
                }

                indicator.style.setProperty('--nav-indicator-y', toRem(localY));
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

            const updateIndicator = () => {
                if (mobileQuery.matches) {
                    indicator.classList.remove('is-ready');
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
            if (typeof mobileQuery.addEventListener === 'function') {
                mobileQuery.addEventListener('change', requestIndicatorUpdate);
            } else if (typeof mobileQuery.addListener === 'function') {
                mobileQuery.addListener(requestIndicatorUpdate);
            }
            window.addEventListener('resize', requestIndicatorUpdate);
        };

        const initializeCompanyLogoCarousel = () => {
            const carousel = document.querySelector('.logo-carousel');

            if (!carousel) return;

            const track = carousel.querySelector('.logo-carousel-track');
            const items = Array.from(carousel.querySelectorAll('.testimony-item'));
            const toggle = carousel.querySelector('[data-logo-carousel-toggle]');
            const toggleLabel = carousel.querySelector('[data-logo-carousel-toggle-label]');
            const toggleTooltip = carousel.querySelector('[data-logo-carousel-toggle-tooltip]');

            if (!track || items.length < 2 || !toggle || !toggleLabel || !toggleTooltip) return;

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
            let isUserPaused = false;

            const setPaused = (isPaused) => {
                carousel.classList.toggle('is-paused', isPaused);
                toggleLabel.textContent = isPaused ? 'Resume logo movement' : 'Pause logo movement';
                toggleTooltip.textContent = isPaused ? 'Resume motion' : 'Pause motion';
            };

            const syncMotionPreference = () => {
                const shouldReduceMotion = reducedMotionQuery.matches;

                toggle.hidden = shouldReduceMotion;
                setPaused(shouldReduceMotion || isUserPaused);
            };

            toggle.addEventListener('click', () => {
                isUserPaused = !isUserPaused;
                setPaused(isUserPaused);
            });

            syncMotionPreference();

            if (typeof reducedMotionQuery.addEventListener === 'function') {
                reducedMotionQuery.addEventListener('change', syncMotionPreference);
            } else if (typeof reducedMotionQuery.addListener === 'function') {
                reducedMotionQuery.addListener(syncMotionPreference);
            }
        };

        const initializeRecommendationCarousel = () => {
            const carousel = document.querySelector('.recommendation-list');
            const nextButton = document.querySelector('[data-recommendation-next]');

            if (!carousel || !nextButton) return;

            const items = Array.from(carousel.querySelectorAll('.recommendation-item'));
            const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            let currentIndex = 0;

            if (items.length < 2) return;

            const activateItem = (index, shouldAnimate = false) => {
                items.forEach((item, itemIndex) => {
                    const isActive = itemIndex === index;
                    item.classList.toggle('is-active', isActive);
                    item.hidden = !isActive;
                });

                currentIndex = index;

                const activeItem = items[currentIndex];

                if (shouldAnimate && !reducedMotionQuery.matches && typeof activeItem?.animate === 'function') {
                    activeItem.animate(
                        [
                            { opacity: 0 },
                            { opacity: 1 }
                        ],
                        {
                            duration: 350,
                            easing: 'ease-out'
                        }
                    );
                }
            };

            const showNextItem = () => {
                activateItem((currentIndex + 1) % items.length, true);
            };

            carousel.classList.add('is-controlled');
            activateItem(currentIndex);
            nextButton.hidden = false;

            nextButton.addEventListener('click', showNextItem);
        };

        initializeLogoAnimation();
        initializeContactForm();
        initializeConsentBanner();
        initializeScrollHeader();
        initializeWorkProjectIndex();
        initializeMobileNavigation();
        initializeProjectGalleries();
        initializeScrollReveals();
        initializeNavIndicator();
        initializeCompanyLogoCarousel();
        initializeRecommendationCarousel();

        if (window.location.pathname.endsWith('/perspectives/')) {
            const { renderPost } = await import('./perspectives/renderPost.mjs');
            const feedUrl = 'https://medium.com/feed/@jmwii1981';
            await renderPost(feedUrl);
        }
    } catch (error) {
        console.error('Error initializing scripts:', error);
    }
})();
