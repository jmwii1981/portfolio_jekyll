/*
    LAST FM API 
    Dev Docs: 

    ----------------
    STRUCTURES
        •   Thing 1
            • Thing 2
*/
import { urlBaseFactory } from '../factories/urlBase.mjs';
import { urlAssimilationFactory } from '../factories/urlAssimilation.mjs';
import { apiFetchFactory } from '../factories/apiFetch.mjs';

// LF SPOTIFY SEARCH URL
let spotifySearchiUrl = {
    base: {
        protocol: undefined,
        tertiaryDomain: `open`,
        secondaryDomain: `spotify`,
        topDomain: `com`,
    },
    paths: [
        `search`,
    ],
};
spotifySearchiUrl.base = Object.values(spotifySearchiUrl.base);
const spotifySearchiUrlBase = urlBaseFactory(...spotifySearchiUrl.base);
const spotifySearchiUrlFull = urlAssimilationFactory(spotifySearchiUrlBase, spotifySearchiUrl.paths, spotifySearchiUrl.params);

// LF API TRACK URL
let apiUrl = {
    base: {
        protocol: undefined,
        tertiaryDomain: `ws`,
        secondaryDomain: `audioscrobbler`,
        topDomain: `com`,
    },
    paths: [
        `2.0`,
    ],
    params: {
        user: `jmwii1981`,
		api_key: `3f05be6c065c84dffd06fc4306e60ef4`,
		format: `json`,
		method: `user.getrecenttracks`,
		limit: `1`,
	},
};
apiUrl.base = Object.values(apiUrl.base);
const apiUrlBase = urlBaseFactory(...apiUrl.base);
const apiUrlFull = urlAssimilationFactory(apiUrlBase, apiUrl.paths, apiUrl.params);

// Getting and storing OL results for later ...
let result = await apiFetchFactory(apiUrlFull);
result = result.apiData;

// Making the OL results useful ...
const recentTrack = result.recenttracks.track[0];
const trackName = recentTrack.name;
// const trackURL = new URL(recentTrack.url).toString();
const trackArtist = recentTrack.artist["#text"];
const spotifyTrackURL = new URL(`${spotifySearchiUrlFull}/${trackName} by ${trackArtist}`).toString();
const spotifyArtistURL = new URL(`${spotifySearchiUrlFull}/${trackArtist}`).toString();

// Export values for later use ...
export { trackName, trackArtist, spotifyTrackURL, spotifyArtistURL };