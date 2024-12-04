
/**
 * Cleans and sanitizes the title of the post.
 * Removes HTML tags and wraps the title in an <h2> tag with specific classes.
 * @param {string} feedUrl - The feed URL for fetching the post data.
 * @returns {string|null} - The sanitized and formatted title or null on failure.
 */
import fetchPost from './fetchPost.mjs';

export async function cleanTitle(feedUrl) {
    try {
        const fetchedData = await fetchPost(feedUrl);
        if (!fetchedData) throw new Error('Failed to fetch post data.');

        const rawTitle = fetchedData.title || 'Untitled';
        const sanitizedTitle = rawTitle.replace(/<[^>]+>/g, '');

        return `<h2 class="h2 post-title">${sanitizedTitle}</h2>`;
    } catch (error) {
        console.error('Error in cleanTitle:', error);
        return null;
    }
}
