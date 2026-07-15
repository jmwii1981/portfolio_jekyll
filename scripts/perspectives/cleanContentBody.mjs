
/**
 * Processes the content body from the fetched post data.
 * Removes unwanted images, retains inline HTML formatting, and ensures proper class additions.
 * - Removes the first image wrapped in a <figure> tag entirely.
 * - Removes images with height=1 and width=1 attributes.
 * - Retains subsequent images wrapped in <figure> tags and adds them to the content.
 * @param {string} feedUrl - The feed URL for fetching the post data.
 * @returns {string|null} - The cleaned and formatted content body or null on failure.
 */
export function cleanContentBody(fetchedData) {
    try {
        if (!fetchedData) throw new Error('Failed to fetch post data.');

        let contentBody = fetchedData.content || '';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = contentBody;

        tempDiv.querySelectorAll('script, style, iframe, object, embed, form, input, button, video, audio').forEach((element) => element.remove());
        tempDiv.querySelectorAll('img[width="1"][height="1"]').forEach((image) => image.remove());

        tempDiv.querySelectorAll('*').forEach((element) => {
            const originalHref = element.getAttribute('href');
            const originalSrc = element.getAttribute('src');
            const originalAlt = element.getAttribute('alt');
            Array.from(element.attributes).forEach((attribute) => element.removeAttribute(attribute.name));

            if (element.tagName === 'A') {
                if (originalHref && /^https?:/i.test(originalHref)) {
                    element.href = originalHref;
                    element.target = '_blank';
                    element.rel = 'noopener noreferrer';
                }
            }

            if (element.tagName === 'IMG' && originalSrc && /^https?:/i.test(originalSrc)) {
                element.src = originalSrc;
                element.alt = originalAlt || '';
                element.loading = 'lazy';
                element.decoding = 'async';
            }
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
