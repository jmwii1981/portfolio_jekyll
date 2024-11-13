export class DateFormatter {
    static toLocaleDate(date) {
        return date.toLocaleDateString("en-US", {
            weekday: "long", // e.g., Monday
            year: "numeric",
            month: "long", // e.g., November
            day: "numeric", // e.g., 11
            timeZone: "America/New_York", // EST timezone
        });
    }

    static formatElapsedTime(pubDate) {
    // Convert pubDate to Date object in UTC (from API) and subtract 5 hours for EST
    const pubDateInEST = new Date(new Date(pubDate).getTime() - 5 * 60 * 60 * 1000); // Subtracting 5 hours (in milliseconds)

        // Get the current time on the user's machine in EST
        const currentDate = new Date();
        const currentDateInEST = new Date(currentDate.toLocaleString("en-US", { timeZone: "America/New_York" }));

        // Log for verification
        console.log("PubDate (EST):", pubDateInEST);
        console.log("Current Date (EST):", currentDateInEST);

        // Calculate the difference in milliseconds
        const elapsedTime = currentDateInEST - pubDateInEST;

        // If the published date is in the future, show "Just Now"
        if (elapsedTime < 0) {
            console.warn("Publish date is in the future.");
            return "Just now";
        }

        // Calculate elapsed time in different units
        const secondsElapsed = Math.floor(elapsedTime / 1000); // Convert milliseconds to seconds

        if (secondsElapsed < 60) {
            return `${secondsElapsed} second${secondsElapsed !== 1 ? 's' : ''} ago`;
        } else if (secondsElapsed < 3600) { // Less than an hour
            const minutes = Math.floor(secondsElapsed / 60);
            return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        } else if (secondsElapsed < 86400) { // Less than a day
            const hours = Math.floor(secondsElapsed / 3600);
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        } else {
            // For more than a day ago, show the full date and time
            // return pubDateInEST.toLocaleString("en-US", { timeZone: "America/New_York" });
            
            // For more than a day ago, show the full date only
            return pubDateInEST.toLocaleDateString("en-US", {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
              
        }
    }
}
