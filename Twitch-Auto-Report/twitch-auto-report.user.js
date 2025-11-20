// ==UserScript==
// @name        Twitch Auto Report
// @description A userscript to auto report bad actors on Twitch
// @author      BillyCool
// @namespace   BillyCool
// @version     1.0
// @match       https://www.twitch.tv/*
// @require     https://gist.githubusercontent.com/BillyCool/f3655a94477908127525232d85be2ae5/raw/
// @homepageURL https://github.com/BillyCool/UserScripts/tree/master/Twitch-Auto-Report
// @downloadURL https://github.com/BillyCool/UserScripts/raw/master/Twitch-Auto-Report/twitch-auto-report.user.js
// @grant       window.close
// @icon        https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// ==/UserScript==

const isDebug = false;
const isUnattendedReporting = false;
let currentIndex = -1;
// Array of report button definitions.
// Each entry has:
// - title: emoji or text shown on the button
// - reason: the reason to be used in the report
// - autoMatch: array of strings used for automatic matching in unattended mode (optional)
const reportButtons = [
    {
        title: '🤖',
        reason: 'Bot or hacked account',
        categoryId: 'reason-search-radio-group-spam-bots',
        autoMatch: [
            'streamboo .com',
        ]
    }
];

// --- Helper functions
function logDebug(message) {
    if (isDebug) {
        console.debug(`[Twitch Auto Report] ${message}`);
    }
}

function clickNextButton() {
    let nextBtn = document.querySelector('button[data-a-target="form-navigation-next"]');
    if (nextBtn) {
        nextBtn.click();
        return true;
    }
    return false;
}

function clickSubmitButton() {
    let submitBtn = document.querySelector('button[data-a-target="form-navigation-submit"]');
    if (submitBtn) {
        currentIndex = -1;
        submitBtn.click();
        return true;
    }
    return false;
}

// --- Inject Auto Report Buttons into Viewer Card

function injectAutoReportButtons(jNode) {
    jNode.classList.add('found');
    let buttonWrapper = jNode.querySelector('.viewer-card .gQGOcr');

    if (!buttonWrapper) return;

    reportButtons.forEach((btn, index) => {
        const buttonContainer = createAutoReportButtonContainer(btn.title, index);
        buttonWrapper.appendChild(buttonContainer);
    });
}

function createButtonWrapper() {
    const wrapper = document.createElement('div');
}

function createAutoReportButtonContainer(title, index) {
    const container = document.createElement('div');
    container.classList.add('gPVkpw');

    const button = createAutoReportButton(title, index);
    container.appendChild(button);

    return container;
}

function createAutoReportButton(title, index) {
    const button = document.createElement('button');
    button.classList.add('gxYeIp');
    button.innerText = title;
    button.style.padding = '6px 12px';
    button.addEventListener('click', () => initiateReport(index));

    return button;
}
onElementReady('#VIEWER_CARD_ID:not(.found)', false, false, injectAutoReportButtons);

// --- Initiate Auto Report Workflow

function initiateReport(index) {
    logDebug(`Initiating report: ${reportButtons[index].title} (${reportButtons[index].reason})`);
    var threeDotMenuButton = document.querySelector('#VIEWER_CARD_ID button[aria-label="More options"]');

    if (threeDotMenuButton) {
        currentIndex = index;
        threeDotMenuButton.click();
    }
}

function clickThreeDotMenuButton(jNode) {
    if (currentIndex >= 0) {
        jNode.classList.add('found');
        jNode.click();
        logDebug(`Clicked three dot menu button for report index: ${reportButtons[currentIndex].title}`);
    }
}
onElementReady('#VIEWER_CARD_ID button[aria-label="More options"]:not(.found)', false, true, clickThreeDotMenuButton);

function clickReportButton(jNode) {
    if (currentIndex >= 0 && jNode.textContent.includes('Report')) {
        jNode.classList.add('found');
        jNode.click();
        logDebug(`Clicked report button for report index: ${reportButtons[currentIndex].title}`);
    }
}
onElementReady('.react-modal__overlay button:not(.found)', false, false, clickReportButton);

function selectSearchCategory(jNode) {
    if (currentIndex >= 0) {
        onElementReady(`#${reportButtons[currentIndex].categoryId}`, true, true, selectCategory);
        jNode.click();
        logDebug('Selected "Search" category');
        clickNextButton();
    }
}
onElementReady('#reason-select-radio-group-searching-other', false, false, selectSearchCategory);

function selectCategory(jNode) {
    if (currentIndex >= 0) {
        jNode.click();
        logDebug(`Selecting category: ${reportButtons[currentIndex].categoryId}`);
        clickNextButton();
    }
}

function setReportReason(jNode) {
    if (currentIndex >= 0) {
        // Use React-compatible native setter to update value
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype, 'value'
        ).set;

        nativeInputValueSetter.call(jNode, reportButtons[currentIndex].reason);

        // Dispatch native input event that bubbles — React listens to this
        const event = new Event('input', { bubbles: true });
        jNode.dispatchEvent(event);
        logDebug(`Set report reason to: ${reportButtons[currentIndex].reason}`);

        if (!clickNextButton()) {
            clickSubmitButton();
        }
    }
}
onElementReady('#report-wizard-description-form', false, false, setReportReason);

function submitReport(jNode) {
    if (currentIndex >= 0) {
        jNode.click();
        clickSubmitButton();
        logDebug('Submitted report');
    }
}
onElementReady('.reporting-modal__container .tw-checkbox__input', false, false, submitReport);

function closeReport(jNode) {
    jNode.click();

    if (isUnattendedReporting) {
        window.close();
    }

    const closeModalBtn = document.querySelector('#VIEWER_CARD_ID button[aria-label="Hide"]');
    if (closeModalBtn) {
        closeModalBtn.click();
    }
}
onElementReady('button[data-a-target="confirmation-screen-close"]', false, false, closeReport);

// --- Auto Match Report Reason based on Chat Messages

function scanChats() {
    var chats = document.querySelectorAll('.chat-line__message');
    for (const chat of chats) {
        const chatText = chat.textContent.toLowerCase();
        
        // Check if text includes any autoMatch value from any reportButton
        for (let i = 0; i < reportButtons.length; i++) {
            const btn = reportButtons[i];
            if (btn.autoMatch) {
                for (const matchStr of btn.autoMatch) {
                    if (chatText.includes(matchStr.toLowerCase())) {
                        logDebug(`Auto-matching chat message for report: ${btn.title} (${chatText})`);
                        
                        const userNameButton = chat.querySelector('.chat-line__username');
                        if (userNameButton) {
                            currentIndex = i;
                            userNameButton.click();
                        }
                        return; // Exit after first match
                    }
                }
            }
        }
    }

    if (isUnattendedReporting && currentIndex == -1) {
        window.close();
    }
}
onElementReady('div[data-a-target="chat-welcome-message"]', false, true, () => setTimeout(scanChats, 2000));