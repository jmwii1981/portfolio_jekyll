
/**
 * Renders the structured post content into the DOM.
 * Shows a reserved loading structure, then replaces it with the fetched article.
 * If loading fails, the server-authored Medium fallback remains available.
 * @param {string} feedUrl - The feed URL for fetching and rendering the post.
 */
import { sequenceContent } from './sequenceContent.mjs';

function renderRecentArticles(articles) {
    const list = document.querySelector('[data-medium-article-list]');
    if (!list) return;

    const recentArticles = articles.slice(1, 11).filter(article => {
        try {
            return article.title && ['http:', 'https:'].includes(new URL(article.link).protocol);
        } catch {
            return false;
        }
    });

    list.replaceChildren();
    recentArticles.forEach(article => {
        const item = document.createElement('li');
        item.className = 'medium-article-list-item';

        const heading = document.createElement('h3');
        heading.className = 'h3 medium-article-list-title';

        const link = document.createElement('a');
        link.className = 'a medium-article-link';
        link.href = article.link;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        const label = document.createElement('span');
        label.textContent = article.title;
        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.classList.add('medium-external-icon');
        icon.setAttribute('aria-hidden', 'true');
        icon.setAttribute('viewBox', '0 0 20 20');
        icon.setAttribute('fill', 'none');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M5 15 15 5M8 5h7v7');
        icon.append(path);
        link.append(label, icon);
        heading.append(link);
        item.append(heading);

        const publishedAt = new Date(article.pubDate);
        if (!Number.isNaN(publishedAt.getTime())) {
            const time = document.createElement('time');
            time.className = 'p medium-article-date';
            time.dateTime = publishedAt.toISOString();
            time.textContent = publishedAt.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
            item.append(time);
        }

        list.append(item);
    });

    list.hidden = recentArticles.length === 0;
}

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

        renderRecentArticles(postData.recentArticles);

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
                    el.outerHTML = postData.title || '<h2 class="h2 page-hero-title post-title">No Title</h2>';
                } else {
                    el.remove();
                }
            });
        }

        // Replace skeleton-meta-container
        const metaContainer = mostRecentPostDiv.querySelector('.skeleton-meta-container');
        if (metaContainer) {
            const metaHTML = `
                <div class="post-meta" role="contentinfo" aria-label="Article metadata">
                    <div class="post-meta-author">
                        <picture class="post-author-picture">
                            <source type="image/avif" srcset="/images/headshots/bio-pic-96.avif">
                            <source type="image/webp" srcset="/images/headshots/bio-pic-96.webp">
                            <img class="post-author-image" src="/images/headshots/bio-pic-96.png" width="32" height="32" alt="" decoding="async">
                        </picture>
                        <p class="p post-author-info">
                            <a href="https://medium.com/@jmwii1981" target="_blank" rel="noopener noreferrer" class="a">Jan Michael Wallace II</a>
                        </p>
                    </div>
                    <div class="meta-post">
                        <p class="p">
                            <span class="span pub-date">${postData.date || 'Unknown Date'}</span>
                            <span class="decorative-bullet" aria-hidden="true">•</span>
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
