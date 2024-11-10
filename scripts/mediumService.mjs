import { DateFormatter } from './dateFormatter.mjs';

export class MediumService {
    constructor(username) {
        this.username = username;
        this.backupApiUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${username}`;
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

            const readingTime = DateFormatter.estimateReadingTime(fullContent);

            return { title, link, pubDate, fullContent, firstImageHTML, readingTime };
        } catch (error) {
            console.error("Error fetching Medium post from backup API source:", error);
            return null;
        }
    }

    extractFirstImageFromContent(content) {
        const contentContainer = document.createElement("div");
        contentContainer.innerHTML = content;
    
        const firstImage = contentContainer.querySelector("img");
        const firstFigcaption = firstImage ? firstImage.closest("figure").querySelector("figcaption") : null;
    
        if (firstImage) {
            const cleanedFigcaptionText = firstFigcaption ? firstFigcaption.textContent.replace(/\u00A0/g, ' ') : '';
            return `<figure class="figure"><img src="${firstImage.src}" class="post-image" alt="${cleanedFigcaptionText} – ${firstImage.alt || 'Featured Image'}"></figure>`;
        }

        return ''; // Return empty if no image found
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
