
/**
 * Extracts the first featured image from the fetched post data.
 * Wraps the image in an <img> tag with specific classes and includes alt text from <figcaption>.
 * @param {string} feedUrl - The feed URL for fetching the post data.
 * @returns {string|null} - HTML string for the featured image or null on failure.
 */
import fetchPost from './fetchPost.mjs';

export async function cleanImage(feedUrl) {
    try {
        const fetchedData = await fetchPost(feedUrl);
        if (!fetchedData) throw new Error('Failed to fetch post data.');

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = fetchedData.content || '';
        const firstImageFigure = tempDiv.querySelector('figure');

        if (!firstImageFigure) return null;

        const imgTag = firstImageFigure.querySelector('img');
        const figCaption = firstImageFigure.querySelector('figcaption');
        const altText = figCaption ? figCaption.textContent : 'Image';

        return `<img class="img post-featured-img" src="${imgTag.src}" alt="${altText}">`;
    } catch (error) {
        console.error('Error in cleanImage:', error);
        return null;
    }
}
