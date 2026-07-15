
/**
 * Extracts the first featured image from the fetched post data.
 * Wraps the image in an <img> tag with specific classes and includes alt text from <figcaption>.
 * @param {string} feedUrl - The feed URL for fetching the post data.
 * @returns {string|null} - HTML string for the featured image or null on failure.
 */
export function cleanImage(fetchedData) {
    try {
        if (!fetchedData) throw new Error('Failed to fetch post data.');

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = fetchedData.content || '';
        const firstImageFigure = tempDiv.querySelector('figure');

        if (!firstImageFigure) return null;

        const imgTag = firstImageFigure.querySelector('img');
        const figCaption = firstImageFigure.querySelector('figcaption');
        const altText = figCaption ? figCaption.textContent : 'Image';

        if (!imgTag?.src || !/^https?:$/i.test(new URL(imgTag.src).protocol)) return null;

        const cleanImage = document.createElement('img');
        cleanImage.className = 'img post-featured-img';
        cleanImage.src = imgTag.src;
        cleanImage.alt = altText.trim();
        cleanImage.loading = 'lazy';
        cleanImage.decoding = 'async';

        return cleanImage.outerHTML;
    } catch (error) {
        console.error('Error in cleanImage:', error);
        return null;
    }
}
