
/**
 * Formats the publication date and time of a post.
 * Converts GMT time to EST and stores the formatted date and time in variables.
 * @param {string} feedUrl - The feed URL for fetching the post data.
 * @returns {Object|null} - An object with formatted date and time or null on failure.
 */
export function cleanPubDateAndTime(fetchedData) {
    try {
        if (!fetchedData) throw new Error('Failed to fetch post data.');

        const rawDate = fetchedData.pub || null;
        if (!rawDate) return null;

        const dateObj = new Date(rawDate);
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options);

        return {
            date: formattedDate,
            time: dateObj.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                timeZone: 'America/New_York'
            })
        };
    } catch (error) {
        console.error('Error in cleanPubDateAndTime:', error);
        return null;
    }
}
