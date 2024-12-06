// ==UserScript==
// @name        Keyboard Pagination
// @description A script to navigate pagination using keyboard arrows
// @author      BillyCool
// @namespace   BillyCool
// @version     1.0
// @match       *://*.amazon.*/*
// @match       *://*.ebay.*/*
// @match       *://*.github.com/*
// @match       *://*.neokyo.com/*
// @match       *://*.ozbargain.com.au/*
// @homepageURL https://github.com/BillyCool/UserScripts/tree/master/Keyboard-Pagination
// @downloadURL https://github.com/BillyCool/UserScripts/raw/master/Keyboard-Pagination/keyboard-pagination.user.js
// @copyright   GPL-3.0-or-later
// @grant       none
// @run-at      document-body
// @inject-into content
// ==/UserScript==

// Array to keep track of all MutationObserver instances
const observers = [];

// Variable to track if pagination component is found
let paginationFound = false;

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

// Function to disconnect all observers
function disconnectAllObservers() {
    writeDebugLog('Disconnecting ' + observers.length + ' observers');
    observers.forEach(observer => observer.disconnect());
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

// Function to observe the DOM for the pagination component
function observePagination(paginationSelector, prevButtonSelector, nextButtonSelector) {
    const observer = new MutationObserver((mutations) => {
        if (paginationFound) return; // Skip if pagination is already found

        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                const paginationComponent = document.querySelector(paginationSelector);
                if (paginationComponent && !paginationFound) {
                    writeDebugLog('Pagination component found');
                    paginationFound = true; // Set the variable to true
                    document.addEventListener('keydown', (event) => handleKeydown(event, prevButtonSelector, nextButtonSelector));
                    disconnectAllObservers(); // Disconnect all observers once the component is found
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    observers.push(observer); // Add the observer to the array

    // Check for existing pagination elements on script load
    const paginationComponent = document.querySelector(paginationSelector);
    if (paginationComponent) {
        writeDebugLog('Pagination component found on load');
        paginationFound = true; // Set the variable to true
        document.addEventListener('keydown', (event) => handleKeydown(event, prevButtonSelector, nextButtonSelector));
        disconnectAllObservers(); // Disconnect all observers once the component is found
    }
}

// Start observing the DOM
//observePagination('.pagination', '.prev', '.next'); // Example
observePagination('.s-pagination-strip', '.s-pagination-previous', '.s-pagination-next'); // Amazon
observePagination('nav.pagination', 'a.pagination__previous', 'a.pagination__next'); // eBay
observePagination('nav[aria-label="Pagination"]', 'a[rel="prev"]', 'a[rel="next"]'); // GitHub
observePagination('.pagination', 'a[aria-label="Previous"]', 'a[aria-label="Next"]'); // Neokyo
observePagination('.pager', '.pager-previous', '.pager-next'); // OzBargain