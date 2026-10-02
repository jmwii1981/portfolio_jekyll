/**
 * Initialize all scripts within this project.
 * This script manages the setup and execution of other module scripts.
 */

(async () => {
    const entryScriptUrl = document.querySelector('[data-site-entry]')?.src;
    const moduleVersion = entryScriptUrl ? new URL(entryScriptUrl).search : '';

    const fetchJsonWithTimeout = async (...arguments_) => {
        const { fetchJsonWithTimeout: requestJson } = await import(`./network.mjs${moduleVersion}`);
        return requestJson(...arguments_);
    };

    document.documentElement.classList.replace('no-js', 'js');

    try {
        const initializeContactForm = () => {
            const form = document.querySelector('[data-contact-form]');

            if (!form) return;

            const submitButton = form.querySelector('[type="submit"]');
            const buttonFace = submitButton?.querySelector('.button-face');
            const buttonTextNode = Array.from(submitButton?.childNodes || []).find((node) => (
                node.nodeType === Node.TEXT_NODE && node.textContent.trim()
            ));
            const status = form.querySelector('[data-contact-status]');
            const requiredFields = Array.from(form.querySelectorAll('[required]'));

            if (!submitButton || !buttonFace || !buttonTextNode || !status || typeof window.fetch !== 'function') return;

            const defaultButtonLabel = buttonTextNode.textContent.trim();
            let isSubmitting = false;

            const setButtonLabel = (label) => {
                buttonTextNode.textContent = label;
                buttonFace.textContent = label;
                submitButton.setAttribute('aria-label', label);
            };

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
                setButtonLabel('Sending…');
                setStatus('Sending your message…', 'pending');

                try {
                    const { data, response } = await fetchJsonWithTimeout(form.action, {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json'
                        },
                        body: new FormData(form)
                    }, { timeoutMs: 15000 });

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
                        : error?.name === 'RequestTimeoutError'
                            ? 'The request took too long. Please try again or use the direct email link below.'
                            : 'Something went wrong. Please try again or use the direct email link below.';

                    setStatus(message, 'error');
                } finally {
                    isSubmitting = false;
                    form.removeAttribute('aria-busy');
                    submitButton.disabled = false;
                    setButtonLabel(defaultButtonLabel);
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

        const initializeVitaeProjectIndex = () => {
            const projectIndex = document.querySelector('.vitae-project-index');
            const projectList = projectIndex?.querySelector('.vitae-project-index-list');
            const projectSummaries = projectIndex?.closest('.vitae-project-summaries');
            const projectLinks = Array.from(projectIndex?.querySelectorAll('a[href^="#project-"]') || []);
            const projectEntries = projectLinks.map((link) => {
                const projectId = link.getAttribute('href')?.slice(1);
                const project = projectId ? document.getElementById(projectId) : null;
                const heading = project?.querySelector('.project-story-title');
                const item = link.closest('li');

                return project && heading && item ? { heading, item, link, project, projectId } : null;
            }).filter(Boolean);

            if (!projectIndex || !projectList || !projectSummaries || !projectEntries.length) return;

            const desktopDockingQuery = window.matchMedia('(min-width: 44.3125rem)');
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            let activeProjectId = null;
            let isBottomDocked = false;
            let navigationFrameId = null;
            let isTicking = false;
            let navigationToken = 0;
            let navigationEntry = null;

            projectEntries.forEach((entry) => {
                entry.heading.tabIndex = -1;
            });

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

            const setActiveProject = (entry) => {

                const itemRect = entry.item.getBoundingClientRect();
                const listRect = projectList.getBoundingClientRect();
                projectList.style.setProperty('--vitae-project-indicator-x', `${itemRect.left - listRect.left + projectList.scrollLeft}px`);
                projectList.style.setProperty('--vitae-project-indicator-width', `${itemRect.width}px`);
                projectLinks.forEach((link) => {
                    if (link === entry.link) {
                        link.setAttribute('aria-current', 'location');
                    } else {
                        link.removeAttribute('aria-current');
                    }
                });
                projectList.classList.add('has-active-project');
                activeProjectId = entry.projectId;

            };

            const cancelProjectNavigation = () => {
                navigationToken += 1;
                navigationEntry = null;

                if (navigationFrameId !== null) {
                    window.cancelAnimationFrame(navigationFrameId);
                    navigationFrameId = null;
                }
            };

            const scrollToProject = (entry) => {
                cancelProjectNavigation();
                navigationEntry = entry;
                setActiveProject(entry);

                const currentNavigationToken = ++navigationToken;
                const destinationHash = `#${entry.projectId}`;

                if (window.location.hash !== destinationHash) {
                    window.history.pushState(null, '', destinationHash);
                }

                const expectedTop = Number.parseFloat(window.getComputedStyle(entry.project).scrollMarginTop) || 0;
                const maximumScrollTop = document.documentElement.scrollHeight - window.innerHeight;
                const startTop = window.scrollY;
                // The first project's scroll margin can stop above the sticky boundary.
                // Land beyond that boundary so explicit navigation keeps the index pinned.
                const summariesStyle = window.getComputedStyle(projectSummaries);
                const indexStyle = window.getComputedStyle(projectIndex);
                const rootFontSize = Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16;
                const stickyTop = Number.parseFloat(indexStyle.top);
                const pinnedTop = Number.isFinite(stickyTop)
                    ? stickyTop
                    : expectedTop - projectIndex.offsetHeight - 2 * rootFontSize;
                const minimumPinnedScrollTop = desktopDockingQuery.matches
                    ? startTop + projectSummaries.getBoundingClientRect().top
                        + (Number.parseFloat(summariesStyle.paddingTop) || 0) - pinnedTop + 1
                    : 0;
                const destinationTop = Math.min(
                    maximumScrollTop,
                    Math.max(0, minimumPinnedScrollTop, startTop + entry.project.getBoundingClientRect().top - expectedTop)
                );
                const distance = Math.abs(destinationTop - startTop);

                const finishNavigation = () => {
                    if (currentNavigationToken !== navigationToken) return;

                    navigationFrameId = null;
                    window.scrollTo({ top: destinationTop, behavior: 'instant' });
                    entry.heading.focus({ preventScroll: true });
                    navigationEntry = null;
                    requestProjectIndexUpdate();
                };

                if (reducedMotion || distance < 2) {
                    window.scrollTo({ top: destinationTop, behavior: 'instant' });
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

                    window.scrollTo({ top: startTop + (destinationTop - startTop) * easedProgress, behavior: 'instant' });

                    if (progress < 1) {
                        navigationFrameId = window.requestAnimationFrame(animateProjectScroll);
                    } else {
                        finishNavigation();
                    }
                };

                navigationFrameId = window.requestAnimationFrame(animateProjectScroll);
            };

            const updateProjectIndexDocking = () => {
                const summariesStyle = window.getComputedStyle(projectSummaries);
                const summariesRect = projectSummaries.getBoundingClientRect();
                const summariesTop = summariesRect.top;
                const summariesPaddingTop = Number.parseFloat(summariesStyle.paddingTop) || 0;
                const anchorTop = summariesTop + summariesPaddingTop;
                const bottomDockTop = window.innerHeight - projectIndex.offsetHeight;
                const shouldBottomDock = desktopDockingQuery.matches && anchorTop > bottomDockTop + 0.5;

                projectIndex.style.setProperty('--vitae-project-index-fixed-left', `${summariesRect.left}px`);
                projectIndex.style.setProperty('--vitae-project-index-fixed-width', `${summariesRect.width}px`);
                projectIndex.classList.toggle('is-bottom-docked', shouldBottomDock);
                projectSummaries.classList.toggle('has-bottom-docked-index', shouldBottomDock);
                isBottomDocked = shouldBottomDock;
            };

            const updateProjectIndexState = () => {
                updateProjectIndexDocking();

                const stickyTop = Number.parseFloat(window.getComputedStyle(projectIndex).top) || 0;
                const projectIndexRect = projectIndex.getBoundingClientRect();
                const currentTop = projectIndexRect.top;
                const isStuck = !isBottomDocked && Math.abs(currentTop - stickyTop) < 1.5;

                projectIndex.classList.toggle('is-stuck', isStuck);
                // Reveal at the same boundary that starts the rounded/glass morph.
                // Keep layout measurable while excluding hidden navigation from input.
                const isAvailable = desktopDockingQuery.matches && isStuck;
                projectIndex.classList.toggle('is-in-view', isAvailable);
                projectIndex.inert = !isAvailable;
                projectIndex.setAttribute('aria-hidden', String(!isAvailable));

                if (isStuck) {
                    const activationLine = Math.max(projectIndexRect.bottom + 2 * 16, window.innerHeight * 0.38);
                    const activeEntry = navigationEntry || projectEntries.reduce((currentEntry, entry) => (
                        entry.project.getBoundingClientRect().top <= activationLine ? entry : currentEntry
                    ), projectEntries[0]);

                    setActiveProject(activeEntry);
                } else if (!navigationEntry) {
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
                requestProjectIndexUpdate();
                window.requestAnimationFrame(() => {
                    requestProjectIndexUpdate();
                });
            };

            projectList.addEventListener('animationend', (event) => {
                if (event.animationName === 'vitae-project-indicator-sheen') {
                    projectList.classList.remove('is-sheening');
                }
            });

            projectEntries.forEach((entry) => {
                entry.link.addEventListener('click', (event) => {
                    if (projectIndex.inert) {
                        event.preventDefault();
                        return;
                    }
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

            updateProjectIndexState();
            // Settle initial docking and restored scroll position before enabling motion.
            const enableProjectIndexMotion = () => {
                window.requestAnimationFrame(() => {
                    updateProjectIndexState();
                    window.requestAnimationFrame(() => projectIndex.classList.add('is-motion-ready'));
                });
            };
            if (document.readyState === 'complete') {
                enableProjectIndexMotion();
            } else {
                window.addEventListener('load', enableProjectIndexMotion, { once: true });
            }
            window.addEventListener('scroll', requestProjectIndexUpdate, { passive: true });
            window.addEventListener('resize', handleProjectIndexResize);
            // The sticky width transition resizes the list without a window resize.
            if (typeof window.ResizeObserver === 'function') {
                const projectListObserver = new ResizeObserver(() => {
                    const activeEntry = projectEntries.find((entry) => entry.projectId === activeProjectId);
                    if (activeEntry) setActiveProject(activeEntry);
                });
                projectListObserver.observe(projectList);
            }
            projectIndex.addEventListener('transitionrun', (event) => {
                if (event.target === projectIndex && event.propertyName === 'width') {
                    projectList.classList.add('is-resizing');
                }
            });
            const finishProjectIndexResize = (event) => {
                if (event.target === projectIndex && event.propertyName === 'width') {
                    handleProjectIndexResize();
                    projectList.classList.remove('is-resizing');
                }
            };
            projectIndex.addEventListener('transitionend', finishProjectIndexResize);
            projectIndex.addEventListener('transitioncancel', finishProjectIndexResize);
        };

        const initializeMobileNavigation = () => {
            const container = document.querySelector('.nav-container');
            const toggle = container?.querySelector('.nav-toggle');
            const nav = container?.querySelector('.nav');
            if (!toggle || !nav) return;
            // Cancel Safari's pressure-triggered preview/Look Up without
            // interfering with normal clicks, taps, or island pointer dragging.
            container.addEventListener('webkitmouseforcewillbegin', (event) => {
                event.preventDefault();
            }, { capture: true, passive: false });
            const panel = container.querySelector('.nav-panel');
            const mobileDock = window.matchMedia('(max-width: 47.999rem)');
            const syncIslandAvailability = () => {
                const island = container.querySelector('.dock-dots');
                if (island) island.inert = mobileDock.matches && container.classList.contains('is-open');
            };
            mobileDock.addEventListener('change', syncIslandAvailability);
            const fitPanel = () => {
                if (window.matchMedia('(max-width: 47.999rem)').matches) {
                    panel.style.removeProperty('--menu-top');
                    return;
                }
                // A tall section list must not push the menu above the viewport.
                const origin = container.getBoundingClientRect().top;
                const halfHeight = panel.offsetHeight / 2;
                const center = Math.max(16 + halfHeight, Math.min(origin + 25, window.innerHeight - 16 - halfHeight));
                panel.style.setProperty('--menu-top', `${center - origin}px`);
            };
            window.addEventListener('resize', fitPanel);
            if (typeof ResizeObserver === 'function') {
                const panelObserver = new ResizeObserver(fitPanel);
                panelObserver.observe(container);
                panelObserver.observe(panel);
            }
            const setOpen = (open, restoreFocus = false) => {
                if (open) fitPanel();
                container.classList.toggle('is-open', open);
                syncIslandAvailability();
                toggle.setAttribute('aria-expanded', String(open));
                toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
                nav.inert = !open;
                if (restoreFocus) toggle.focus();
            };
            toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
            nav.addEventListener('click', (event) => {
                if (event.target.closest('a')) setOpen(false);
            });
            document.addEventListener('pointerdown', (event) => {
                if (!nav.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
            });
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
                    setOpen(false, true);
                }
            });
            container.addEventListener('focusout', (event) => {
                if (!container.contains(event.relatedTarget)) setOpen(false);
            });
            setOpen(false);
            const topButton = container.querySelector('.dock-top');
            const controls = container.querySelector('.nav-controls');
            const topSlot = controls.querySelector('.dock-top-slot');
            const bottomButton = controls.querySelector('.dock-bottom');
            const bottomSlot = controls.querySelector('.dock-bottom-slot');
            const dotGroup = controls.querySelector('.dock-dots');
            const main = document.querySelector('main');
            // Search landmarks describe full content sections (including Vitae
            // project articles), not nested cards, galleries, or form fields.
            // Pages can explicitly opt into a different set of dock landmarks.
            const explicitSections = Array.from(main?.querySelectorAll('[data-dock-section]') || []);
            const searchSections = Array.from(main?.querySelectorAll('[data-search-section]') || []);
            const outerSections = Array.from(main?.querySelectorAll('section') || [])
                .filter(section => !section.parentElement.closest('section'));
            const pageSections = (explicitSections.length ? explicitSections : searchSections.length >= 2 ? searchSections : outerSections)
                .filter(section => !section.closest('[hidden]'));
            // The mobile dot/dock island includes both endpoints; desktop hides
            // those links and retains its existing middle-section navigation.
            const sections = pageSections;
            sections.forEach((section, index) => {
                if (!section.id) {
                    let id = `dock-section-${index + 1}`;
                    while (document.getElementById(id)) id += '-anchor';
                    section.id = id;
                }
                const labelledBy = section.getAttribute('aria-labelledby')?.split(/\s+/)
                    .map(id => document.getElementById(id)?.textContent.trim()).filter(Boolean).join(' ');
                const label = section.dataset.dockLabel || section.getAttribute('aria-label')
                    || section.dataset.searchTitle || labelledBy
                    || section.querySelector('h2, h1, h3')?.textContent.trim() || `Section ${index + 1}`;
                const link = document.createElement('a');
                link.className = 'dock-dot';
                if (index === 0 || index === sections.length - 1) link.classList.add('dock-dot-endpoint');
                link.href = `#${section.id}`;
                link.setAttribute('aria-label', label);
                const tooltip = document.createElement('span');
                tooltip.className = 'dock-dot-label';
                tooltip.setAttribute('aria-hidden', 'true');
                tooltip.textContent = label;
                link.append(tooltip);
                dotGroup.append(link);
            });
            const sectionLinks = Array.from(container.querySelectorAll('.dock-dot'));
            const syncSections = () => {
                if (!pageSections.length) return;
                let index = -1;
                pageSections.forEach((section, i) => {
                    if (section.getBoundingClientRect().top <= window.innerHeight * .35) index = i;
                });
                if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) index = pageSections.length - 1;
                sectionLinks.forEach((link, i) => {
                    const active = sections[i] === pageSections[index];
                    if (active) {
                        link.setAttribute('aria-current', 'location');
                        link.setAttribute('aria-disabled', 'true');
                        link.removeAttribute('href');
                        link.tabIndex = -1;
                    } else {
                        link.removeAttribute('aria-current');
                        link.removeAttribute('aria-disabled');
                        link.setAttribute('href', `#${sections[i].id}`);
                        link.tabIndex = 0;
                    }
                });
            };
            let suppressTouchClickUntil = 0;
            sectionLinks.forEach((link, index) => link.addEventListener('click', event => {
                event.preventDefault();
                if (event.isTrusted && performance.now() < suppressTouchClickUntil) return;
                if (link.getAttribute('aria-current') === 'location') return;
                setOpen(false);
                const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
                sections[index].scrollIntoView({ block: 'start', behavior });
            }));
            // Capture the gesture so lifting selects once, without scrolling
            // the page or navigating through every section under the thumb.
            let islandPointer = null;
            let touchCandidate = null;
            const clearTouchPreview = () => {
                sectionLinks.forEach(link => link.classList.remove('is-touch-target'));
                touchCandidate = null;
            };
            const previewTouch = (event) => {
                clearTouchPreview();
                const bounds = dotGroup.getBoundingClientRect();
                if (event.clientX < bounds.left - 15 || event.clientX > bounds.right + 15
                    || event.clientY < bounds.top - 15 || event.clientY > bounds.bottom + 15) return;
                let distance = Infinity;
                sectionLinks.forEach(link => {
                    const rect = link.getBoundingClientRect();
                    if (!rect.height) return;
                    const delta = Math.abs(event.clientY - (rect.top + rect.height / 2));
                    if (delta < distance) { distance = delta; touchCandidate = link; }
                });
                touchCandidate?.classList.add('is-touch-target');
            };
            const endIslandTouch = (event, select = false) => {
                if (event.pointerId !== islandPointer) return;
                if (select) previewTouch(event);
                const selection = select ? touchCandidate : null;
                islandPointer = null;
                suppressTouchClickUntil = performance.now() + 600;
                clearTouchPreview();
                dotGroup.classList.remove('is-touch-active');
                if (dotGroup.hasPointerCapture(event.pointerId)) dotGroup.releasePointerCapture(event.pointerId);
                selection?.click();
            };
            dotGroup.addEventListener('pointerdown', event => {
                if (!mobileDock.matches || event.pointerType !== 'touch' || !event.isPrimary || islandPointer !== null || dotGroup.inert) return;
                event.preventDefault();
                islandPointer = event.pointerId;
                dotGroup.setPointerCapture(event.pointerId);
                dotGroup.classList.add('is-touch-active');
                previewTouch(event);
            });
            dotGroup.addEventListener('pointermove', event => {
                if (event.pointerId !== islandPointer) return;
                event.preventDefault();
                previewTouch(event);
            });
            dotGroup.addEventListener('pointerup', event => endIslandTouch(event, true));
            dotGroup.addEventListener('pointercancel', event => endIslandTouch(event));
            dotGroup.addEventListener('lostpointercapture', event => endIslandTouch(event));
            let scrollFrame = 0;
            const syncTop = () => {
                scrollFrame = 0;
                syncSections();
                const bottomSection = pageSections.length > 1 ? pageSections[pageSections.length - 1] : document.querySelector('footer');
                const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4
                    || (bottomSection && bottomSection.getBoundingClientRect().top < window.innerHeight - 24);
                controls.classList.toggle('at-bottom', Boolean(atBottom));
                bottomButton.tabIndex = atBottom ? -1 : 0;
                if (atBottom && document.activeElement === bottomButton) toggle.focus({ preventScroll: true });
                bottomSlot.inert = Boolean(atBottom);
                bottomSlot.setAttribute('aria-hidden', String(Boolean(atBottom)));
                if (!topButton) return;
                const visible = window.scrollY > Math.max(320, window.innerHeight * .65);
                const focusedControl = document.activeElement;
                controls.classList.toggle('has-top', visible);
                topButton.tabIndex = visible ? 0 : -1;
                if (!visible && focusedControl === topButton) toggle.focus({ preventScroll: true });
                topSlot.inert = !visible;
                topSlot.setAttribute('aria-hidden', String(!visible));
            };
            window.addEventListener('scroll', () => {
                if (!scrollFrame) scrollFrame = requestAnimationFrame(syncTop);
            }, { passive: true });
            window.addEventListener('resize', syncTop, { passive: true });
            topButton?.addEventListener('click', () => {
                setOpen(false);
                toggle.focus({ preventScroll: true });
                window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
            });
            bottomButton?.addEventListener('click', () => {
                setOpen(false);
                window.scrollTo({ top: document.documentElement.scrollHeight, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
            });
            const syncDotOverflow = () => {
                const horizontal = getComputedStyle(dotGroup).flexDirection === 'row';
                // Floating labels must not make an otherwise fitting dot strip scroll.
                const required = sectionLinks.reduce((size, link) => size + (horizontal ? link.offsetWidth : link.offsetHeight), 0);
                dotGroup.classList.toggle('is-overflowing', required > (horizontal ? dotGroup.clientWidth : dotGroup.clientHeight) + 1);
            };
            if (typeof ResizeObserver === 'function') new ResizeObserver(syncDotOverflow).observe(dotGroup);
            window.addEventListener('resize', syncDotOverflow, { passive: true });
            syncDotOverflow();
            syncTop();
            document.documentElement.classList.add('navigation-ready');
            document.documentElement.classList.remove('navigation-pending');
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


        const initializeRecommendationCarousel = () => {
            const carousel = document.querySelector('.recommendation-list');

            if (!carousel) return;

            const items = Array.from(carousel.querySelectorAll('.recommendation-item'));
            const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            const intervalMs = 10000;
            let currentIndex = 0;
            let timerId = null;

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

            const queueNextItem = () => {
                window.clearTimeout(timerId);
                timerId = null;

                if (document.hidden || reducedMotionQuery.matches) return;

                timerId = window.setTimeout(showNextItem, intervalMs);
            };

            const showNextItem = () => {
                activateItem((currentIndex + 1) % items.length, true);
                queueNextItem();
            };

            const syncAutomaticAdvance = () => {
                if (document.hidden || reducedMotionQuery.matches) {
                    window.clearTimeout(timerId);
                    timerId = null;
                    return;
                }

                queueNextItem();
            };

            carousel.classList.add('is-controlled');
            activateItem(currentIndex);
            queueNextItem();

            document.addEventListener('visibilitychange', syncAutomaticAdvance);

            if (typeof reducedMotionQuery.addEventListener === 'function') {
                reducedMotionQuery.addEventListener('change', syncAutomaticAdvance);
            } else if (typeof reducedMotionQuery.addListener === 'function') {
                reducedMotionQuery.addListener(syncAutomaticAdvance);
            }
        };

        const initializeDecorativeVideos = () => {
            const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
            document.querySelectorAll('[data-decorative-video]').forEach(video => {
                const scrubEnd = parseFloat(video.dataset.scrubEnd);
                const scrubEasing = Math.max(1, parseFloat(video.dataset.scrubEasing) || 240);
                const edgeAligned = video.classList.contains('testimonials-artwork-video');
                const endDrift = Math.max(0, Number(video.dataset.endDrift) || 0);
                const alignArtwork = () => {
                    if (!edgeAligned) return;
                    const shell = video.parentElement.getBoundingClientRect();
                    const section = video.closest('.testimonials').getBoundingClientRect();
                    video.style.setProperty('--artwork-edge-offset', `${Math.max(0, document.documentElement.clientWidth - shell.right)}px`);
                    video.style.setProperty('--artwork-top-offset', `${shell.top - section.top}px`);
                };
                alignArtwork();
                window.addEventListener('resize', alignArtwork);
                if (edgeAligned && typeof ResizeObserver === 'function') {
                    new ResizeObserver(alignArtwork).observe(video.parentElement);
                }
                let frame = 0;
                let loaded = false;
                let lastTick = 0;
                let playhead = 0;
                let drift = 0;
                let driftStartScroll = null;
                let requestedFrame = -1;
                let readRetries = 0;
                let previousScroll = window.scrollY;
                let retract = null;
                video.muted = true;
                video.pause();
                const syncScrub = (now) => {
                    frame = 0;
                    if (document.hidden || reducedMotion.matches || !video.getClientRects().length) return;
                    const rect = video.getBoundingClientRect();
                    if (!rect.width || !rect.height) return;
                    if (!loaded && rect.top < window.innerHeight + 200 && rect.bottom > -200) {
                        loaded = true;
                        video.preload = 'auto';
                        video.load();
                    }
                    // Hold frame zero until the whole artwork fits in view.
                    // On unusually short viewports, start when its top reaches
                    // the viewport top (the most artwork that can be visible).
                    // Keep puzzle timing tied to its original layout slot as the video grows.
                    const timingRect = edgeAligned ? video.parentElement.getBoundingClientRect() : rect;
                    const start = Math.max(0, window.scrollY + timingRect.top + Math.min(timingRect.height, window.innerHeight) - window.innerHeight);
                    // Optional endpoint: artwork center reaches this viewport fraction.
                    const endPosition = Number.isFinite(scrubEnd)
                        ? window.scrollY + timingRect.top + timingRect.height / 2 - window.innerHeight * scrubEnd
                        : document.documentElement.scrollHeight - window.innerHeight;
                    const end = Math.max(start + 1, endPosition);
                    const progress = Math.max(0, Math.min(1, (window.scrollY - start) / (end - start)));
                    if (!Number.isFinite(video.duration) || video.readyState < 2) return;
                    const fps = 60;
                    const finalFrame = Math.max(0, Math.floor(video.duration * fps - .001));
                    const videoEnd = finalFrame / fps;
                    // Leaving the artwork's full-view range upward retracts it in
                    // one short pass, rather than waiting for the slow drift to unwind.
                    if (endDrift && !retract && window.scrollY < previousScroll && window.scrollY <= start && playhead > 0) {
                        retract = {
                            elapsed: 0,
                            time: Math.min(videoEnd, playhead),
                            drift
                        };
                    }
                    previousScroll = window.scrollY;
                    // Pieces enter through the source video's right edge. Keep that
                    // edge flush with the viewport until the final frame is decoded;
                    // only subsequent scrolling may expose it by pushing left.
                    if (endDrift && driftStartScroll === null && !retract &&
                        !video.seeking && video.currentTime >= videoEnd - .5 / fps) {
                        driftStartScroll = Math.max(end, window.scrollY);
                    }
                    const driftProgress = driftStartScroll === null ? 0
                        : Math.max(0, Math.min(1, (window.scrollY - driftStartScroll) / 240));
                    const target = progress * videoEnd;
                    const elapsed = lastTick ? Math.min(50, now - lastTick) : 1000 / 60;
                    lastTick = now;
                    if (retract) {
                        retract.elapsed += elapsed;
                        const fraction = Math.min(1, retract.elapsed / 450);
                        // On a fast upward jump, hide the source edge again before
                        // reversing the entrance through it, all within the same reset.
                        const returnDuration = retract.drift > 0 ? 150 : 0;
                        const videoFraction = Math.max(0, Math.min(1,
                            (retract.elapsed - returnDuration) / (450 - returnDuration)));
                        const remaining = 1 - videoFraction * videoFraction * (3 - 2 * videoFraction);
                        playhead = retract.time * remaining;
                        const returnFraction = returnDuration ? Math.min(1, retract.elapsed / returnDuration) : 1;
                        drift = retract.drift * (1 - returnFraction) ** 2;
                        video.style.transform = `translateX(${-endDrift * drift}px)`;
                        const resetFrame = Math.round(playhead * fps);
                        if (!video.seeking && resetFrame !== requestedFrame) {
                            requestedFrame = resetFrame;
                            video.currentTime = resetFrame / fps;
                        }
                        if (fraction === 1) {
                            retract = null;
                            driftStartScroll = null;
                        }
                        requestScrub();
                        return;
                    }
                    playhead += (target - playhead) * (1 - Math.exp(-elapsed / scrubEasing));
                    if (Math.abs(target - playhead) < .001) playhead = target;
                    const nextFrame = Math.max(0, Math.min(finalFrame, Math.round(playhead * fps)));
                    if (endDrift) {
                        drift = driftProgress * driftProgress;
                        video.style.transform = `translateX(${-endDrift * drift}px)`;
                    }
                    // Seek only once per distinct frame. Keep easing independent of
                    // decoder timing; seeked resumes any queued frame after decoding.
                    if (!video.seeking && nextFrame !== requestedFrame) {
                        requestedFrame = nextFrame;
                        video.currentTime = nextFrame / fps;
                    }
                    if (playhead !== target) requestScrub();
                    else lastTick = 0;
                };
                const requestScrub = () => {
                    if (!frame) frame = requestAnimationFrame(syncScrub);
                };
                const observer = new IntersectionObserver(entries => {
                    if (entries[0].isIntersecting && !loaded && !reducedMotion.matches) {
                        loaded = true;
                        video.preload = 'auto';
                        video.load();
                    }
                    requestScrub();
                }, { rootMargin: '200px 0px' });
                observer.observe(video);
                video.addEventListener('loadedmetadata', requestScrub);
                // Expose the decoded surface before seeking; Chromium can defer
                // frame delivery indefinitely for a fully transparent paused video.
                video.addEventListener('loadedmetadata', () => video.classList.add('is-video-ready'));
                video.addEventListener('loadeddata', requestScrub);
                video.addEventListener('loadeddata', () => video.classList.add('is-video-ready'));
                video.addEventListener('error', () => {
                    video.classList.remove('is-video-ready');
                    // A failed byte-range read can poison the browser's cached media
                    // response during preview rebuilds. Retry once with a fresh URL.
                    if (video.error?.code === 2 && readRetries++ === 0) {
                        const source = new URL(video.currentSrc, location.href);
                        source.searchParams.set('read-retry', Date.now().toString());
                        window.setTimeout(() => {
                            requestedFrame = -1;
                            video.src = source.href;
                            video.load();
                        }, 500);
                    }
                });
                video.addEventListener('canplay', requestScrub);
                video.addEventListener('seeked', requestScrub);
                window.addEventListener('scroll', requestScrub, { passive: true });
                window.addEventListener('resize', requestScrub, { passive: true });
                reducedMotion.addEventListener('change', requestScrub);
                document.addEventListener('visibilitychange', requestScrub);
                requestScrub();
            });
        };

        const initializeVisibleLoops = () => {
            const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
            document.querySelectorAll('[data-visible-loop]').forEach(video => {
                let inView = false;
                let loaded = false;
                const slowdown = Number(video.dataset.loopSlowdown) || 1;
                const playbackRate = 1 / Math.max(1, slowdown);
                video.defaultPlaybackRate = playbackRate;
                const shouldPlay = () => inView && !document.hidden && !reducedMotion.matches && video.getClientRects().length > 0;
                const sync = () => {
                    if (!shouldPlay()) {
                        video.pause();
                        return;
                    }
                    if (!loaded) {
                        loaded = true;
                        video.muted = true;
                        video.preload = 'auto';
                        video.load();
                    }
                    video.playbackRate = playbackRate;
                    const playing = video.play();
                    if (playing) playing.then(() => {
                        if (!shouldPlay()) video.pause();
                    }).catch(() => {});
                };
                // Observe the actual visible area, with no preplay margin.
                const observer = new IntersectionObserver(entries => {
                    inView = entries[0].isIntersecting && entries[0].intersectionRatio > 0;
                    sync();
                }, { threshold: 0 });
                observer.observe(video);
                video.addEventListener('loadeddata', () => {
                    video.classList.add('is-video-ready');
                    sync();
                });
                video.addEventListener('error', () => video.classList.remove('is-video-ready'));
                document.addEventListener('visibilitychange', sync);
                reducedMotion.addEventListener('change', sync);
                window.addEventListener('resize', sync, { passive: true });
            });
        };

        const initializeDockReflections = () => {
            // Share the scroll-driven light angle with both dock and page buttons.
            const reflectionSurface = document.querySelector('.body--vitae');
            if (!reflectionSurface) return;
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            let frame = 0;
            const paint = () => {
                frame = 0;
                if (reducedMotion.matches) {
                    reflectionSurface.style.removeProperty('--dock-reflection-angle');
                    return;
                }
                reflectionSurface.style.setProperty('--dock-reflection-angle', `${105 + window.scrollY * 0.12}deg`);
            };
            const schedule = () => {
                if (!frame && !reducedMotion.matches && !document.hidden) frame = requestAnimationFrame(paint);
            };
            window.addEventListener('scroll', schedule, { passive: true });
            reducedMotion.addEventListener('change', () => {
                cancelAnimationFrame(frame);
                frame = 0;
                paint();
            });
            window.addEventListener('pageshow', schedule);
            document.addEventListener('visibilitychange', schedule);
            paint();
        };

        const initializeGlassButtonReflections = () => {
            const controls = document.querySelectorAll('.main.vitae .button-container, .body--vitae .dock-control');
            const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            controls.forEach(control => {
                const reset = () => {
                    control.style.removeProperty('--glass-reflection-x');
                    control.style.removeProperty('--glass-reflection-y');
                };
                control.addEventListener('pointermove', event => {
                    if (!finePointer.matches || reducedMotion.matches || event.pointerType === 'touch'
                        || control.matches(':disabled, [aria-disabled="true"]') || control.closest('[inert]')) {
                        reset();
                        return;
                    }
                    // Measure the stationary hit target, never the moving reflection.
                    const rect = control.getBoundingClientRect();
                    if (!rect.width || !rect.height) return;
                    const x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
                    const y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
                    control.style.setProperty('--glass-reflection-x', `${(-x * 8).toFixed(2)}px`);
                    control.style.setProperty('--glass-reflection-y', `${(-y * 4).toFixed(2)}px`);
                }, { passive: true });
                control.addEventListener('pointerleave', reset);
                control.addEventListener('pointercancel', reset);
                reducedMotion.addEventListener('change', reset);
                finePointer.addEventListener('change', reset);
            });
        };

        const initializeVitaeEntrances = () => {
            // Animate individual visual items, never their shared layout wrappers.
            const targets = [...document.querySelectorAll([
                '.vitae-project-summary .project-story-title',
                '.vitae-project-summary .vitae-project-tag',
                '.vitae-project-summary .project-story-intro',
                '.vitae-project-summary .project-story-actions > a',
                '.vitae-project-summary-visual',
                '.vitae-contact #vitae-contact-title',
                '.vitae-contact-invitation',
                '.vitae-contact-actions > a'
            ].join(', '))];
            if (!targets.length) return;
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            let measurements = [];
            const rocket = document.querySelector('.vitae-contact-artwork img');
            let rocketRange = null;
            let frame = 0;
            const interactiveTargets = new Set(targets.filter(element =>
                element.matches('a, button, input, select, textarea, [tabindex]') ||
                element.querySelector('a, button, input, select, textarea, [tabindex]')
            ));
            const originalInert = new Map(targets.map(element => [element, element.inert]));
            const setInteractive = (element, enabled) => {
                element.style.pointerEvents = enabled ? '' : 'none';
                if (interactiveTargets.has(element)) {
                    // Inert also blocks keyboard focus and descendant links,
                    // unlike pointer-events alone.
                    element.inert = originalInert.get(element) || !enabled;
                }
            };
            targets.forEach(element => element.classList.add('vitae-scroll-item'));
            const check = () => {
                frame = 0;
                const scroll = Math.max(0, window.scrollY);
                if (rocket && rocketRange) {
                    const progress = Math.max(0, Math.min(1,
                        (scroll - rocketRange.start) / rocketRange.distance));
                    rocket.style.transform = reducedMotion.matches ? 'none' : `scale(${1 + .2 * progress})`;
                }
                measurements.forEach(({ element, start, distance, x, y }) => {
                    if (reducedMotion.matches) {
                        element.style.removeProperty('translate');
                        element.style.removeProperty('opacity');
                        setInteractive(element, true);
                        return;
                    }
                    // One fixed entrance range in document space. After its
                    // end, progress stays at 1 even when the item leaves above
                    // the viewport. Only crossing that range upward reverses it.
                    const progress = Math.max(0, Math.min(1, (scroll - start) / distance));
                    const eased = progress * progress * (3 - 2 * progress);
                    const remaining = 1 - eased;
                    element.style.translate = `${x * remaining}px ${y * remaining}px`;
                    element.style.opacity = String(eased);
                    setInteractive(element, eased >= .9);
                });
            };
            const measure = () => {
                // Measure the unanimated layout in one read phase. No animated
                // rectangle or offset-parent change can affect the next frame.
                targets.forEach(element => element.style.removeProperty('translate'));
                const scroll = window.scrollY;
                const viewport = window.innerHeight;
                const compact = window.innerWidth < 768;
                if (rocket) {
                    // Measure the stationary picture/section, not the scaling image.
                    const picture = rocket.parentElement.getBoundingClientRect();
                    const section = rocket.closest('section').getBoundingClientRect();
                    const start = picture.top + scroll - viewport;
                    const end = section.bottom + scroll - viewport;
                    rocketRange = { start, distance: Math.max(1, end - start) };
                }
                // All items in a section must settle before its first action
                // crosses the bottom edge, including staggered secondary links.
                const actionDeadlines = new Map();
                targets.filter(element => element.matches('.button-group > a')).forEach(element => {
                    const section = element.closest('article, section');
                    const deadline = element.getBoundingClientRect().top + scroll - viewport - 8;
                    actionDeadlines.set(section, Math.min(actionDeadlines.get(section) ?? Infinity, deadline));
                });
                measurements = targets.map(element => {
                    const documentTop = element.getBoundingClientRect().top + scroll;
                    const isBadge = element.matches('.vitae-project-tag');
                    const isAction = element.matches('.button-group > a');
                    const isImage = element.matches('figure, picture');
                    const sectionElement = element.closest('article, section');
                    const section = sectionElement.id;
                    let x = 0;
                    let y = isImage ? 48 : 30;
                    if (!compact) {
                        if (section === 'project-vega') { x = isImage ? -48 : 32; y = 0; }
                        if (section === 'project-avenapay' && !isImage) { x = 32; y = 0; }
                        if (section === 'project-ledgerflow') { x = isImage ? 48 : -32; y = 0; }
                        if (section === 'get-in-touch' && isImage) { x = 48; y = 0; }
                    }
                    const strength = isBadge ? .5 : isAction ? .7 : 1;
                    const actionIndex = isAction ? [...element.parentElement.children].indexOf(element) : 0;
                    const delay = actionIndex * 18;
                    const distance = viewport * (isImage ? .4 : .32);
                    const naturalStart = documentTop - viewport * .9 + delay;
                    const end = Math.min(naturalStart + distance, actionDeadlines.get(sectionElement) ?? Infinity);
                    return { element, x: x * strength, y: y * strength,
                        start: end - distance, distance };
                });
                check();
            };
            const schedule = () => { if (!frame) frame = requestAnimationFrame(check); };
            window.addEventListener('scroll', schedule, { passive: true });
            window.addEventListener('resize', measure, { passive: true });
            window.addEventListener('load', measure, { once: true });
            window.addEventListener('pageshow', measure);
            document.addEventListener('focusin', schedule);
            document.addEventListener('focusout', schedule);
            document.fonts?.ready.then(measure);
            reducedMotion.addEventListener('change', measure);
            if (typeof ResizeObserver === 'function') {
                const observer = new ResizeObserver(measure);
                observer.observe(document.querySelector('main.vitae'));
            }
            measure();
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
        safelyInitialize('vitae project index', initializeVitaeProjectIndex);
        safelyInitialize('vitae section entrances', initializeVitaeEntrances);
        safelyInitialize('mobile navigation', initializeMobileNavigation);
        const { initializeLiquidGlassNavigation } = await import(`./glass/initializeLiquidGlassNavigation.mjs${moduleVersion}`);
        safelyInitialize('dock glass', initializeLiquidGlassNavigation);
        safelyInitialize('dock reflections', initializeDockReflections);
        safelyInitialize('glass button reflections', initializeGlassButtonReflections);
        safelyInitialize('project galleries', initializeProjectGalleries);
        safelyInitialize('recommendation carousel', initializeRecommendationCarousel);
        safelyInitialize('decorative videos', initializeDecorativeVideos);
        safelyInitialize('visible artwork loops', initializeVisibleLoops);

        if (window.location.pathname.endsWith('/perspectives/') && document.querySelector('[data-medium-runtime-feed]')) {
            try {
                const { renderPost } = await import(`./perspectives/renderPost.mjs${moduleVersion}`);
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
