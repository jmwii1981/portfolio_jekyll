/*
    MEDIUM RSS 
    Dev Docs: https://help.medium.com/hc/en-us/articles/214874118-Using-RSS-feeds-of-profiles-publications-and-topics
    RSS Root: https://medium.com/feed/@username

    ----------------
    STRUCTURES
        • TBDocumented
*/
// Data
import {checkDate} from './date.mjs';

// Factories
import { urlBaseFactory } from '../factories/urlBase.mjs';
import { urlAssimilationFactory } from '../factories/urlAssimilation.mjs';
import { apiFetchFactory } from '../factories/apiFetch.mjs';
import { anchorTagFactory } from '../factories/anchorTag.mjs';
import { paragraphTagFactory } from '../factories/paragraphTag.mjs';

const removeNonBreakingSpacesFactory = function(givenEl) {
    let givenElString = givenEl.innerHTML.replace(/\&nbsp;/g, ' ');
    givenEl.innerHTML = givenElString;
    return givenEl;
}
const addAttribsToChildrenFactory = function(givenEl) {
    if (givenEl.hasChildNodes()) {
        const children = givenEl.childNodes;
        let newChild = ``;
        for (const child of children) {
            const childName = child.nodeName;
            if (childName == 'A') {
                if (child.children) {
                    const grandchildren = child.childNodes;
                    for (const grandchild of grandchildren) {
                        newChild = anchorTagFactory(``, [`link`, `link--medium`, `link--dark`,`link--weight-500`], child.href, undefined, undefined, undefined, undefined);
                        newChild.append(grandchild);
                        // console.log(newChild);
                    }
                } else {
                    newChild = anchorTagFactory(child.text, [`link`, `link--medium`, `link--dark`,`link--weight-500`], child.href, undefined, undefined, undefined, undefined);
                }
                child.replaceWith(newChild);
            }
            if (childName == 'IMG') {
                child.setAttribute(`class`, `medium-article--image`);
            }
        }
    }
}
// M Site URL
let siteUrl = {
    base: {
        protocol: undefined,
        tertiaryDomain: `www`,
        secondaryDomain: `medium`,
        topDomain: `com`,
    },
};
siteUrl.base = Object.values(siteUrl.base);
const siteUrlBase = urlBaseFactory(...siteUrl.base);
const siteUrlFull = urlAssimilationFactory(siteUrlBase, siteUrl.paths, siteUrl.params);

let blogUrl = {
    base: {
        protocol: undefined,
        tertiaryDomain: `www`,
        secondaryDomain: `medium`,
        topDomain: `com`,
    },
    paths: [
        `@jmwii1981`
    ],
};
blogUrl.base = Object.values(blogUrl.base);
const blogUrlBase = urlBaseFactory(...blogUrl.base);
const blogUrlFull = urlAssimilationFactory(blogUrlBase, blogUrl.paths, blogUrl.params);

// M RSS URL
let rssUrl = {
    base: {
        protocol: undefined,
        tertiaryDomain: ``,
        secondaryDomain: `medium`,
        topDomain: `com`,
    },
    paths: [
        `feed`,
        `@jmwii1981`
    ],
    params: {
    },
};
rssUrl.base = Object.values(rssUrl.base);
const rssUrlBase = urlBaseFactory(...rssUrl.base);
const rssUrlFull = urlAssimilationFactory(rssUrlBase, rssUrl.paths, rssUrl.params);

let rssToJsonUrl = {
    base: {
        protocol: undefined,
        tertiaryDomain: `api`,
        secondaryDomain: `rss2json`,
        topDomain: `com`,
    },
    paths: [
        `v1`,
        `api.json`
    ],
    params: {
        t: checkDate().unixTimestamp,
        
        rss_url: `${rssUrlFull}`,
    },
};
rssToJsonUrl.base = Object.values(rssToJsonUrl.base);
const rssToJsonUrlBase = urlBaseFactory(...rssToJsonUrl.base);
const rssToJsonUrlFull = urlAssimilationFactory(rssToJsonUrlBase, rssToJsonUrl.paths, rssToJsonUrl.params);
// console.log(rssToJsonUrlFull.toString());

// Getting and storing M results for later ...
let result = await apiFetchFactory(rssToJsonUrlFull);
result = result.apiData;

if (result) {
    // Grab most recent post object
    const recentPost = result.items[0];
    if (recentPost) {
        // Grab post permalink
        const recentPostUrl = recentPost.link;
        // Grab post title
        const recentPostTitle = recentPost.title;
        // Grab publishing date
        const recentPostPubDate = recentPost.pubDate;
        // Grab categories
        const recentPostCategories = recentPost.categories;
        // Grab post content 'string'
        const recentPostContent = recentPost.content;
        // Parse content string
        const recentPostContentParser = new DOMParser();
        // Grab post content string and convert into HTML element objects
        const recentPostContentDoc = recentPostContentParser.parseFromString(recentPostContent, 'text/html');
        // Scrape only the HTML elements inside of the <body></body> tags
        const recentPostEls = recentPostContentDoc.body.childNodes;
        // Adjust any paragraph element classes for styling
        const paragraphTagClasses = [`p`, `p--medium p--dark`, `p--line-height-medium`, `p--align-left-mbl`];
        // Generate a 'read more' HTML anchor object with permalink URL
        const readMoreButton = anchorTagFactory(`Discover more`, [`button`], blogUrlFull, undefined, undefined, undefined, undefined);
        // Generate follow-up article footer text
        const recentPostInterest =  paragraphTagFactory(``, [`h3`, `h3--weight-600`, `h3--large`, `h3--line-height-medium`, `medium-article--interest`]); recentPostInterest.append(`Enjoy this article?`); recentPostInterest.append(readMoreButton);
        // Grab post publish date and reformat post publish date
        const convertedRecentPostDate = checkDate(recentPostPubDate).fullDateStrMoFirst;
        // Append formatted post publish date to a new paragraph object
        const recentPostDate = convertedRecentPostDate;
        // Grab post author and append to a new paragraph object
        const recentPostAuthorLink = anchorTagFactory(recentPost.author, undefined, `https://medium.com/@jmwii1981`, undefined, undefined, undefined, undefined);
        // Special p tag classes for meta information
        const metaPTagClasses = [`p`, `p--small`, `p--dark`, `p--line-height-small`, `p--align-left-mbl`, `p--meta`];
        const mediumMetaLink = anchorTagFactory(`Medium`, undefined, siteUrlFull, undefined, undefined, undefined, undefined);
        // Create a p tag with post 'meta'
        const recentPostMeta =  paragraphTagFactory(``, metaPTagClasses); recentPostMeta.append(`Published on `); recentPostMeta.append(mediumMetaLink); recentPostMeta.append(` by `); recentPostMeta.append(recentPostAuthorLink); recentPostMeta.append(` on `); recentPostMeta.append(recentPostDate);
        // Create an HR for later use ...
        const recentPostSeparator = document.createElement("HR"); recentPostSeparator.setAttribute(`class`, `hr medium-article--hr`);
        // Make an array of the HTML objects and prepare them to be added to doc (section container)
        let mediumPostContent = new Array();
        // Medium article title content, title link, and title h3 tag   
        const mediumPostTitleLink = anchorTagFactory(recentPostTitle, [`h3`, `h3--weight-900`, `h3--x-large`, `h3--line-height-medium`, `medium-article--title`, `medium-article--title--link`], recentPostUrl, undefined, undefined, undefined, undefined);
        const mediumPostHeadlineTag = document.createElement('h2');
            mediumPostHeadlineTag.setAttribute('class', 'h3 h3--weight-900 h3--x-large h3--line-height-medium medium-article--title');
            mediumPostHeadlineTag.append(mediumPostTitleLink);
        // Push title to array object
        if (mediumPostHeadlineTag) {
            mediumPostContent.push(mediumPostHeadlineTag);
        }
        // Push article content to array object (in order)
        recentPostEls.forEach((node, index) => {  
            const nodeName = node.nodeName;
            const innerTextNode = '#text';
            const paragraphNode = 'P';
            const title3Node = 'H3';
            const title4Node = 'H4';
            const imageNode = 'IMG';
            const figureNode = 'FIGURE';
            const blockNode = 'BLOCKQUOTE';

            // Ignore the '#text' nodes ...
            if (nodeName !== innerTextNode) {
                // Ignore the 1px x 1px Medium 'Auth' image ...
                if (nodeName == imageNode && (node.height == 1 && node.width == 1)) {
                // Grab everything but the 1px width/height IMG
                } else {
                    // In all content/text nodes, remove all '&nbsp;' spaces, and make sure children
                    // nodes are using site component conventions
                    if (nodeName == title3Node || nodeName == title4Node || nodeName == paragraphNode || nodeName == blockNode) {
                        removeNonBreakingSpacesFactory(node);
                        addAttribsToChildrenFactory(node);
                        // Also make sure parent nodes have correct attribs
                        if (nodeName == title3Node) {
                            node.setAttribute(`class`, `h3 h3--weight-600 h3--large h3--line-height-large`);
                        }
                        if (nodeName == title4Node) {
                            node.setAttribute(`class`, `h4 h4--weight-800 h4--medium h4--line-height-medium`);
                        }
                        if (nodeName == paragraphNode) {
                            node.setAttribute(`class`, paragraphTagClasses.join(` `));
                        }
                        if (nodeName == blockNode) {
                            node.setAttribute(`class`, `medium-article--blockquote p--medium p--dark p--line-height-large p--align-left-mbl`);
                        }
                    }
                    // Give 'figure' components 
                    if (nodeName == figureNode) {
                        node.setAttribute(`class`, `medium-article--image-container`);
                        addAttribsToChildrenFactory(node);
                    }
                    if (index == 0 || index == 1) {
                        if (nodeName == figureNode) {
                            node.setAttribute(`class`, `medium-article--featured-image-container`);
                        }
                    }
                    mediumPostContent.push(node);
                }
            }
        });
        mediumPostContent.push(recentPostSeparator);
        if (recentPostMeta) {
            mediumPostContent.push(recentPostMeta);
        }
        if (recentPostCategories) {
            recentPostCategories.forEach((category, index) => {
                console.log(category);
            });
        }
        mediumPostContent.push(recentPostInterest);

        // Create section container and add a few classes
        const mediumContainer = document.createElement('section');
        mediumContainer.setAttribute(`class`, `section medium-article`);
        // Create section container inner wrapper and add a few classes
        const mediumContainerInner = document.createElement('article');
        mediumContainerInner.setAttribute(`class`, `inner`);
        // Append inner wrapper to parent section container
        mediumContainer.appendChild(mediumContainerInner);
        // Append from mediumPostContent Array (reformatted post content) to newly created section container in order
        mediumPostContent.forEach((node) => {
            // console.log(node);
            mediumContainerInner.appendChild(node);
        });
        // Grab existing main container from document and store it for later use ...
        const mainContainer = document.getElementById('main');
        // Append the new section container and inner wrapper to the existing main container in document
        mainContainer.appendChild(mediumContainer);
    }
}
