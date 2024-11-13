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
    
        // Select the first image
        const firstImage = contentContainer.querySelector("img");
    
        // If no image is found, handle gracefully
        if (!firstImage) {
            console.warn("No image found in content.");
            // Hide skeleton image if no image is found
            const imageSkeleton = this.container.querySelector('.skeleton-image');
            if (imageSkeleton) {
                imageSkeleton.style.display = 'none'; // Hide skeleton image
            }
            return ''; // Return empty string if no image found
        }
    
        // Try to find the associated figcaption if it exists
        const firstFigcaption = firstImage.closest("figure") ? firstImage.closest("figure").querySelector("figcaption") : null;
    
        // Clean the figcaption text if it exists, and replace &nbsp; with a space
        const cleanedFigcaptionText = firstFigcaption ? firstFigcaption.textContent.replace(/\u00A0/g, ' ') : '';
    
        // Return image and figure HTML if the image is available
        return `<figure class="figure"><img src="${firstImage.src}" class="post-image" alt="${cleanedFigcaptionText} – ${firstImage.alt || 'Featured Image'}"></figure>`;
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
