/* 
    ANCHOR TAG FACTORY
    ------------------
    OPTIONS
        • anchorTagText
            no defaults
        • anchorTagClasses
            defaults: [`link`, `link--x-small`, `link--dark`,`link--weight-500`]
        • anchorTagHref
            no defaults
        • anchorTagTarget
            defaults: `_blank`
        • anchorTagReferrerPolicy
            defaults: `no-referrer`
        • anchorTagRelationship
            defaults: `external`
        • anchorTagProperty
            defaults: `dct:title`
*/
const anchorTagFactory = function(anchorTagText, anchorTagClasses = [`link`, `link--large`, `link--dark`,`link--weight-500`], anchorTagHref, anchorTagTarget = `_blank`, anchorTagReferrerPolicy=`no-referrer`, anchorTagRelationship=`external`, anchorTagProperty=`dct:title`) {
    const anchorTag = document.createElement('a');
        anchorTag.setAttribute(`class`, anchorTagClasses.join(` `));
        anchorTag.setAttribute(`href`, `${anchorTagHref}`);
        anchorTag.setAttribute(`target`, `${anchorTagTarget}`);
        anchorTag.setAttribute(`referrerpolicy`, `${anchorTagReferrerPolicy}`);
        anchorTag.setAttribute(`rel`, `${anchorTagRelationship}`);
        anchorTag.setAttribute(`property`, `${anchorTagProperty}`);
        anchorTag.textContent = anchorTagText;
    return anchorTag;
}
export { anchorTagFactory };