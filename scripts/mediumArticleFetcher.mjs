import { MediumService } from './mediumService.mjs';
import { PostDisplay } from './postDisplay.mjs';

export function fetchMediumArticle() {
    const postContainerId = 'latest-post';
    const mediumService = new MediumService('jmwii1981');
    const postDisplay = new PostDisplay(postContainerId);

    // Attempt to fetch the post and display it.
    mediumService.fetchLatestPost()
        .then(post => {
            if (post) {
                postDisplay.displayPost(post);
            } else {
                console.warn("No post available to display.");
                postDisplay.displayDelayMessage();
            }
        })
        .catch(error => {
            console.error("Unexpected error:", error);
            postDisplay.displayDelayMessage();
        });
}
