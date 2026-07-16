
/**
 * Renders the structured post content into the DOM.
 * Shows a reserved loading structure, then replaces it with the fetched article.
 * If loading fails, the server-authored Medium fallback remains available.
 * @param {string} feedUrl - The feed URL for fetching and rendering the post.
 */
import { sequenceContent } from './sequenceContent.mjs';

export async function renderPost(feedUrl) {
    const mostRecentPostDiv = document.getElementById('most-recent-post');
    const fallback = document.querySelector('[data-feed-fallback]');
    const feedContainer = mostRecentPostDiv?.closest('.post-content-wrapper');
    let fallbackFocusOutHandler;

    if (!mostRecentPostDiv) {
        console.error('The Perspectives article container could not be found.');
        return;
    }

    const hideFallbackWithoutMovingFocus = () => {
        if (!fallback) return;

        if (fallback.contains(document.activeElement)) {
            feedContainer?.classList.add('has-active-fallback');
            fallbackFocusOutHandler = event => {
                if (fallback.contains(event.relatedTarget)) return;

                fallback.hidden = true;
                feedContainer?.classList.remove('has-active-fallback');
                fallback.removeEventListener('focusout', fallbackFocusOutHandler);
                fallbackFocusOutHandler = undefined;
            };
            fallback.addEventListener('focusout', fallbackFocusOutHandler);
            return;
        }

        fallback.hidden = true;
    };

    const restoreFallback = () => {
        if (!fallback) return;

        if (fallbackFocusOutHandler) {
            fallback.removeEventListener('focusout', fallbackFocusOutHandler);
            fallbackFocusOutHandler = undefined;
        }

        feedContainer?.classList.remove('has-active-fallback');
        fallback.hidden = false;
    };

    // Reserve approximately the same page structure while the remote feed loads.
    feedContainer?.classList.remove('is-feed-error', 'is-feed-ready');
    feedContainer?.classList.add('is-feed-loading');
    mostRecentPostDiv.hidden = false;
    mostRecentPostDiv.setAttribute('aria-busy', 'true');
    mostRecentPostDiv.setAttribute('aria-hidden', 'true');
    hideFallbackWithoutMovingFocus();

    try {
        const postData = await sequenceContent(feedUrl);

        if (!postData) throw new Error('The Perspectives feed returned no article.');

        // Remove all <br> elements from the content
        const allBrElements = mostRecentPostDiv.querySelectorAll('br');
        allBrElements.forEach(br => br.remove());

        // Replace skeleton-image
        const skeletonImage = mostRecentPostDiv.querySelector('.skeleton-image');
        if (skeletonImage) {
            const figureHTML = `
                <figure class="post-featured-image-figure" aria-label="Post featured image">
                    ${postData.image || ''}
                </figure>
            `;
            skeletonImage.outerHTML = figureHTML;

            const featuredImage = mostRecentPostDiv.querySelector('.post-featured-img');
            if (featuredImage) {
                featuredImage.width = 1200;
                featuredImage.height = 675;
            }
        }

        // Replace skeleton-title (both instances with one h2)
        const skeletonTitles = mostRecentPostDiv.querySelectorAll('.skeleton-title');
        if (skeletonTitles.length > 0) {
            skeletonTitles.forEach((el, idx) => {
                if (idx === 0) {
                    el.outerHTML = postData.title || '<h2 class="h2 post-title">No Title</h2>';
                } else {
                    el.remove();
                }
            });
        }

        // Replace skeleton-meta-content-separator elements
        const separators = mostRecentPostDiv.querySelectorAll('.skeleton-meta-content-separator');
        separators.forEach(separator => {
            separator.outerHTML = '<hr class="hr post-meta-content-separator" aria-hidden="true">';
        });

        // Replace skeleton-meta-container
        const metaContainer = mostRecentPostDiv.querySelector('.skeleton-meta-container');
        if (metaContainer) {
            const metaHTML = `
                <div class="post-meta" role="contentinfo" aria-label="Article metadata">
                    <div class="post-meta-author">
                        <figure class="post-author-figure" aria-label="Author's profile picture">
                            <picture class="post-author-picture">
                                <source type="image/avif" srcset="/images/headshots/bio-pic-96.avif">
                                <source type="image/webp" srcset="/images/headshots/bio-pic-96.webp">
                                <img class="post-author-image" src="/images/headshots/bio-pic-96.png" width="32" height="32" alt="Jan Michael Wallace II, article author" decoding="async">
                            </picture>
                        </figure>
                        <p class="p post-author-info">
                            <a href="https://medium.com/@jmwii1981" target="_blank" rel="noopener noreferrer" class="a">Jan Michael Wallace II</a>
                        </p>
                    </div>
                    <div class="meta-post">
                        <p class="p">
                            <span class="span pub-date">${postData.date || 'Unknown Date'}</span>
                            <span class="decorative-bullet">•</span>
                            <span class="span reading-time">${postData.readingTime || 1} min read</span>
                        </p>
                    </div>
                </div>
            `;
            metaContainer.outerHTML = metaHTML;
        }

        // Replace the fixed skeleton lines with the complete sanitized article body.
        const skeletonTexts = mostRecentPostDiv.querySelectorAll('.skeleton-text');
        const articleBody = document.createElement('div');
        articleBody.className = 'post-body';
        articleBody.innerHTML = postData.content || '<p class="p">Article content is unavailable. Visit Medium to continue reading.</p>';

        skeletonTexts.forEach((skeleton, idx) => {
            if (idx === 0) skeleton.replaceWith(articleBody);
            else skeleton.remove();
        });

        mostRecentPostDiv.setAttribute('aria-busy', 'false');
        mostRecentPostDiv.removeAttribute('aria-hidden');
        feedContainer?.classList.remove('is-feed-loading');
        feedContainer?.classList.add('is-feed-ready');
    } catch (error) {
        console.error('Error in renderPost:', error);
        feedContainer?.classList.remove('is-feed-loading', 'is-feed-ready');
        feedContainer?.classList.add('is-feed-error');
        mostRecentPostDiv.hidden = true;
        mostRecentPostDiv.setAttribute('aria-busy', 'false');
        mostRecentPostDiv.setAttribute('aria-hidden', 'true');
        restoreFallback();
    }
}
