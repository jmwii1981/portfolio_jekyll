/* 
    URL BASE FACTORY
    ------------------
    Builds out a base url from given param arguments.

    OPTIONS
        • protocol
            defaults: https
        • 3rd level domain
            defaults: www
        • 2nd level domain
            no defaults
        • top level domain
            defaults: com
*/
const urlBaseFactory = function(protocol = `https`, tertiaryDomain = `www`, secondaryDomain, topDomain = `com`) {
    let urlBase = ``;

    if (tertiaryDomain) {
        urlBase = `${protocol}://${tertiaryDomain}.${secondaryDomain}.${topDomain}`;
    } else {
        urlBase = `${protocol}://${secondaryDomain}.${topDomain}`;
    }
    return urlBase;
}
export { urlBaseFactory };