/* 
    PARAGRAPH TAG FACTORY
    ------------------
    OPTIONS
        • paragraphTagText
            no defaults
        • paragraphTagClasses
            defaults: [`p`, `p--x-small p--dark`, `p--line-height-medium`, `p--align-center-mbl`]
*/
const paragraphTagFactory = function(paragraphTagText, paragraphTagClasses = [`content-transition1`, `p`, `p--large p--dark`, `p--weight-400` , `p--line-height-small`, `p--align-left-mbl`]) {
    const paragraphTag = document.createElement('p');
        paragraphTag.setAttribute(`class`, paragraphTagClasses.join(` `));
        paragraphTag.append(paragraphTagText);
    return paragraphTag;
}
export { paragraphTagFactory };