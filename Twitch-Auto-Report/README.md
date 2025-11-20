# Twitch Title Decrapifier
A userscript that helps auto report bad actors and bots on Twitch.

# How to
1. Install the ViolentMonkey (or similar) browser extension ([Firefox](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/), [Chrome](https://chromewebstore.google.com/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag), [Edge](https://microsoftedge.microsoft.com/addons/detail/violentmonkey/eeagobfjdenkkddmbclomhiblgggliao))
2. Install the [userscript](https://github.com/BillyCool/UserScripts/raw/master/Twitch-Auto-Report/twitch-auto-report.user.js)
3. Enjoy

## Features
- Adds configurable report shortcut buttons to viewer cards (emoji or text labels).
- Automates the report dialog flow.
- Supports unattended scanning of chat messages and automatic reporting when a match is found.

## Configuration
Configure behavior by editing the top-level constants in `twitch-auto-report.user.js`:
- `reportButtons` (array) - define the buttons injected into viewer cards. Each entry is an object with:
    - `title` (string): emoji or text shown on the button.
    - `reason` (string): full text placed into the report description field.
    - `categoryId` (string): the HTML id of the radio input the script should select for this report (used when the report dialog asks for a category).
    - `autoMatch` (string[]): optional array of case-insensitive substrings; when `isUnattendedReporting` is true the script scans chat messages and will automatically initiate a report if one of these substrings is found.

- `isUnattendedReporting` (boolean) - when true the script will scan chat for `autoMatch` patterns and perform reporting automatically; when false the buttons are injected for manual reporting. The tab will close automatically after a short duration regardless if a report was made or not.
- `isDebug` (boolean) - when true the script logs debug messages to the console.

Tips
- The script will no longer auto-update once you make changes to it. If new updates are available, make a backup of your changes to re-apply after manually updating.
- Verify `categoryId` values by opening the report dialog manually and inspecting the radio input elements for the correct id.