import { ReadingTimeEstimator } from './readingTimeEstimator.mjs';  // Import the new module

export class MediumService {
    constructor(username) {
        this.username = username;
        // Generate a unique timestamp query parameter for each request
        const timestamp = Math.floor(Date.now() / 1000);  // Get the current Unix timestamp in seconds
        this.backupApiUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${username}&t=${timestamp}`;
        console.log(this.backupApiUrl);
    }

    async fetchPostFromApi() {
        try {
            console.log("Fetching post from backup API...");

            const response = await fetch(this.backupApiUrl);
            if (!response.ok) throw new Error(`Backup API fetch failed with status: ${response.statusText}`);

            const data = await response.json();
            console.log("API response data:", data);

            const item = data.items ? data.items[0] : null;
            if (!item) {
                console.warn("No items found in API response.");
                return null;
            }

            const title = item.title || 'No title available';
            const link = item.link || '#';
            const pubDate = new Date(item.pubDate || 'Date not available');
            const fullContent = this.extractContentWithoutImage(item.content);
            const firstImageHTML = this.extractFirstImageFromContent(item.content);
            // Use the new ReadingTimeEstimator
            const readingTime = ReadingTimeEstimator.estimateReadingTime(fullContent);

            return { title, link, pubDate, fullContent, firstImageHTML, readingTime };
        } catch (error) {
            console.error("Error fetching Medium post from backup API source:", error);
            return null;
        }
    }

extractFirstImageFromContent(content) {
    const contentContainer = document.createElement("div");
    contentContainer.innerHTML = content;
    
    // Find the first image inside a <figure> element
    const firstFigure = contentContainer.querySelector("figure > img");

    // Check if the image exists and if its width/height are greater than 1px
    if (firstFigure && firstFigure.width > 1 && firstFigure.height > 1) {
        const firstFigcaption = firstFigure.closest("figure").querySelector("figcaption");
        const cleanedFigcaptionText = firstFigcaption ? firstFigcaption.textContent.replace(/\u00A0/g, ' ') : '';

        return `<figure class="figure">
                    <img src="${firstFigure.src}" class="post-image" alt="${cleanedFigcaptionText} – ${firstFigure.alt || 'Featured Image'}">
                </figure>`;
    }

    // Return empty string if no valid image is found
    return '';
}

    
    

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
