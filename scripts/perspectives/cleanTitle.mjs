
/**
 * Cleans and sanitizes the title of the post.
 * Removes HTML tags and wraps the title in an <h2> tag with specific classes.
 * @param {string} feedUrl - The feed URL for fetching the post data.
 * @returns {string|null} - The sanitized and formatted title or null on failure.
 */
export function cleanTitle(fetchedData) {
    try {
        if (!fetchedData) throw new Error('Failed to fetch post data.');

        const rawTitle = fetchedData.title || 'Untitled';
        const title = document.createElement('h2');
        title.className = 'h2 post-title';
        title.textContent = rawTitle.replace(/<[^>]+>/g, '');

        return title.outerHTML;
    } catch (error) {
        console.error('Error in cleanTitle:', error);
        return null;
    }
}
