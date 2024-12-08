// ==UserScript==
// @name        Price Decrapifier
// @description A userscript that automatically rounds and formats prices on various e-commerce websites for better readability
// @author      BillyCool
// @namespace   BillyCool
// @version     0.2
// @match       *://*.amazon.*/*
// @match       *://*.ebay.*/*
// @match       *://*.neokyo.com/*
// @match       *://*.ozbargain.com.au/*
// @match       *://*.skroutz.gr/*
// @require     https://gist.githubusercontent.com/BillyCool/f3655a94477908127525232d85be2ae5/raw/
// @homepageURL https://github.com/BillyCool/UserScripts/tree/master/Price-Decrapifier
// @downloadURL https://github.com/BillyCool/UserScripts/raw/master/Price-Decrapifier/price-decrapifier.user.js
// @copyright   GPL-3.0-or-later
// @grant       none
// @run-at      document-end
// @inject-into content
// ==/UserScript==

// Variable to enable/disable debug messages
const isDebugEnabled = true;

// Function to write debug messages to the console
const writeDebugLog = (message) => isDebugEnabled && console.debug(message);

// Function to round the price
const roundPrice = (price) => {
    if (price === 0) return 0;

    const cents = price % 1;
    if (price < 1) return cents <= 0.50 ? 0.50 : 1.00;
    if (price > 1 && price < 2) return cents <= 1.50 ? 1.50 : 2.00;

    let roundedPrice = Math.round(price);
    if (roundedPrice > 100) {
        const threshold = roundedPrice > 1000 ? 90 : 95;
        const remainder = roundedPrice % 100;
        roundedPrice = remainder >= threshold ? Math.ceil(roundedPrice / 100) * 100 : roundedPrice;
    }
    if (roundedPrice > 10 && roundedPrice % 10 === 9) {
        roundedPrice += 1;
    }

    return roundedPrice;
};

// Function to parse price string to a float value
const parsePrice = (priceText) => {
    // Remove any non-numeric characters except for '.' and ','. Remove dots and commas at the start and end of the value.
    let cleanedText = priceText.replace(/[^0-9.,]/g, '').replace(/^[.,]+|[.,]+$/g, '');

    // Check if the format is European (comma as decimal separator)
    const isEuropeanFormat = cleanedText.includes('.') && cleanedText.includes(',')
        ? cleanedText.indexOf(',') > cleanedText.indexOf('.')
        : cleanedText.includes('.') ? /\.\d{3}$/.test(cleanedText) : !/,\d{3}$/.test(cleanedText);

    writeDebugLog(`Price text: ${priceText}, Cleaned text: ${cleanedText}, Is European format: ${isEuropeanFormat}`);

    // Replace thousand separators and convert to float
    return parseFloat(isEuropeanFormat
        ? cleanedText.replace(/\./g, '').replace(',', '.')
        : cleanedText.replace(/,/g, ''));
};

// Function to extract prefix from price text
const extractPrefix = (priceText) => (priceText.match(/^\D*/) || [''])[0];

// Function to extract suffix from price text
const extractSuffix = (priceText) => (priceText.match(/\D*$/) || [''])[0];

// Function to decrapify price elements
const decrapifyPrice = (element, offset = 0) => {
    const priceText = element.textContent;
    const priceValue = parsePrice(priceText);

    if (!isNaN(priceValue)) {
        const roundedPrice = roundPrice(priceValue) + offset;
        const formattedRoundedPrice = roundedPrice.toLocaleString();

        const prefix = extractPrefix(priceText);
        const suffix = extractSuffix(priceText);

        writeDebugLog(`Price text: ${priceText}, Price value: ${priceValue}, Rounded price: ${formattedRoundedPrice}, Prefix: ${prefix}, Suffix: ${suffix}`);
        if (priceValue !== roundedPrice) {
            element.textContent = `${prefix}${formattedRoundedPrice}${suffix}`;
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
            return roundedCents >= 100 ? 1 : 0;
        }
    }
    return 0;
};

// Observe the DOM for price elements
const siteConfigs = {
    amazon: {
        selectors: ['.a-text-price > span:not(.a-offscreen)'],
        splitValueSelectors: ['.a-price-whole'],
        runOnce: false,
        findOnce: false
    },
    ebay: {
        selectors: ['.s-item__price', '.s-item__shipping', '.x-price-primary > span', '.x-price-approx__price > span', '.ux-labels-values--shipping .ux-textspans--BOLD', '.DHDn > span'],
        splitValueSelectors: [],
        runOnce: false,
        findOnce: false
    },
    neokyo: {
        selectors: ['.buy .interval'],
        splitValueSelectors: [],
        runOnce: false,
        findOnce: true
    },
    ozbargain: {
        selectors: ['.dollar'],
        splitValueSelectors: [],
        runOnce: false,
        findOnce: true
    },
    skroutz: {
        selectors: ['.sku-card-price a'],
        splitValueSelectors: [],
        runOnce: false,
        findOnce: true
    }
};

Object.keys(siteConfigs).forEach(site => {
    if (window.location.hostname.includes(site)) {
        const config = siteConfigs[site];
        config.selectors.forEach(selector => {
            onElementReady(selector, config.runOnce, config.findOnce, decrapifyPrice);
        });
        config.splitValueSelectors.forEach(selector => {
            onElementReady(selector, config.runOnce, config.findOnce, (element) => {
                const offset = decrapifyPriceCents(element.nextElementSibling);
                decrapifyPrice(element, offset);
            });
        });
    }
});