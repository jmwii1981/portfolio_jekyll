/* 
    URL ASSIMILATION FACTORY
    ------------------------
    OPTIONS
        • urlHost
            no defaults
        • urlPaths
            no defaults
        • apiQueries
            no defaults
        • apiParams
            no defaults

*/
const urlAssimilationFactory = function(urlBase, urlPaths, apiParams) {
    // Let's get the ball rolling ...
    let fullUrl = ``;

    // urlPaths is an object
    if (urlPaths) {
        urlPaths.forEach(pathName => `${pathName}`)
        urlPaths = urlPaths.join('/', '');
        fullUrl = new URL(urlPaths, urlBase);
    } else {
        fullUrl = new URL(urlBase);
    }

    // apiParams is an object
    if (apiParams) {
        apiParams = new URLSearchParams(apiParams);
        fullUrl.search = apiParams;
    }
    return fullUrl;
}
export { urlAssimilationFactory };