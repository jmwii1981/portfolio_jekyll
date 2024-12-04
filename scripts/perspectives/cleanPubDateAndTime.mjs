
/**
 * Formats the publication date and time of a post.
 * Converts GMT time to EST and stores the formatted date and time in variables.
 * @param {string} feedUrl - The feed URL for fetching the post data.
 * @returns {Object|null} - An object with formatted date and time or null on failure.
 */
import fetchPost from './fetchPost.mjs';

export async function cleanPubDateAndTime(feedUrl) {
    try {
        const fetchedData = await fetchPost(feedUrl);
        if (!fetchedData) throw new Error('Failed to fetch post data.');

        const rawDate = fetchedData.pub || null;
        if (!rawDate) return null;

        const dateObj = new Date(rawDate);
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options);

        let time = dateObj.toLocaleTimeString('en-US', { hour12: false });
        const [hours, minutes] = time.split(':').map(Number);
        time = `${(hours - 5 + 24) % 24}:${minutes < 10 ? '0' : ''}${minutes}`;

        return {
            date: formattedDate,
            time: time
        };
    } catch (error) {
        console.error('Error in cleanPubDateAndTime:', error);
        return null;
    }
}
