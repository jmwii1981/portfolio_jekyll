/*
    OPEN WEATHER API 
    Dev Docs: https://openweathermap.org/api/one-call-3

    ----------------
    STRUCTURES
        • openWeather
            • apiUrl
            • searchUrl
*/
import { urlBaseFactory } from '../factories/urlBase.mjs';
import { urlAssimilationFactory } from '../factories/urlAssimilation.mjs';
import { apiFetchFactory } from '../factories/apiFetch.mjs';

// OW API URL
let apiUrl = {
    base: {
        protocol: undefined,
        tertiaryDomain: `api`,
        secondaryDomain: `openweathermap`,
        topDomain: `org`,
    },
    paths: [
        `data`,
        `3.0`,
        `onecall`,
    ],
    params: {
        lat: '38.2861312',
        lon: '85.573632',
        appid: '8897df81f0acb0d4892ee144c8635429',
        units: 'imperial',
    },
};
apiUrl.base = Object.values(apiUrl.base);
const apiUrlBase = urlBaseFactory(...apiUrl.base);
const apiUrlFull = urlAssimilationFactory(apiUrlBase, apiUrl.paths, apiUrl.params);

// Getting and storing results for later
let result = await apiFetchFactory(apiUrlFull);
result = result.apiData;
const current = result.current;
const currentTemp = Math.round(Number(current.temp));
const currentConditions = current.weather[0].main;

// OW Search URL
let searchUrl = {
    base: {
        protocol: undefined,
        tertiaryDomain: undefined,
        secondaryDomain: `openweathermap`,
        topDomain: `org`,
    },
    paths: [
        `city`,
        `4296212`
    ],
    params: {},
};
searchUrl.base = Object.values(searchUrl.base);
const searchUrlBase = urlBaseFactory(...searchUrl.base);
const searchUrlFull = urlAssimilationFactory(searchUrlBase, searchUrl.paths, searchUrl.params);

// Making the OW results useful ...
let currentShoes = ``;
switch(true) {
    case currentTemp < 32:
        currentShoes = `winter boots`;
        break;
    case currentTemp <= 45:
        currentShoes = `boots`;
        break;
    case currentTemp <= 70:
        currentShoes = `kicks`;
        break;
    case currentTemp <= 105:
        currentShoes = `flip-flops`;
        break;
    case currentTemp > 105:
        currentShoes = `barefoot`;
        break;

    default:
        currentShoes = `kicks`;
        break;
}
let currentGear = ``;
switch(true) {
    case currentConditions == `Thunderstorm`:
        currentGear = `raincoat`;
        break;
    case currentConditions == `Drizzle`:
        currentGear = `windbreaker`;
        break;
    case currentConditions == `Rain`:
        currentGear = `umbrella`;
        break;
    case currentConditions == `Snow`:
        currentGear = `heavy coat`;
        break;
    case currentConditions == `Mist`:
        currentGear = `light fleece`;
        break;
    case currentConditions == `Smoke`:
        currentGear = `face mask`;
        break;
    case currentConditions == `Haze`:
        currentGear = `flashlight`;
        break;
    case currentConditions == `Fog`:
        currentGear = `flashlight`;
        break;
    case currentConditions == `Sand`:
        currentGear = `face wrap`;
        break;
    case currentConditions == `Dust`:
        currentGear = `face mask`;
        break;
    case currentConditions == `Ash`:
        currentGear = `face wrap`;
        break;
    case currentConditions == `Squall`:
        currentGear = `bomber jacket`;
        break;
    case currentConditions == `Tornado`:
        currentGear = `hazmat suit`;
        break;        
    case currentConditions == `Clear`:
        currentGear = `shades`;
        break;
    case currentConditions == `Clouds`:
        currentGear = `baseball cap`;
        break;
    default:
        currentGear = `baseball cap`;
        break;
}

// Export values for later use ...
export { searchUrlFull, currentShoes, currentGear };