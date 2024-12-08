// ==UserScript==
// @name        Price Decrapifier
// @description A userscript that automatically rounds and formats prices on various e-commerce websites for better readability
// @author      BillyCool
// @namespace   BillyCool
// @version     0.1
// @match       *://*.amazon.*/*
// @match       *://*.ebay.*/*
// @match       *://*.neokyo.com/*
// @match       *://*.ozbargain.com.au/*
// @require     https://gist.githubusercontent.com/BillyCool/f3655a94477908127525232d85be2ae5/raw/
// @homepageURL https://github.com/BillyCool/UserScripts/tree/master/Price-Decrapifier
// @downloadURL https://github.com/BillyCool/UserScripts/raw/master/Price-Decrapifier/price-decrapifier.user.js
// @copyright   GPL-3.0-or-later
// @grant       none
// @run-at      document-start
// @inject-into content
// ==/UserScript==

// Variable to enable/disable debug messages
const isDebugEnabled = true;

// Function to write debug messages to the console
const writeDebugLog = (message) => {
    if (isDebugEnabled) {
        console.debug(message);
    }
};

// Function to round the price
const roundPrice = (price) => {
    if (price === 0) return 0;

    let roundedPrice;
    const cents = price % 1;

    if (price < 1) {
        roundedPrice = cents <= 0.50 ? 0.50 : 1.00;
    } else if (price > 1 && price < 2) {
        roundedPrice = cents <= 1.50 ? 1.50 : 2.00;
    } else if (price < 10) {
        roundedPrice = Math.round(price);
    } else {
        roundedPrice = Math.round(price);
        if (roundedPrice % 10 === 9) {
            roundedPrice += 1;
        }
    }

    return roundedPrice;
};

// Function to decrapify price elements
const decrapifyPrice = (element, offset = 0) => {
    const priceText = element.textContent;
    const priceValue = parseFloat(priceText.replace(/[^0-9.]/g, ''));

    if (!isNaN(priceValue)) {
        const roundedPrice = roundPrice(priceValue) + offset;
        const formattedRoundedPrice = roundedPrice % 1 ? roundedPrice.toFixed(2) : roundedPrice.toFixed(0);

        writeDebugLog(`Price text: ${priceText}, Price value: ${priceValue}, Rounded price: ${formattedRoundedPrice}`);
        if (priceValue !== roundedPrice) {
            const priceRegex = new RegExp(priceValue.toFixed(priceValue % 1 ? 2 : 0).replace('.', '\\.'), 'g');
            element.textContent = priceText.replace(priceRegex, formattedRoundedPrice);
            element.title = priceText;
        }
    }
};

// Function to decrapify cents price part
const decrapifyPriceCents = (element) => {
    const centsText = element.textContent;
    const centsValue = parseFloat(`0.${centsText.replace(/[^0-9]/g, '')}`);

    if (!isNaN(centsValue)) {
        const roundedCents = roundPrice(centsValue);
        const formattedRoundedCents = (roundedCents % 1).toFixed(2).split('.')[1];

        writeDebugLog(`Cents text: ${centsText}, Cents value: ${centsValue}, Rounded cents: ${formattedRoundedCents}`);
        if (centsValue !== roundedCents) {
            element.textContent = formattedRoundedCents;
            element.title = centsText;
            return roundedCents >= 100;
        }
    }
    return false;
};

// Observe the DOM for price elements
const url = window.location.hostname;

// Amazon
if (url.includes('amazon')) {
    onElementReady('.a-price-whole', false, false, (element) => {
        const centsElement = element.nextElementSibling;
        const offset = decrapifyPriceCents(centsElement) ? 1 : 0;
        decrapifyPrice(element, offset);
    });
    onElementReady('.a-text-price > span:not(.a-offscreen)', false, false, decrapifyPrice);
}
// eBay
else if (url.includes('ebay')) {
    onElementReady(['.s-item__price', '.s-item__shipping'], false, false, decrapifyPrice);
    onElementReady(['.x-price-primary > span', '.x-price-approx__price > span', '.ux-labels-values--shipping .ux-textspans--BOLD', '.DHDn > span'], false, false, decrapifyPrice);
}
// Neokyo
else if (url.includes('neokyo')) {
    onElementReady('.buy .interval', false, true, decrapifyPrice);
}
// OzBargain
else if (url.includes('ozbargain')) {
    onElementReady('.dollar', false, true, decrapifyPrice);
}