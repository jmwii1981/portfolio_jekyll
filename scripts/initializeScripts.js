/**
 * Initialize all scripts within this project.
 * This script manages the setup and execution of other module scripts.
 */

(async () => {
    document.documentElement.classList.replace('no-js', 'js');

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

            // Disable native bubbles only after the complete enhanced submission path is ready.
            // If initialization fails earlier, authored validation and direct POST remain intact.
            form.noValidate = true;
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
            const searchControl = navContainer?.querySelector('.site-search');
            const backgroundRegions = Array.from(document.querySelectorAll('.skip-link, .site-identity, main, footer, [data-consent-banner]'));

            if (!navContainer || !toggle || !nav || !('inert' in HTMLElement.prototype)) return;

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
                if (searchControl) searchControl.inert = isOpen;

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
                    return;
                }

                if (event.key !== 'Tab' || !navContainer.classList.contains('is-open')) return;

                const focusableItems = [toggle, ...nav.querySelectorAll('.tab')];
                const firstItem = focusableItems[0];
                const lastItem = focusableItems[focusableItems.length - 1];

                if (event.shiftKey && document.activeElement === firstItem) {
                    event.preventDefault();
                    lastItem.focus();
                } else if (!event.shiftKey && document.activeElement === lastItem) {
                    event.preventDefault();
                    firstItem.focus();
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
            document.documentElement.classList.add('navigation-ready');
        };

        const initializeProjectGalleries = () => {
            const galleries = document.querySelectorAll('[data-project-gallery]');

            galleries.forEach((gallery) => {
                try {
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

                    const updateCopy = (index) => {
                        if (!copyItems.length || visibleCopyIndex === index) return;

                        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                        const incoming = copyItems[index];

                        copyItems.forEach((item, itemIndex) => {
                            item.classList.remove('is-entering');
                            item.hidden = itemIndex !== index;
                        });
                        visibleCopyIndex = index;

                        if (!reducedMotion && incoming) {
                            void incoming.offsetWidth;
                            incoming.classList.add('is-entering');
                        }
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
                    gallery.classList.add('is-gallery-ready');
                    updateState(currentIndex);
                } catch (error) {
                    console.error('Unable to initialize a project gallery:', error);
                }
            });
        };

        const initializeNavIndicator = () => {
            const navContainer = document.querySelector('.nav-container');
            const nav = navContainer?.querySelector('.nav');
            const indicator = navContainer?.querySelector('.nav-indicator');
            const links = nav ? Array.from(nav.querySelectorAll('.tab')) : [];
            const activeLink = nav?.querySelector('.tab[aria-current="page"], .tab.active');
            const desktopQuery = window.matchMedia('(min-width: 44.3125rem)');

            if (!navContainer || !nav || !indicator || !links.length) return;

            let currentLink = activeLink || null;
            let focusedLink = null;
            let hoveredLink = null;
            let hasPositionedIndicator = false;
            let updateFrame = 0;

            const rootFontSize = () => (
                Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
            );

            const persistentTarget = () => {
                return focusedLink || hoveredLink || activeLink || null;
            };

            const positionIndicator = () => {
                updateFrame = 0;

                if (!desktopQuery.matches || !currentLink?.isConnected) {
                    navContainer.classList.remove('is-indicator-ready');
                    return;
                }

                const containerRect = navContainer.getBoundingClientRect();
                const linkRect = currentLink.getBoundingClientRect();
                const underlineOffset = rootFontSize() * 0.75;
                const x = linkRect.left - containerRect.left;
                const y = linkRect.bottom - containerRect.top + underlineOffset;

                if (![x, y, linkRect.width].every(Number.isFinite) || linkRect.width <= 0) {
                    navContainer.classList.remove('is-indicator-ready');
                    return;
                }

                if (!hasPositionedIndicator) {
                    navContainer.classList.add('is-indicator-initializing');
                }

                indicator.style.setProperty('--nav-indicator-x', `${x}px`);
                indicator.style.setProperty('--nav-indicator-y', `${y}px`);
                indicator.style.setProperty('--nav-indicator-width', `${linkRect.width}px`);
                navContainer.classList.add('is-indicator-ready');

                if (!hasPositionedIndicator) {
                    hasPositionedIndicator = true;
                    window.requestAnimationFrame(() => {
                        navContainer.classList.remove('is-indicator-initializing');
                    });
                }
            };

            const requestIndicatorUpdate = () => {
                if (updateFrame) return;

                updateFrame = window.requestAnimationFrame(positionIndicator);
            };

            const targetLink = (link) => {
                currentLink = link;
                requestIndicatorUpdate();
            };

            links.forEach((link) => {
                link.addEventListener('pointerenter', () => {
                    hoveredLink = link;
                    targetLink(link);
                });
                link.addEventListener('focus', () => {
                    focusedLink = link;
                    targetLink(link);
                });
                link.addEventListener('blur', () => {
                    if (focusedLink === link) focusedLink = null;
                    targetLink(persistentTarget());
                });
            });

            nav.addEventListener('pointerleave', () => {
                hoveredLink = null;
                targetLink(persistentTarget());
            });

            const handleDesktopChange = () => {
                currentLink = persistentTarget();

                if (!desktopQuery.matches) {
                    navContainer.classList.remove('is-indicator-ready');
                }

                requestIndicatorUpdate();
            };

            if (typeof desktopQuery.addEventListener === 'function') {
                desktopQuery.addEventListener('change', handleDesktopChange);
            } else if (typeof desktopQuery.addListener === 'function') {
                desktopQuery.addListener(handleDesktopChange);
            }

            if (typeof window.ResizeObserver === 'function') {
                const resizeObserver = new ResizeObserver(requestIndicatorUpdate);
                resizeObserver.observe(navContainer);
                links.forEach((link) => resizeObserver.observe(link));
            } else {
                window.addEventListener('resize', requestIndicatorUpdate, { passive: true });
            }

            const initializePosition = () => requestIndicatorUpdate();

            if (document.fonts?.ready) {
                document.fonts.ready.then(initializePosition).catch(initializePosition);
            } else {
                window.addEventListener('load', initializePosition, { once: true });
            }
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
                    item.classList.remove('is-entering');
                    item.classList.toggle('is-active', isActive);
                    item.hidden = !isActive;
                });

                currentIndex = index;

                const activeItem = items[currentIndex];

                if (shouldAnimate && !reducedMotionQuery.matches && activeItem) {
                    void activeItem.offsetWidth;
                    activeItem.classList.add('is-entering');
                }
            };

            const showNextItem = () => {
                activateItem((currentIndex + 1) % items.length, true);
            };

            carousel.classList.add('is-controlled');
            activateItem(currentIndex);
            nextButton.addEventListener('click', showNextItem);
            nextButton.hidden = false;
        };

        const safelyInitialize = (name, initializer) => {
            try {
                initializer();
            } catch (error) {
                console.error(`Unable to initialize ${name}:`, error);
            }
        };

        safelyInitialize('contact form enhancement', initializeContactForm);
        safelyInitialize('privacy preferences', initializeConsentBanner);
        safelyInitialize('scrolling header', initializeScrollHeader);
        safelyInitialize('work project index', initializeWorkProjectIndex);
        safelyInitialize('mobile navigation', initializeMobileNavigation);
        safelyInitialize('desktop navigation indicator', initializeNavIndicator);
        safelyInitialize('project galleries', initializeProjectGalleries);
        safelyInitialize('company logo carousel', initializeCompanyLogoCarousel);
        safelyInitialize('recommendation carousel', initializeRecommendationCarousel);

        if (document.querySelector('[data-site-search]')) {
            try {
                const { initializeSiteSearch } = await import('./search/initializeSiteSearch.mjs');
                initializeSiteSearch();
            } catch (error) {
                console.error('Unable to initialize site search:', error);
            }
        }

        if (window.location.pathname.endsWith('/perspectives/') && document.querySelector('[data-medium-runtime-feed]')) {
            try {
                const { renderPost } = await import('./perspectives/renderPost.mjs');
                const feedUrl = 'https://medium.com/feed/@jmwii1981';
                await renderPost(feedUrl);
            } catch (error) {
                console.error('Unable to initialize Perspectives feed:', error);
            }
        }
    } catch (error) {
        console.error('Error initializing scripts:', error);
    }
})();
