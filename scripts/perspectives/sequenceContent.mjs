
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
import fetchPost from './fetchPost.mjs';

export async function sequenceContent(feedUrl) {
    try {
        const fetchedData = await fetchPost(feedUrl);
        const image = cleanImage(fetchedData);
        const title = cleanTitle(fetchedData);
        const { date, time } = cleanPubDateAndTime(fetchedData);
        const content = cleanContentBody(fetchedData);
        const textContent = document.createElement('div');
        textContent.innerHTML = content || '';
        const wordCount = textContent.textContent.trim().split(/\s+/).filter(Boolean).length;
        const readingTime = Math.max(1, Math.ceil(wordCount / 200));

        return {
            image,
            title,
            date,
            time,
            content,
            readingTime,
            recentArticles: fetchedData.recentArticles || []
        };
    } catch (error) {
        console.error('Error in sequenceContent:', error);
        return null;
    }
}
