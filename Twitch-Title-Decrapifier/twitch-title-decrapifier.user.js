// ==UserScript==
// @name        Twitch Title Decrapifier
// @description A userscript that cleans up Twitch stream titles by removing unwanted characters and keywords, making them more readable
// @author      BillyCool
// @namespace   BillyCool
// @version     1.4
// @match       https://www.twitch.tv/*
// @require     https://gist.githubusercontent.com/BillyCool/f3655a94477908127525232d85be2ae5/raw/
// @homepageURL https://github.com/BillyCool/UserScripts/tree/master/Twitch-Title-Decrapifier
// @downloadURL https://github.com/BillyCool/UserScripts/raw/master/Twitch-Title-Decrapifier/twitch-title-decrapifier.user.js
// @copyright   GPL-3.0-or-later
// @grant       none
// @icon        https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// ==/UserScript==

const prefixesToExclude = ["!", "#", "|", "-", "http"];
const keywordsToExclude = ["giveaway", "subathon", "click", "drops", "subtember", "discount", "donothon", "onlyfangs"];

String.prototype.toTitleCase = function () {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};

// Function to decrapify Twitch stream titles
function decrapifyTwitchTitles(element) {
    const newTitle = element.textContent.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]|\uFE0F)/g, ' ')
        .split(' ')
        .map(x => x.trim())
        .filter(x => x !== '' && !prefixesToExclude.some(prefix => x.toLowerCase().startsWith(prefix)) && !keywordsToExclude.some(keyword => x.toLowerCase().includes(keyword)))
        .map(x => x.toTitleCase())
        .join(' ');

    if (element.textContent !== newTitle) {
        element.textContent = newTitle;
    }
}

// Observe the DOM for the Twitch stream title elements
onElementReady(['a[data-a-target="preview-card-channel-link"] h3', '.channel-info-content p[data-a-target="stream-title"]', '.online-side-nav-channel-tooltip__body > p', '.side-nav-guest-star-tooltip__body > p'], false, false, decrapifyTwitchTitles);