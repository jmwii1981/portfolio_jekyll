/*
    OPEN LIBRARY API 
    Dev Docs: https://openlibrary.org/developers/api

    ----------------
    STRUCTURES
        • openLibrary
            • apiUrl
            • searchUrl
*/
import { urlBaseFactory } from '../factories/urlBase.mjs';
import { urlAssimilationFactory } from '../factories/urlAssimilation.mjs';
import { apiFetchFactory } from '../factories/apiFetch.mjs';
import { anchorTagFactory } from '../factories/anchorTag.mjs';

// OL API URL
let apiUrl = {
    base: {
        protocol: undefined,
        tertiaryDomain: ``,
        secondaryDomain: `openlibrary`,
        topDomain: `org`,
    },
    paths: [
        // `developers`,
        // `api`,
        `people`,
        `jmwii1981`,
        `books`,
        `currently-reading.json`,
    ],
    params: {},
};
apiUrl.base = Object.values(apiUrl.base);
const apiUrlBase = urlBaseFactory(...apiUrl.base);
const apiUrlFull = urlAssimilationFactory(apiUrlBase, apiUrl.paths, apiUrl.params);

// Getting and storing OL results for later ...
let result = await apiFetchFactory(apiUrlFull);
result = result.apiData;

// Getting and storing OL book title for later ...
const bookTitle = result.reading_log_entries[0].work.title;

// Getting, creating, and storing OL book link for later ...
const bookEndpoint = result.reading_log_entries[0].work.key;
const bookEndpointSanitized = bookEndpoint.replace(/\//, ``).toString();
const bookLink = `${apiUrlBase}/${bookEndpointSanitized}`;
let bookUrl = {
    // may do this later so that you have a proper link object
};

// Author's Name
let bookAuthorNamesList = new Array();
const bookAuthorNames = result.reading_log_entries[0].work.author_names; // returns object
for (let i = 0; i < bookAuthorNames.length; i++) {
    bookAuthorNamesList.push(bookAuthorNames[i]);
}

// Author's Page link
let bookAuthorEndpointsList = new Array();
const bookAuthorsEndpoints = result.reading_log_entries[0].work.author_keys; // returns object
for (let i = 0; i < bookAuthorsEndpoints.length; i++) {
    bookAuthorEndpointsList.push(bookAuthorsEndpoints[i]);
}

// List of Author's names and page links for later ...
let listOfAuthors = function() {
    let bookAuthorNamesAndLinks = new Array();
    if (bookAuthorNamesList.length == bookAuthorEndpointsList.length) {
        for (let i = 0; i < bookAuthorNamesList.length; i++) {
            let keys = bookAuthorNamesList[i];
            let values = bookAuthorEndpointsList[i];
            bookAuthorNamesAndLinks[keys] = `${apiUrlBase}${values}`;
            
            i = Object.entries(bookAuthorNamesAndLinks).length;
            for (const [key, value] of Object.entries(bookAuthorNamesAndLinks)) {
                i = i -1;
                let authorLink = ``;
                if (i == 0) {
                    authorLink = anchorTagFactory(`${key}`, undefined, `${value}`, undefined, undefined, undefined, undefined);
                } else {
                    authorLink = anchorTagFactory(`${key}`, undefined, `${value}`, undefined, undefined, undefined, undefined);
                }
                return authorLink;
            }
        }
    }

}
listOfAuthors = listOfAuthors();

// Export values for later use ...
export { bookTitle, bookLink, listOfAuthors }


