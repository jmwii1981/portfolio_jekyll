/*
    GITHUB API 
    Dev Docs: 

    ----------------
    STRUCTURES
        •   Thing 1
            • Thing 2
*/
import { urlBaseFactory } from '../factories/urlBase.mjs';
import { urlAssimilationFactory } from '../factories/urlAssimilation.mjs';
import { apiFetchFactory } from '../factories/apiFetch.mjs';

// GH REPO URL
let githubRepoUrl = {
    base: {
        protocol: undefined,
        tertiaryDomain: ``,
        secondaryDomain: `github`,
        topDomain: `com`,
    },
    paths: [
        `jmwii1981`,
        `vita`,
    ],
};
githubRepoUrl.base = Object.values(githubRepoUrl.base);
const githubRepoUrlBase = urlBaseFactory(...githubRepoUrl.base);
const githubRepoUrlFull = urlAssimilationFactory(githubRepoUrlBase, githubRepoUrl.paths, githubRepoUrl.params);

// GH COMMITS URL
let githubCommitsUrl = {
    base: {
        protocol: undefined,
        tertiaryDomain: ``,
        secondaryDomain: `github`,
        topDomain: `com`,
    },
    paths: [
        `jmwii1981`,
        `vita`,
        `commits`,
        `main`,
    ],
};
githubCommitsUrl.base = Object.values(githubCommitsUrl.base);
const githubCommitsUrlBase = urlBaseFactory(...githubCommitsUrl.base);
const githubCommitsUrlFull = urlAssimilationFactory(githubCommitsUrlBase, githubCommitsUrl.paths, githubCommitsUrl.params);

// GH API URL (NEW)
let apiUrl = {
    base: {
        protocol: undefined,
        tertiaryDomain: `api`,
        secondaryDomain: `github`,
        topDomain: `com`,
    },
    paths: [
        `repos`,
        `jmwii1981`,
        `vita`,
        `commits`,
    ],
    params: {
        per_page: `1`,
    },
};
apiUrl.base = Object.values(apiUrl.base);
const apiUrlBase = urlBaseFactory(...apiUrl.base);
const apiUrlFull = urlAssimilationFactory(apiUrlBase, apiUrl.paths, apiUrl.params);

// Getting and storing GH results for later ...
let result = await apiFetchFactory(apiUrlFull);
result = result.apiHeaders.link;

// Making the GH results useful ...
result = result.split(`, `).pop().replace(/<|>|;|rel=|"|last/gi, ``).trim().toString();
result = new URL(result);
const numberOfCommits = result.searchParams.get(`page`);

// Export values for later use ...
export { githubRepoUrlFull, githubCommitsUrlFull, numberOfCommits };