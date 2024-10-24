/* 
    MAIN SCRIPTS
    ------------
        Here's where everything comes together.

*/

// Data
import { githubRepoUrlFull, githubCommitsUrlFull, numberOfCommits } from './data/github.mjs';
import { listOfAuthors, bookLink, bookTitle } from './data/openLibrary.mjs';
import { searchUrlFull, currentShoes, currentGear } from './data/openWeather.mjs';
import { spotifyTrackURL, spotifyArtistURL, trackName, trackArtist } from './data/lastFm.mjs';
import { checkDate } from './data/date.mjs';

// Factories
import { paragraphTagFactory } from './factories/paragraphTag.mjs';
import { anchorTagFactory } from './factories/anchorTag.mjs';
import { sentenceGrabberFactory } from './factories/sentenceGrabber.mjs';
import { sentenceDissectorFactory } from './factories/sentenceDissector.mjs';


// Type out big title at top of page with audio ...
const bigTitleElementSelector = `big-title`;
const bigTitle = sentenceGrabberFactory(bigTitleElementSelector);
const bigTitleList = sentenceDissectorFactory(bigTitle);

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
function unhideBigTitle() {
    const bigTitle = document.getElementById(`big-title`);
    bigTitle.style.opacity = `1`;
}
unhideBigTitle();
function typeOutBigTitle (bigTitleElement, bigTitleContent) {
    const bigTitleContentSize = bigTitleContent.length;
    bigTitleContent = bigTitleContent.entries();
    const cursor = document.getElementById(`cursor`);
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))
    let waitTime = randomIntFromInterval(25, 250);
    
    
    const keyPressSound1 = new Audio('./audio/key_press1.wav');
    keyPressSound1.loop = false;
    

    cursor.classList.add('blink');
    const loop = async () => {
        cursor.classList.remove('blink');

        for (let [key, value] of bigTitleContent) {
            // type out each letter in bigTitleContent
            value = document.createTextNode(value);

            if (key < bigTitleContentSize - 1) {
                // // play random audio sound
                // var playPromise = keyPressSound1.play();
                document.getElementById(`big-title`).insertBefore(value, cursor);
                // hold up, wait a second
                waitTime = randomIntFromInterval(75, 100);
                await wait(waitTime);
            }
            if (key == bigTitleContentSize - 1) {
                // play loudest audio sound
                document.getElementById(`big-title`).insertBefore(value, cursor);
            }
        }
        cursor.classList.add('blink');
    }
    loop();
}
typeOutBigTitle(bigTitleElementSelector, bigTitleList);


// Create link objects for later use ...

// Data points ...
const googleMapsLink = anchorTagFactory(`Louisville, KY`, undefined, `//www.google.com/maps/place/Louisville,+KY/@38.1884721,-85.9569664,10z/data=!3m1!4b1!4m6!3m5!1s0x88690b1ab35bd511:0xd4d3b4282071fd32!8m2!3d38.2526647!4d-85.7584557!16zL20vMGZfXzE`, undefined, undefined, undefined, undefined);
const myLinkedInLink = anchorTagFactory(`Jan Michael`, undefined, `//linkedin.com/in/jmwii1981`, undefined, undefined, undefined, undefined);
const myWeatherShoesLink =  anchorTagFactory(`${currentShoes}`, undefined, `${searchUrlFull}`, undefined, undefined, undefined, undefined);
const myWeatherGearLink =  anchorTagFactory(`${currentGear}`, undefined, `${searchUrlFull}`, undefined, undefined, undefined, undefined);
const myBookLink = anchorTagFactory(`${bookTitle}`, undefined, `${bookLink}`, undefined, undefined, undefined, undefined);
let myTrackLink = anchorTagFactory(`${trackName}`, undefined, `${spotifyTrackURL}`, undefined, undefined, undefined, undefined);
let myArtistLink = anchorTagFactory(`${trackArtist}`, undefined, `${spotifyArtistURL}`, undefined, undefined, undefined, undefined);

// Last update links ...
const updateStatus = `Data points last updated just now.`;
const lastUpdated = document.createElement('span');
lastUpdated.setAttribute(`id`, `current-date-time`);
lastUpdated.append(updateStatus);

// Footer links ...
const myVitaLink = anchorTagFactory(`Vita`, [`link`, `link--small`, `link--light`,`link--weight-500`], `//github.com/jmwii1981/vita`, undefined, undefined, undefined, undefined);
const myCCLIcenseLink = anchorTagFactory(`Creative Commons license`, [`link`, `link--small`, `link--light`,`link--weight-500`], `//creativecommons.org/`, undefined, undefined, undefined, undefined);
const myCCLicensureLink = anchorTagFactory(`CC BY-NC 4.0`, [`link`, `link--small`, `link--light`,`link--weight-500`], `//creativecommons.org/licenses/by-nc/4.0/`, undefined, undefined, undefined, undefined);
const myGithubPagesLink = anchorTagFactory(`Github Pages`, [`link`, `link--small`, `link--light`,`link--weight-500`], `https://pages.github.com/`, undefined, undefined, undefined, undefined);
const myGithubCommitsLink = anchorTagFactory(`${numberOfCommits} commits`, [`link`, `link--small`, `link--light`,`link--weight-500`], `${githubCommitsUrlFull}`, undefined, undefined, undefined, undefined);

// Content structured
let myOpening = [
    myLinkedInLink,
];
let myLocation = [
    ` was last seen in `,
    googleMapsLink,
    `, `,
];
let myWeather = [
    ` sporting his `,
    myWeatherShoesLink,
    ` and `,
    myWeatherGearLink,
    `, `,
];
let myReading = [
    ` reading `,
    myBookLink,
    ` by `,
    listOfAuthors,
];
let myMusic = [
    `, and vibing to `,
    myTrackLink,
    ` by `,
    myArtistLink,
    `. `,
];
let myVita = [
        myVitaLink,
        ` is built with `,
        myGithubCommitsLink,
        `. It is hosted with `,
        myGithubPagesLink,
        `, and boasts a `,
        myCCLIcenseLink,
        `: `,
        myCCLicensureLink,
        `.`
];
let lastUpdate = [
    lastUpdated,
];

// Put it all together ..
let fullSentence = [];
// fullSentence.push(myOpening, myLocation, myWeather, myReading, myMusic, myVita, lastUpdate);
fullSentence.push(myOpening, myLocation, myWeather, myReading, myMusic);
fullSentence = fullSentence.flat();

// Create p tag, flatten array, and append to p tag ...
let mySentence = paragraphTagFactory(``);
fullSentence.forEach(element => mySentence.append(element));

// Put another together ...
fullSentence = [];
fullSentence.push(lastUpdate);
fullSentence = fullSentence.flat();
let myLastUpdate = paragraphTagFactory(``,[`content-transition2`, `p`, `p--medium p--dark`, `p--weight-400` , `p--line-height-small`, `p--align-left-mbl`]);
fullSentence.forEach(element => myLastUpdate.append(element));

// Append mySentence to datapoints-content div in document ...
const dataPointsContent = document.getElementById(`datapoints-content`);
dataPointsContent.append(mySentence);
dataPointsContent.append(myLastUpdate);


// Put yet another together ...
fullSentence = [];
fullSentence.push(myVita);
fullSentence = fullSentence.flat();

// Create p tag, flatten array, and append to p tag ...
let myFooterSentence = paragraphTagFactory(``,[`content-transition2`, `p`, `p--x-small p--light`, `p--weight-400` , `p--line-height-small`, `p--align-left-mbl`]);
fullSentence.forEach(element => myFooterSentence.append(element));

//Append footerSentence to footer-content div in document ...
const footerContent = document.getElementById(`footer-content`);
footerContent.append(myFooterSentence);

setInterval(function() {
    let rightNowTime = checkDate().rightNowTime;

    // mySentence = fullSentence.push(myOpening, myLocation, myWeather, myReading, myMusic);
    // mySentence.innerText(mySentence);
    lastUpdated.innerText = `Data points last updated today at ${rightNowTime}.`;

    
}, 1000);











/* SAND BOX */











// "IN VIEW" ANIMATION CUE
// .title-transition
// .content-transition

let titleElementsArray = document.querySelectorAll(".title-transition");
titleElementsArray = Array.from(titleElementsArray);

let contentElementsArray = document.querySelectorAll("[class^=content-transition]");
contentElementsArray = Array.from(contentElementsArray);

let backgroundElementsArray = document.querySelectorAll(".flowers-background");
backgroundElementsArray = Array.from(backgroundElementsArray);

let avatarElementArray = document.querySelectorAll("#avatar");
avatarElementArray = Array.from(avatarElementArray);

let footerLogoElementArray = document.querySelectorAll("#footer-logo");
footerLogoElementArray = Array.from(footerLogoElementArray);

let elementsArray = titleElementsArray.concat(contentElementsArray);
elementsArray = Array.from(elementsArray);
elementsArray = elementsArray.concat(backgroundElementsArray);
elementsArray = Array.from(elementsArray);
elementsArray = elementsArray.concat(avatarElementArray);
elementsArray = Array.from(elementsArray);
elementsArray = elementsArray.concat(footerLogoElementArray);
elementsArray = Array.from(elementsArray);

// console.log(elementsArray);

window.addEventListener('scroll', fadeIn ); 
function fadeIn() {
    for (var i = 0; i < elementsArray.length; i++) {
        var elem = elementsArray[i]
        var distInView = elem.getBoundingClientRect().top - window.innerHeight + 20;
        if (distInView < 0) {
            elem.classList.add("inView");
        } else {
            // elem.classList.remove("inView");
        }
    }
}
fadeIn();











// DETECT SCROLL DIRECTION
// Initial state
let scrollPos = 0;
// adding scroll event
window.addEventListener('scroll', function(){
    // detects new state and compares it with the new one
    if ((document.body.getBoundingClientRect()).top > scrollPos) {
        document.getElementById(`navbar`).setAttribute('data-scroll-direction', 'scrollingUp');
    } else {
        document.getElementById(`navbar`).setAttribute('data-scroll-direction', 'scrollingDown');
    }
    // saves the new position for iteration.
    scrollPos = (document.body.getBoundingClientRect()).top;
});











// NAVIGATION BAR BEHAVIORS
// STICKY NAV AFTER SCROLL
let heroElement = document.getElementById(`hero`);
let heroElementHeight = heroElement.offsetHeight;

let navBarElement = document.getElementById(`navbar`);
let navBarElementTopPosition = navBarElement.offsetTop;
let navBarElementHeight = navBarElement.offsetHeight;
let navBarElementHeightFraction = navBarElementHeight * 0.01;
let navBarElementStoppingPoint = heroElementHeight - navBarElementHeight;

let footerLogoElement = document.getElementById(`footer-logo`);
let footerLogoElementHeight = footerLogoElement.offsetHeight;
let footerLogoElementTopPosition = footerLogoElement.offsetTop;
let footerLogoElementBottomPosition = footerLogoElementTopPosition + footerLogoElementHeight;

let windowTopPosition = window.scrollY;
let windowHeight = window.innerHeight;
let windowBottomPosition = windowTopPosition + windowHeight ;

// want to get the position of the top of the navbar within 0 to 70 while scrolling over footer logo
let x = windowTopPosition - windowBottomPosition + windowHeight;

window.addEventListener('scroll', stickToTop);
function stickToTop() {
    heroElement = document.getElementById(`hero`);
    heroElementHeight = heroElement.offsetHeight;
    navBarElement = document.getElementById(`navbar`);
    navBarElementTopPosition = navBarElement.offsetTop;
    navBarElementHeight = navBarElement.offsetHeight;
    navBarElementHeightFraction = navBarElementHeight * 0.01;
    navBarElementStoppingPoint = heroElementHeight - navBarElementHeight;
    footerLogoElement = document.getElementById(`footer-logo`);
    footerLogoElementHeight = footerLogoElement.offsetHeight;
    footerLogoElementTopPosition = footerLogoElement.offsetTop;
    footerLogoElementBottomPosition = footerLogoElementTopPosition + footerLogoElementHeight;
    windowTopPosition = window.scrollY;
    windowHeight = window.innerHeight;
    windowBottomPosition = windowTopPosition + windowHeight ;

    // console.log(`footerLogoElementHeight = ${footerLogoElementHeight}`);
    // console.log(`footerLogoElementTopPosition = ${footerLogoElementTopPosition}`);
    // console.log(`--------------`);
    // console.log(`windowTopPosition = ${windowTopPosition}`);
    // console.log(`windowHeight = ${windowHeight}`);
    // console.log(`windowBottomPosition = ${windowBottomPosition}`);

    // IF NOT STICKY
    if (navBarElement.classList.contains("sticky") == false) {
        // MAKE STICKY
        if ( navBarElementTopPosition < windowTopPosition ) {
            // sticky position
            navBarElement.classList.add("sticky");
            // lives at top of screen
            navBarElement.style.top = "0px";
            navBarElement.style.transform = "translateY(0px)";
        }
    }

    // IF STICKY
    if (navBarElement.classList.contains("sticky") == true) {
        // MAKE NOT STICKY
        if (navBarElementStoppingPoint >= windowTopPosition) {
            // default position
            navBarElement.classList.remove("sticky");
            // lives at bottom of hero
            navBarElement.style.top = "calc(100vh - 7rem)";
            navBarElement.style.transform = "translateY(0px)";
        } else {
        // IF STILL STICKY ... MAKE SOME CHANGES WHILE ...
            // ... IF SCROLLING DOWN
            if (navBarElement.getAttribute('data-scroll-direction') == 'scrollingDown') {
                if (windowBottomPosition >= footerLogoElementTopPosition && windowBottomPosition < footerLogoElementBottomPosition) {
                    let reducingValue = windowBottomPosition - footerLogoElementBottomPosition;
                    let x = ((reducingValue + footerLogoElementHeight) * -1) - 1;
                    x = x / footerLogoElementHeight;
                    x = x * 100 * navBarElementHeightFraction;
                    x = Math.floor(x);
                    navBarElement.style.transform = `translateY(${x}px)`;
                }
                if (windowBottomPosition >= footerLogoElementTopPosition && windowBottomPosition > footerLogoElementBottomPosition) {
                    // navBarElement.style.top = `${-navBarElementHeight}px`;
                    navBarElement.style.transform = `translateY(${-navBarElementHeight}px)`;
                }
            }

            // ... IF SCROLLING UP
            if (navBarElement.getAttribute('data-scroll-direction') == 'scrollingUp') {
                // IF BOTTOM OF WINDOW LOCATION IS FURTHER UP THE PAE THAN THE FOOTER LOGO'S TOP AND BOTTOM
                if (windowBottomPosition >= footerLogoElementTopPosition && windowBottomPosition < footerLogoElementBottomPosition) {
                    let increasingValue = windowBottomPosition - footerLogoElementBottomPosition;
                    let x = footerLogoElementHeight + increasingValue;
                    x = x / footerLogoElementHeight;
                    x = x * 100 * navBarElementHeightFraction;
                    x = Math.floor(x) * -1;
                    // INCREMENTALLY INCREASE THE TOP CSS VALUE
                    navBarElement.style.top = `${x}px`;
                    // INCREMENTALLY INCREASE THE TRANSLATEY CSS VALUE
                    navBarElement.style.transform = `translateY(${x}px)`;
                }
                // IF BOTTOM OF WINDOW LOCATION IS WITHIN THE LOGO DIMENSIONS ...
                if (windowBottomPosition < footerLogoElementTopPosition && windowBottomPosition < footerLogoElementTopPosition) {
                    // RESET TRANSLATEY CSS VALUE
                    navBarElement.style.transform = `translateY(${footerLogoElementHeight - footerLogoElementHeight}px)`;
                    // RESET TOP CSS VALUE
                    navBarElement.style.top = `0px`;
                }
            }
        }
    }
}
stickToTop();









// READING PROGRESS BAR
function processScroll() {
    let docElem = document.documentElement;
    let docBody = document.body;
    let scrollTop = docElem['scrollTop'] || docBody['scrollTop'];
    let scrollBottom = (docElem['scrollHeight'] || docBody['scrollHeight']) - window.innerHeight;
    let scrollPercent = scrollTop / scrollBottom * 100 + '%';
    
    document.getElementById("progress-bar").style.setProperty("--scrollAmount", scrollPercent); 
}
processScroll();
document.addEventListener('scroll', processScroll);

const aboutFlowers = document.getElementById('about-flowers');
new simpleParallax(aboutFlowers, {
    delay: 0,
    orientation: 'down',
    scale: 1.2,
    transition: 'ease'
});
const datapointsFlowers = document.getElementById('datapoints-flowers');
new simpleParallax(datapointsFlowers, {
    delay: 0,
    orientation: 'up',
    scale: 1.2,
    transition: 'ease'
});










// FOOTER STARS
// function generateRandomPercent(min = 0, max = 100) {
//     const randomInteger = Math.floor(Math.random() * (max + 1));
//     return `${randomInteger}%`;
// }
// function generateRadomDelay(interval = 1) {
//     const randomInteger = Math.random() * (interval + 1);
//     return `${randomInteger}s`;
// }

// function createStar() {
// const star = document.createElement(`div`);
//         star.classList.add(`star`);
//         star.style.top = generateRandomPercent();
//         star.style.left = generateRandomPercent();
//         star.style.animationDelay = generateRadomDelay();
//     return star;
// }

// function renderStars(amount = 30) {
//     const container = document.getElementById("footer-stars");
//     const placeholdersArray = Array(amount).fill("star_placeholder");
//     const starsArray = placeholdersArray.map((starPlacholder, index) => createStar());
//     container.prepend(...starsArray);
// }

// renderStars();











// APPLE TV EFFECT
const cards = document.querySelectorAll(`.wobble`);
const card = document.querySelector(`.wobble`);

cards.forEach(function(item) {
    const shineLayer = document.createElement(`div`);
        shineLayer.classList.add(`shineLayer`);
        item.append(shineLayer);

        item.addEventListener('mousemove', cardOnMouseMove);
        item.addEventListener('mouseenter', cardOnMouseEnter);
        item.addEventListener('mouseleave', cardOnMouseLeave);
});

function cardOnMouseMove(event) {
    const card = this;
    const cardImage = card.getElementsByTagName(`img`)[0];

    const mouseCoord = {
        x: event.offsetX,
        y: event.offsetY
    };
        mouseCoord.x = mouseCoord.x < 0 ? 0 : mouseCoord.x;
        mouseCoord.x = mouseCoord.x > card.offsetWidth ? card.offsetWidth : mouseCoord.x;
        mouseCoord.y = mouseCoord.y < 0 ? 0 : mouseCoord.y;
        mouseCoord.y = mouseCoord.y > card.offsetHeight ? card.offsetHeight : mouseCoord.y;
        
    
    let transformCard = `scale3d(1.05, 1.05, 1.05) perspective(700px)`;
        transformCard += ``;
        transformCard += `rotateX(${((mouseCoord.y / card.offsetHeight) * 18 ) - 9}deg)`;
        transformCard += ``;
        transformCard += `rotateY(${(((mouseCoord.x / card.offsetWidth) * 26) - 13) * -1}deg)`;
        transformCard += ``;
        transformCard += `translateX(${(((mouseCoord.x / card.offsetWidth) * 6) - 3)}px)`;
        transformCard += ``;
        transformCard += `translateY(${(((mouseCoord.y / card.offsetHeight) * 10 ) - 5)}px)`;

        card.style.transform = transformCard;

    
    let transformCardImage = `rotateX(${((((mouseCoord.y / card.offsetHeight) * 10) - 5) * -1)}deg)`;
        transformCardImage += ``;
        transformCardImage += `rotateY(${((((mouseCoord.x / card.offsetWidth) * 26) - 13) * -1)}deg)`;

        cardImage.style.transform = transformCardImage;

    const shineLayer = card.getElementsByClassName(`shineLayer`)[0];

    let backgroundShineLayerOpacity = ((mouseCoord.y / card.offsetHeight) * 0.3) + 0.1;
    let backgroundShineLayerDegree = (Math.atan2(mouseCoord.y - (card.offsetHeight/2), mouseCoord.x - (card.offsetWidth/2)) * 180/Math.PI) - 90;
        backgroundShineLayerDegree = backgroundShineLayerDegree < 0 ? backgroundShineLayerDegree += 360 : backgroundShineLayerDegree

    let backgroundShineLayer = `linear-gradient(${backgroundShineLayerDegree}deg, rgba(255, 255, 255, ${backgroundShineLayerOpacity}) 0%, rgba(255, 255, 255, 0) 80%)`;
        
        shineLayer.style.background = backgroundShineLayer;
};

function cardOnMouseEnter() {
    cards.forEach(function(item) {
        item.classList.add(`blur`);
    });
    this.classList.remove(`blur`);
    this.classList.add(`highlight`);
}

function cardOnMouseLeave() {
    const card = this;
    const cardImage = card.getElementsByTagName(`img`)[0];
    const shineLayer = card.getElementsByClassName(`shineLayer`)[0];
    // Resets
        card.classList.remove(`highlight`);
        card.style.transform = `scale3d(1, 1, 1)`;
        cardImage.style.transform = ``;
        shineLayer.style.background = `linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 80%)`;
        cards.forEach(function(item) {
            item.classList.remove(`blur`);
        });
}