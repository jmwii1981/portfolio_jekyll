// Utility function to calculate "time ago" from a date string
function timeAgo(publishDateString) {
    const publishDate = new Date(publishDateString);
    const now = new Date();
    const secondsAgo = Math.floor((now - publishDate) / 1000);

    const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "week", seconds: 604800 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 }
    ];

    for (const interval of intervals) {
        const count = Math.floor(secondsAgo / interval.seconds);
        if (count >= 1) {
            return count === 1
                ? `1 ${interval.label} ago`
                : `${count} ${interval.label}s ago`;
        }
    }

    return "just now";
}

// Utility class for formatting dates and calculating reading time
class DateFormatter {
    static toLocaleDate(dateString) {
        return new Date(dateString).toLocaleDateString();
    }

    static estimateReadingTime(content) {
        const words = content.split(/\s+/).length;  // Estimate word count
        const readingTimeMinutes = Math.ceil(words / 200);  // Average 200 words per minute
        return readingTimeMinutes;
    }
}

// Service class for fetching and parsing Medium feed
class MediumService {
    constructor(username) {
        this.username = username;
        this.backupApiUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${username}`;
    }

    async fetchPostFromApi() {
        try {
            const response = await fetch(this.backupApiUrl);
            if (!response.ok) throw new Error(`Backup API fetch failed with status: ${response.status}`);

            const data = await response.json();
            const item = data.items ? data.items[0] : null;
            if (!item) {
                console.warn("No posts found in the backup API response.");
                return null;
            }

            const title = item.title || 'No title available';
            const link = item.link || '#';
            const pubDate = new Date(item.pubDate || 'Date not available');
            const fullContent = this.extractContentWithoutImage(item.content);
            const firstImageHTML = item.thumbnail ? `<figure class="figure featured-image"><img src="${item.thumbnail}" class="img post-image" alt="Article Image"><figcaption class="figcaption">An empty conference room with large glass windows...</figcaption></figure>` : '';
            const readingTime = DateFormatter.estimateReadingTime(fullContent);

            return { title, link, pubDate, fullContent, firstImageHTML, readingTime };
        } catch (error) {
            console.error("Error fetching Medium post from backup API source:", error);
            return null;
        }
    }

    // Remove image tags from content to avoid duplicates
    extractContentWithoutImage(content) {
        const contentContainer = document.createElement("div");
        contentContainer.innerHTML = content;
        contentContainer.querySelectorAll("figure, img").forEach(node => node.remove());
        return contentContainer.innerHTML;
    }

    async fetchLatestPost() {
        return await this.fetchPostFromApi();
    }
}

// Class for handling display logic with countdown loader and accessible image
class PostDisplay {
    constructor(elementId) {
        this.container = document.getElementById(elementId);
        this.loader = document.getElementById('loader');
        this.countdownElement = document.getElementById('countdown');
        this.authorName = 'Jan Michael Wallace II';
        this.mediumProfile = 'https://medium.com/@jmwii1981';
        this.loadingTime = 0;
        this.countdownInterval = null;
        this.delayMessageTimeout = null;
    }

    displayLoader() {
        if (this.loader) {
            this.loader.style.display = 'block';
        }
        if (this.container) {
            this.container.style.display = 'none';
        }
        this.startCountdown();
        this.startDelayMessage();
    }

    hideLoader() {
        if (this.loader) {
            this.loader.style.display = 'none';
        }
        if (this.container) {
            this.container.style.display = 'block';
        }
        this.stopCountdown();
        clearTimeout(this.delayMessageTimeout);
    }

    startCountdown() {
        this.loadingTime = 0;
        this.updateCountdownDisplay();
        
        this.countdownInterval = setInterval(() => {
            this.loadingTime += 1;
            this.updateCountdownDisplay();
        }, 1000);
    }

    stopCountdown() {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
        this.loadingTime = 0;
    }

    updateCountdownDisplay() {
        if (this.countdownElement) {
            this.countdownElement.textContent = this.loadingTime;
        }
    }

    startDelayMessage() {
        this.delayMessageTimeout = setTimeout(() => {
            this.displayDelayMessage();
            this.checkMediumStatus();
        }, 2000);
    }

    async checkMediumStatus() {
        try {
            const response = await fetch("https://medium.statuspage.io/api/v2/status.json");
            const statusData = await response.json();

            if (statusData && statusData.status && statusData.status.description) {
                const statusDescription = statusData.status.description;
                const statusUrl = "https://medium.statuspage.io/";

                document.querySelector('.loading-issue-fallback').innerHTML = `
                    <p class="p">Though Medium.com reports <a href="${statusUrl}" target="_blank" class="a">${statusDescription.toLowerCase()}</a>, it is taking longer than expected to load this article. For your convenience, here is a link to <a href="${this.mediumProfile}" target="_blank" rel="noopener noreferrer" class="a">Jan Michael's Medium.com feed</a>.</p>
                `;
            }
        } catch (error) {
            console.error("Unable to fetch Medium status:", error);
        }
    }

    displayDelayMessage() {
        const delayMessageContainer = document.createElement('div');
        delayMessageContainer.className = 'loading-issue-fallback';
        delayMessageContainer.innerHTML = `
            <p class="p">Though Medium.com reports <a href="https://medium.statuspage.io/" target="_blank" class="a">all systems operational</a>, it is taking longer than expected to load this article. For your convenience, here is a link to <a href="${this.mediumProfile}" target="_blank" rel="noopener noreferrer" class="a">Jan Michael's Medium.com feed</a>.</p>
        `;
        this.loader.appendChild(delayMessageContainer);
    }

    displayPost(post) {
        if (!this.container) {
            console.warn(`Element with ID '${this.container?.id}' not found.`);
            return;
        }

        this.container.innerHTML = ''; // Clear existing content

        // Remove delay message if it exists
        const delayMessage = document.querySelector('.loading-issue-fallback');
        if (delayMessage) {
            delayMessage.remove();
        }

        if (post) {
            const { title, link, pubDate, fullContent, firstImageHTML, readingTime } = post;
            const publishTimeAgo = timeAgo(pubDate);

            // Display image, metadata, and main content without duplication
            this.container.innerHTML = `
                <div class="post-content" role="article">
                    ${firstImageHTML}
                    
                    <h2 class="h2">${title} <a href="${link}" target="_blank" rel="noopener noreferrer" class="a">Link</a></h2>
                    
                    <div class="meta" role="contentinfo" aria-label="Article metadata">
                        <div class="meta-author">
                            <figure class="author-figure" aria-label="Author's profile picture">
                                <img src="/images/janmichael-bio-pic.jpg" alt="Jan Michael Wallace II, Article author" class="author-image">
                            </figure>
                            <p class="p author-info">Published by <a href="${this.mediumProfile}" target="_blank" rel="noopener noreferrer" class="a">Jan Michael Wallace II</a></p>
                        </div>
                        <div class="meta-post">
                            <p class="p"><span class="span pub-date">Published ${publishTimeAgo}</span> <span class="decorative">•</span> <span class="span reading-time">${readingTime} minute read</span></p>
                        </div>
                    </div>
                    <hr class="hr meta-content-separator" aria-hidden="true">
                    
                    ${fullContent}
                </div>
            `;

            // Append the "Read more on Medium" section after displaying the post
            this.appendReadMoreSection();
        } else {
            this.container.innerHTML = `
                <p class="p">
                    It looks like Medium and this website are currently in conflict and unable to load the latest post. 
                    Please contact Jan Michael at <a href="mailto:hello@janmichael.io" class="a">hello@janmichael.io</a> so that he is aware of the issue and can resolve it. 
                    In the meantime, as an alternative, you may view his profile on 
                    <a href="${this.mediumProfile}" target="_blank" rel="noopener noreferrer" class="a">Medium.com</a>.
                </p>
            `;
        }

        this.hideLoader();
    }

    // Appends the "Read more on Medium" section after #latest-post
    appendReadMoreSection() {
        const readMoreSection = document.createElement('section');
        readMoreSection.className = 'eop-cta';
        readMoreSection.innerHTML = `
            <a class="a arrow-link" href="//medium.com/@jmwii1981" target="_blank">Read more on Medium</a>
        `;

        this.container.insertAdjacentElement('afterend', readMoreSection);
    }
}

// Main function to initialize and display the latest Medium post
document.addEventListener("DOMContentLoaded", () => {
    const postContainerId = 'latest-post';
    const mediumService = new MediumService('jmwii1981');
    const postDisplay = new PostDisplay(postContainerId);

    postDisplay.displayLoader();

    mediumService.fetchLatestPost()
        .then(post => {
            if (post) {
                postDisplay.displayPost(post);
            } else {
                console.warn("No post available to display.");
            }
        })
        .catch(error => console.error("Unexpected error:", error));
});
