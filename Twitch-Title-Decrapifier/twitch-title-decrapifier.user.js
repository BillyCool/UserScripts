// ==UserScript==
// @name        Twitch Title Decrapifier
// @description A script to decrapify Twitch stream titles
// @author      BillyCool
// @namespace   BillyCool
// @version     1.0
// @match       https://www.twitch.tv/*
// @homepageURL https://github.com/BillyCool/UserScripts/tree/master/Twitch-Title-Decrapifier
// @downloadURL https://github.com/BillyCool/UserScripts/raw/master/Twitch-Title-Decrapifier/twitch-title-decrapifier.user.js
// @copyright   GPL-3.0-or-later
// @grant       none
// @icon        https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// ==/UserScript==

const prefixesToExclude = ["!", "#", "|", "-", "http"];
const keywordsToExclude = ["giveaway", "subathon", "click", "drops"];

String.prototype.toProperCase = function () {
    return this.replace(/(\p{L}|\d)(\p{L}*)/gu, (txt, firstChar, rest) => {
        return firstChar.toUpperCase() + rest.toLowerCase();
    });
};

// The MutationObserver callback function
function handleMutation(mutationsList) {
    const selector = 'a[data-a-target="preview-card-channel-link"] h3, .channel-info-content h2[data-a-target="stream-title"], .online-side-nav-channel-tooltip__body > p';
    mutationsList.forEach((mutation) => {
        const matches = [mutation.target, ...mutation.target.querySelectorAll(selector)].filter(el => el.matches(selector));
        matches.forEach(match => {
            const newTitle = match.textContent.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, ' ')
                .split(' ')
                .filter(x => !prefixesToExclude.some(prefix => x.toLowerCase().startsWith(prefix)) && !keywordsToExclude.some(keyword => x.toLowerCase().includes(keyword)))
                .join(' ')
                .trim()
                .toProperCase();

            if (match.textContent !== newTitle) {
                match.textContent = newTitle;
            }
        });
    });
}

// Create a MutationObserver instance with the callback function
const observer = new MutationObserver(handleMutation);

// Start observing the entire document and all mutations
observer.observe(document.documentElement, {
    attributes: true,
    childList: true,
    subtree: true,
});