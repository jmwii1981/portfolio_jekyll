
/**
 * Sequences and structures the cleaned content data.
 * Orders the post components as image, title, date, and content.
 * @param {string} feedUrl - The feed URL for fetching the post data.
 * @returns {Object|null} - Sequenced post content or null on failure.
 */
import { cleanImage } from './cleanImage.mjs';
import { cleanTitle } from './cleanTitle.mjs';
import { cleanPubDateAndTime } from './cleanPubDateAndTime.mjs';
import { cleanContentBody } from './cleanContentBody.mjs';

export async function sequenceContent(feedUrl) {
    try {
        const image = await cleanImage(feedUrl);
        const title = await cleanTitle(feedUrl);
        const { date, time } = await cleanPubDateAndTime(feedUrl);
        const content = await cleanContentBody(feedUrl);

        return {
            image,
            title,
            date,
            time,
            content
        };
    } catch (error) {
        console.error('Error in sequenceContent:', error);
        return null;
    }
}
