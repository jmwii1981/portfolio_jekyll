import { loadSvgIcon } from './loadSvgIcon.mjs';
import { DateFormatter } from './dateFormatter.mjs';
import { ReadingTimeEstimator } from './readingTimeEstimator.mjs';  // Import the new module

export class PostDisplay {
    constructor(elementId) {
        this.container = document.getElementById(elementId);
        this.loader = document.getElementById('loader');
        this.authorName = 'Jan Michael Wallace II';
        this.mediumProfile = 'https://medium.com/@jmwii1981';
        this.containerLoaded = false;
        this.failureThreshold = 2000; // 2 seconds threshold for delay message
        this.delayMessageTimeout = null; // Timeout for displaying delay message
    }

    displayPost(post) {
        if (!this.container || !post) return;

        this.containerLoaded = true;
        clearTimeout(this.delayMessageTimeout); // Clear delay message if content loads
        const { title, link, pubDate, fullContent, firstImageHTML } = post;
        const publishTimeAgo = DateFormatter.formatElapsedTime(pubDate);
        const readingTime = ReadingTimeEstimator.estimateReadingTime(fullContent); // Use the new class

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

        // Replace skeleton title with actual title and add icon instead of "Link"
        const titleSkeleton = this.container.querySelector('.skeleton-title');
        if (titleSkeleton) {
                titleSkeleton.outerHTML = `<h2 class="h1 article-title">${title}
                <a id="title-link" class="a article-title-link" href="${link}" target="_blank" rel="noopener noreferrer">${title}</a></h2>
            `;
            // Replace the 'Link' text with the SVG icon
            loadSvgIcon('/icons/svg/link.svg', 'title-link');
        }

        // Replace skeleton meta content
        const metaSkeletons = this.container.querySelectorAll('.skeleton-meta-item, .skeleton-meta-content-separator');
        metaSkeletons.forEach((skeleton, index) => {
            if (index === 0) {
                skeleton.outerHTML = `
                <hr class="hr meta-content-separator" aria-hidden="true">
                    <div class="article-meta" role="contentinfo" aria-label="Article metadata">
                        <div class="meta-author">
                            <figure class="author-figure" aria-label="Author's profile picture">
                                <img src="/images/janmichael-bio-pic.jpg" alt="Jan Michael Wallace II, Article author" class="author-image">
                            </figure>
                            <p class="p author-info"><a href="${this.mediumProfile}" target="_blank" rel="noopener noreferrer" class="a">Jan Michael Wallace II</a></p>
                        </div>
                        <div class="meta-post">
                            <p class="p"><span class="span pub-date">${date}</span> <span class="decorative-bullet">•</span> <span class="span reading-time">${readingTime}&nbsp;minute&nbsp;read</span></p>
                        </div>
                    </div>
                <hr class="hr meta-content-separator" aria-hidden="true">`;
            } else {
                skeleton.remove();
            }
        });

        // Insert content, insuring that <p> and <h1> to <h6> tags have the appropriate classes
        const textSkeletons = this.container.querySelectorAll('.skeleton-text');
        textSkeletons.forEach((skeleton, index) => {
            if (index === 0) {
                // Create a temporary container to parse the HTML content
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = content;  // Insert the content into the temporary div
        
                // Find all <p> and <h1> to <h6> tags and add the 'p' class to them
                const elements = tempDiv.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
                elements.forEach(element => {
                    element.classList.add('p');  // Add the 'p' class to each <p> or <h1> to <h6>
                });
        
                // Replace the skeleton with the cleaned content
                skeleton.outerHTML = `<div class="post-content">${tempDiv.innerHTML}</div>`;
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
