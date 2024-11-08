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

// Service class for fetching and parsing Medium RSS feed
class MediumService {
    constructor(username) {
        const PROXY_URL = 'https://api.allorigins.win/get?url=';
        this.apiUrl = `${PROXY_URL}${encodeURIComponent(`https://medium.com/feed/@${username}`)}`;
    }

    async fetchLatestPost() {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

            const data = await response.json();
            const parser = new DOMParser();
            const xml = parser.parseFromString(data.contents, "application/xml");

            const item = xml.querySelector("item");
            if (!item) return null;

            const title = item.querySelector("title")?.textContent || 'No title available';
            const link = item.querySelector("link")?.textContent || '#';
            const pubDate = item.querySelector("pubDate")?.textContent || 'Date not available';
            const { fullContent, firstImageHTML, firstFigCaption } = this.extractContentWithNamespace(item, xml);
            const readingTime = DateFormatter.estimateReadingTime(fullContent);

            return { title, link, pubDate, fullContent, firstImageHTML, firstFigCaption, readingTime };
        } catch (error) {
            console.error('Error fetching Medium post:', error);
            return null;
        }
    }

    extractContentWithNamespace(item, xmlDoc) {
        const contentEncoded = xmlDoc.evaluate(
            "content:encoded",
            item,
            prefix => prefix === "content" ? "http://purl.org/rss/1.0/modules/content/" : null,
            XPathResult.STRING_TYPE,
            null
        ).stringValue;

        if (contentEncoded) {
            const contentContainer = document.createElement("div");
            contentContainer.innerHTML = contentEncoded;

            const images = contentContainer.querySelectorAll("img");
            const captions = contentContainer.querySelectorAll("figcaption");

            let firstImageHTML = '';
            let firstFigCaption = '';

            if (images[0]) {
                if (!images[0].src.startsWith("http")) {
                    images[0].src = `https://medium.com/${images[0].src}`;
                }
                images[0].classList.add("post-image");
                firstImageHTML = `<figure class="figure">${images[0].outerHTML}</figure>`;
            }

            if (captions[0]) {
                firstFigCaption = `<figcaption class="figcaption">${captions[0].textContent}</figcaption>`;
            }

            // Remove first image and figcaption from the main content to avoid duplication
            if (images[0]) images[0].remove();
            if (captions[0]) captions[0].remove();

            contentContainer.querySelectorAll("p").forEach(p => p.classList.add("p"));
            contentContainer.querySelectorAll("h3").forEach(h3 => h3.classList.add("h3"));
            contentContainer.querySelectorAll("h2").forEach(h2 => h2.classList.add("h2"));
            contentContainer.querySelectorAll("figure").forEach(fig => fig.classList.add("figure"));
            contentContainer.querySelectorAll("figcaption").forEach(cap => cap.classList.add("figcaption"));

            return { fullContent: contentContainer.innerHTML, firstImageHTML, firstFigCaption };
        }

        console.warn("Content not found in <content:encoded> or <description>");
        return { fullContent: 'No content available', firstImageHTML: '', firstFigCaption: '' };
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
        this.loadingTime = 0; // Tracks loading time in seconds
        this.countdownInterval = null; // Holds the interval ID
        this.delayMessageTimeout = null; // Holds the timeout ID for delay message
    }

    displayLoader() {
        if (this.loader) {
            this.loader.style.display = 'block';  // Show loader
        }
        if (this.container) {
            this.container.style.display = 'none'; // Hide content container while loading
        }
        this.startCountdown();
        this.startDelayMessage();
    }

    hideLoader() {
        if (this.loader) {
            this.loader.style.display = 'none';  // Hide loader
        }
        if (this.container) {
            this.container.style.display = 'block'; // Show content container once loaded
        }
        this.stopCountdown();
        clearTimeout(this.delayMessageTimeout);  // Clear delay message timeout if content loads in time
    }

    startCountdown() {
        this.loadingTime = 0;  // Reset timer
        this.updateCountdownDisplay();
        
        this.countdownInterval = setInterval(() => {
            this.loadingTime += 1;
            this.updateCountdownDisplay();
        }, 1000);
    }

    stopCountdown() {
        clearInterval(this.countdownInterval);  // Stop updating the countdown
        this.countdownInterval = null;  // Reset interval ID
        this.loadingTime = 0;  // Reset loading time
    }

    updateCountdownDisplay() {
        if (this.countdownElement) {
            this.countdownElement.textContent = this.loadingTime;
        }
    }

    startDelayMessage() {
        this.delayMessageTimeout = setTimeout(() => {
            this.displayDelayMessage();
            this.checkMediumStatus();  // Check Medium's status if load time exceeds 6 seconds
        }, 6000);
    }

    async checkMediumStatus() {
        try {
            const response = await fetch("https://medium.statuspage.io/api/v2/status.json");
            const statusData = await response.json();

            if (statusData && statusData.status && statusData.status.description) {
                const statusDescription = statusData.status.description;
                document.getElementById('delay-message').innerHTML += `
                    <p class="p">Current Medium Status: ${statusDescription}</p>
                `;
            }
        } catch (error) {
            console.error("Unable to fetch Medium status:", error);
        }
    }

    displayDelayMessage() {
        const delayMessageContainer = document.createElement('div');
        delayMessageContainer.id = 'delay-message';
        delayMessageContainer.innerHTML = `
            <p class="p">We apologize for the delay. This issue cannot be helped on our side. 
            As a convenience, you may view the latest articles directly on 
            <a href="${this.mediumProfile}" target="_blank" rel="noopener noreferrer" class="a">Medium.com</a>.</p>
        `;
        this.container.parentNode.insertBefore(delayMessageContainer, this.container);
    }

    displayPost(post) {
        if (!this.container) {
            console.warn(`Element with ID '${this.container?.id}' not found.`);
            return;
        }

        if (post) {
            const { title, link, pubDate, fullContent, firstImageHTML, firstFigCaption, readingTime } = post;

            const publishTimeAgo = timeAgo(pubDate); // Calculate "time ago" format

            this.container.innerHTML = `
                <figure class="figure">
                    ${firstImageHTML}
                    ${firstFigCaption}
                </figure>
                <h2 class="h2"><a href="${link}" target="_blank" rel="noopener noreferrer" class="a">${title}</a></h2>
                <div class="meta" role="contentinfo" aria-label="Article metadata">
                    <figure class="author-figure" aria-label="Author's profile picture">
                        <img src="/images/janmichael-bio-pic.jpg" alt="Jan Michael Wallace II, Medium author" class="author-image">
                    </figure>
                    <p class="p author-info">Published by <a href="${this.mediumProfile}" target="_blank" rel="noopener noreferrer" class="a">${this.authorName}</a></p>
                    <p class="p pub-date">Published: ${publishTimeAgo}</p> <!-- Using relative time -->
                    <p class="p reading-time">⏱️ ${readingTime} min read</p>
                </div>
                <hr class="hr meta-content-separator" aria-hidden="true">
                <div class="post-content" role="article">
                    ${fullContent}
                </div>
            `;
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

        this.hideLoader();  // Hide the loader after displaying content
    }
}

// Main function to initialize and display the latest Medium post
document.addEventListener("DOMContentLoaded", () => {
    const postContainerId = 'latest-post';
    const mediumService = new MediumService('jmwii1981');
    const postDisplay = new PostDisplay(postContainerId);

    postDisplay.displayLoader(); // Show loader initially

    mediumService.fetchLatestPost()
        .then(post => postDisplay.displayPost(post))
        .catch(error => console.error("Unexpected error:", error));
});
