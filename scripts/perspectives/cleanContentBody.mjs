
/**
 * Processes the content body from the fetched post data.
 * Removes unwanted images, retains inline HTML formatting, and ensures proper class additions.
 * - Removes the first image wrapped in a <figure> tag entirely.
 * - Removes images with height=1 and width=1 attributes.
 * - Retains subsequent images wrapped in <figure> tags and adds them to the content.
 * @param {string} feedUrl - The feed URL for fetching the post data.
 * @returns {string|null} - The cleaned and formatted content body or null on failure.
 */
import fetchPost from './fetchPost.mjs';

export async function cleanContentBody(feedUrl) {
    try {
        const fetchedData = await fetchPost(feedUrl);
        if (!fetchedData) throw new Error('Failed to fetch post data.');

        let contentBody = fetchedData.content || '';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = contentBody;

        // Remove images with width=1 and height=1
        tempDiv.querySelectorAll('img').forEach(img => {
            if (img.width === 1 && img.height === 1) img.remove();
        });

        // Remove the first <figure> entirely
        const firstFigure = tempDiv.querySelector('figure');
        if (firstFigure) firstFigure.remove();

        // Add classes to HTML text modifier tags
        ['p', 'b', 'span', 'em'].forEach(tag => {
            tempDiv.querySelectorAll(tag).forEach(el => el.classList.add(tag));
        });

        // Replace <br> tags with empty spaces
        tempDiv.querySelectorAll('br').forEach(br => br.remove());

        // Ensure subsequent images wrapped in <figure> tags remain in the content
        tempDiv.querySelectorAll('img').forEach(img => {
            const figure = document.createElement('figure');
            img.replaceWith(figure);
            figure.appendChild(img);
        });

        return tempDiv.innerHTML;
    } catch (error) {
        console.error('Error in cleanContentBody:', error);
        return null;
    }
}
