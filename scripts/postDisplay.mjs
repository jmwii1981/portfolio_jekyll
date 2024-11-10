import { loadSvgIcon } from './loadSvgIcon.mjs';
import { DateFormatter } from './dateFormatter.mjs';

export class PostDisplay {
    constructor(elementId) {
        this.container = document.getElementById(elementId);
        this.loader = document.getElementById('loader'); // Keep for possible delay message
        this.authorName = 'Jan Michael Wallace II';
        this.mediumProfile = 'https://medium.com/@jmwii1981';
        this.containerLoaded = false; // Flag to indicate if content is loaded
        this.failureThreshold = 2000; // 2 seconds threshold for delay message
        this.delayMessageTimeout = null; // Timeout for displaying delay message
    }

    displayPost(post) {
        if (!this.container || !post) return;

        this.containerLoaded = true;
        clearTimeout(this.delayMessageTimeout); // Clear delay message if content loads
        const { title, link, pubDate, fullContent, firstImageHTML, readingTime } = post;
        const publishTimeAgo = DateFormatter.toLocaleDate(pubDate);

        // Skeleton replacement logic
        this.replaceSkeletonContent(firstImageHTML, title, link, publishTimeAgo, readingTime, fullContent);
    }

    replaceSkeletonContent(imageHTML, title, link, date, readingTime, content) {
        // Replace skeleton image if image is available
        const imageSkeleton = this.container.querySelector('.skeleton-image');
        if (imageSkeleton) {
            if (imageHTML) {
                imageSkeleton.outerHTML = imageHTML;
            } else {
                imageSkeleton.style.display = 'none'; // Hide if no image available
            }
        }

        // Replace skeleton title with actual title
        const titleSkeleton = this.container.querySelector('.skeleton-title');
        if (titleSkeleton) {
            titleSkeleton.outerHTML = `<h2 class="h1">${title} <a href="${link}" target="_blank" rel="noopener noreferrer" class="a">Link</a></h2>`;
        }

        // Replace skeleton meta content
        const metaSkeletons = this.container.querySelectorAll('.skeleton-meta, .skeleton-meta-content-separator');
        metaSkeletons.forEach((skeleton, index) => {
            if (index === 0) {
                skeleton.outerHTML = `
                <hr class="hr meta-content-separator" aria-hidden="true">
                    <div class="meta" role="contentinfo" aria-label="Article metadata">
                        <div class="meta-author">
                            <figure class="author-figure" aria-label="Author's profile picture">
                                <img src="/images/janmichael-bio-pic.jpg" alt="Jan Michael Wallace II, Article author" class="author-image">
                            </figure>
                            <p class="p author-info"><a href="${this.mediumProfile}" target="_blank" rel="noopener noreferrer" class="a">Jan Michael Wallace II</a></p>
                        </div>
                        <div class="meta-post">
                            <p class="p"><span class="span pub-date">${date}</span> <span class="decorative">•</span> <span class="span reading-time">${readingTime} minute read</span></p>
                        </div>
                    </div>
                <hr class="hr meta-content-separator" aria-hidden="true">`;
            } else {
                skeleton.remove();
            }
        });

        // Replace remaining skeleton text placeholders with post content
        const textSkeletons = this.container.querySelectorAll('.skeleton-text');
        textSkeletons.forEach((skeleton, index) => {
            if (index === 0) {
                skeleton.outerHTML = `<div class="post-content">${content}</div>`;
            } else {
                skeleton.remove();
            }
        });
    }

    displayDelayMessage() {
        if (!this.containerLoaded && this.loader) {
            this.loader.innerHTML = `
                <p class="loading-issue-fallback">
                    Failed to load content. Please try again later or visit 
                    <a href="${this.mediumProfile}" target="_blank" rel="noopener noreferrer" class="a">Jan Michael's Medium.com feed</a>.
                </p>
            `;
        }
    }

    startDelayMessage() {
        this.delayMessageTimeout = setTimeout(() => {
            this.displayDelayMessage();
        }, this.failureThreshold);
    }
}
