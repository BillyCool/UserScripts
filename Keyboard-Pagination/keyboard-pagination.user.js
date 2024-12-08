// ==UserScript==
// @name        Keyboard Pagination
// @description A userscript to navigate through paginated content on various websites using keyboard arrow keys
// @author      BillyCool
// @namespace   BillyCool
// @version     1.1
// @match       *://*.amazon.*/*
// @match       *://*.ebay.*/*
// @match       *://*.github.com/*
// @match       *://*.neokyo.com/*
// @match       *://*.ozbargain.com.au/*
// @require     https://gist.githubusercontent.com/BillyCool/f3655a94477908127525232d85be2ae5/raw/
// @homepageURL https://github.com/BillyCool/UserScripts/tree/master/Keyboard-Pagination
// @downloadURL https://github.com/BillyCool/UserScripts/raw/master/Keyboard-Pagination/keyboard-pagination.user.js
// @copyright   GPL-3.0-or-later
// @grant       none
// @run-at      document-body
// @inject-into content
// ==/UserScript==

// Variable to enable/disable debug messages
let isDebugEnabled = false;

// Key codes for arrow keys
const PREV_KEY = 'ArrowLeft';
const NEXT_KEY = 'ArrowRight';

// Function to write debug messages to the console
function writeDebugLog(message) {
    if (isDebugEnabled) {
        console.debug(message);
    }
}

// Function to handle keyboard events
function handleKeydown(event, prevButtonSelector, nextButtonSelector) {
    if (event.key === PREV_KEY) {
        const prevButton = document.querySelector(prevButtonSelector);
        if (prevButton) {
            prevButton.click();
            writeDebugLog('Previous button clicked');
        }
    }
    else if (event.key === NEXT_KEY) {
        const nextButton = document.querySelector(nextButtonSelector);
        if (nextButton) {
            nextButton.click();
            writeDebugLog('Next button clicked');
        }
    }
}

// Function to observe pagination elements
function observePagination(paginationSelector, prevButtonSelector, nextButtonSelector, runOnce = false, findOnce = true) {
    onElementReady(paginationSelector, runOnce, findOnce, () => document.addEventListener('keydown', (event) => handleKeydown(event, prevButtonSelector, nextButtonSelector)));
}

// Observe the DOM for pagination elements
//observePagination('.pagination', '.prev', '.next'); // Example
observePagination('.s-pagination-strip', '.s-pagination-previous', '.s-pagination-next'); // Amazon
observePagination('nav.pagination', 'a.pagination__previous', 'a.pagination__next'); // eBay
observePagination('nav[aria-label="Pagination"]', 'a[rel="prev"]', 'a[rel="next"]'); // GitHub
observePagination('.pagination', 'a[aria-label="Previous"]', 'a[aria-label="Next"]'); // Neokyo
observePagination('.pager', '.pager-previous', '.pager-next'); // OzBargain