// Utility class for formatting dates
class DateFormatter {
    static toLocaleDate(dateString) {
        return new Date(dateString).toLocaleDateString();
    }
}

// Service class for fetching Medium data
class MediumService {
    constructor(username, apiBase = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/') {
        this.apiUrl = `${apiBase}@${username}`;
    }

    async fetchLatestPost() {
        try {
            // Add a timestamp parameter to bypass any cached responses
            const response = await fetch(`${this.apiUrl}&_=${Date.now()}`);
            if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
            
            const data = await response.json();
            return data.items?.[0] || null;  // Return the latest post or null if none found
        } catch (error) {
            console.error('Error fetching Medium post:', error);
            return null; // Return null to handle errors gracefully
        }
    }
}

// Class for handling display logic
class PostDisplay {
    constructor(elementId) {
        this.container = document.getElementById(elementId);
    }

    displayPost(post) {
        if (!this.container) {
            console.info(`Element with ID 'latest-post' not found on this page.`);
            return;
        }
        
        if (post) {
            const { title, link, pubDate, content } = post;

            // Set up title and link with innerHTML for emoji support
            this.container.innerHTML = `
                <h3><a href="${link}" target="_blank" rel="noopener noreferrer">${title}</a></h3>
                <p>Published on: ${DateFormatter.toLocaleDate(pubDate)}</p>
                <div class="post-content">${content}</div>
            `;
        } else {
            this.container.innerHTML = 'Unable to load latest post.';
        }
    }
}

// Execute only when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const postContainer = document.getElementById('latest-post');
    if (!postContainer) return;  // Exit if the container is not present on the page

    const mediumService = new MediumService('jmwii1981');
    const postDisplay = new PostDisplay('latest-post');

    mediumService.fetchLatestPost()
        .then(post => postDisplay.displayPost(post));
});
