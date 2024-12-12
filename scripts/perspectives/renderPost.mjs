
/**
 * Renders the structured post content into the DOM.
 * Dynamically replaces skeleton elements in the #most-recent-post div with generated content.
 * Removes all <br> elements and ensures the #most-recent-post div is visible.
 * @param {string} feedUrl - The feed URL for fetching and rendering the post.
 */
import { sequenceContent } from './sequenceContent.mjs';

export async function renderPost(feedUrl) {
    try {
        const postData = await sequenceContent(feedUrl);

        const mostRecentPostDiv = document.getElementById('most-recent-post');

        if (!mostRecentPostDiv) {
            console.error('Error: #most-recent-post div not found.');
            return;
        }

        // Remove style="display: none;" from #most-recent-post
        if (mostRecentPostDiv.hasAttribute('style')) {
            mostRecentPostDiv.removeAttribute('style');
        }

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
                            <img class="post-author-image" src="/images/headshots/janmichael-bio-pic.webp" alt="Jan Michael Wallace II, Article author">
                        </figure>
                        <p class="p post-author-info">
                            <a href="https://medium.com/@jmwii1981" target="_blank" rel="noopener noreferrer" class="a">Jan Michael Wallace II</a>
                        </p>
                    </div>
                    <div class="meta-post">
                        <p class="p">
                            <span class="span pub-date">${postData.date || 'Unknown Date'}</span>
                            <span class="decorative-bullet">•</span>
                            <span class="span reading-time">Placeholder</span>
                        </p>
                    </div>
                </div>
            `;
            metaContainer.outerHTML = metaHTML;
        }

        // Replace skeleton-text elements with paragraphs
        const skeletonTexts = mostRecentPostDiv.querySelectorAll('.skeleton-text');
        const contentParagraphs = postData.content
            ? postData.content.split('</p>').map(p => p.trim() + '</p>').filter(p => p !== '</p>')
            : ['<p class="p">No Content</p>'];
        
        skeletonTexts.forEach((skeleton, idx) => {
            skeleton.outerHTML = contentParagraphs[idx] || '';
        });

        console.log('Content rendered successfully into #most-recent-post, with <br> elements removed and div made visible.');
    } catch (error) {
        console.error('Error in renderPost:', error);
    }
}
