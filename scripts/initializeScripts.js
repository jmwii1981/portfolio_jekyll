/**
 * Initialize all scripts within this project.
 * This script manages the setup and execution of other module scripts.
 */

(async () => {
    try {
        // LET'S BEGIN ...
        console.log('Initializing all scripts...');

        // WHAT PAGE ARE WE ON?
        
        // Check if the current page path is '/'
        if (window.location.pathname === '/') {

            // Perspectives page scripts ...
            console.log('You are on the work page!');
        
        }
        
        // Check if the current page path is '/experience/'
        if (window.location.pathname === '/experience/') {

            // Perspectives page scripts ...
            console.log('You are on the experience page!');
        
        }

        // Check if the current page path is '/endorsements/'
        if (window.location.pathname === '/endorsements/') {

            // Perspectives page scripts ...
            console.log('You are on the endorsements page!');
        
        }
        
        // Check if the current page path is '/perspectives/'
        if (window.location.pathname === '/perspectives/') {

            // Perspectives page scripts ...
            console.log('You are on the perspectives page!');
            
            // Dynamically import the script
            const { renderPost } = await import('./perspectives/renderPost.mjs');
            
            // URL for initialization
            const feedUrl = 'https://medium.com/feed/@jmwii1981';
            
            // Render the most recent post
            await renderPost(feedUrl);
        }

        // Check if the current page path is '/about/'
        if (window.location.pathname === '/about/') {

            // Perspectives page scripts ...
            console.log('You are on the about page!');
        
        }

        // LET'S WRAP THIS UP!
        console.log('All scripts initialized successfully.');
    } catch (error) {
        console.error('Error initializing scripts:', error);
    }
})();
