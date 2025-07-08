// ==UserScript==
// @name         [TEMPLATE] Page Actions
// @description  TODO
// @version      1.0
// @author       BillyCool
// @namespace    BillyCool
// @match        https://example.com/*
// @require      https://raw.githubusercontent.com/BillyCool/UserScripts/master/%5BTemplate%5D%20Page-Actions/page-actions.common.js
// @grant        GM_addStyle
// ==/UserScript==

// --- CONFIGURATION ---
const buttonConfig = {
    position: 'bottom-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right'
    direction: 'vertical',    // 'vertical' or 'horizontal'
    gap: 4,                   // px between buttons
    size: 44,                 // px, button diameter
    buttons: [
        {
            icon: '🔍', // Unicode or SVG/HTML string
            tooltip: 'Search',
            onClick: () => dummyButtonAction('Search')
        },
        // Add more buttons as needed
    ]
};

// --- INIT ---
window.renderButtons(buttonConfig);

// --- ACTION HANDLERS ---
function dummyButtonAction(label) {
    console.log(`Button "${label}" clicked.`);
}