# Page Actions
A template userscript to add floating action buttons to web pages. These buttons can be configured to perform various actions, making it easy to add quick-access tools or shortcuts to any site. The script is designed as a template for easy adaptation to your own needs.

# How to
1. Install the ViolentMonkey (or similar) browser extension ([Firefox](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/), [Chrome](https://chromewebstore.google.com/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag), [Edge](https://microsoftedge.microsoft.com/addons/detail/violentmonkey/eeagobfjdenkkddmbclomhiblgggliao))
2. Install the [userscript](https://github.com/BillyCool/UserScripts/raw/master/%5BTemplate%5D%20Page-Actions/page-actions.user.js)
3. Configure the script, see section below
4. Enjoy

# Features
- Floating action buttons with configurable position and layout
- Customizable icons, tooltips, and actions for each button
- Simple configuration via a JavaScript object
- Easily extendable for additional buttons and actions

# Configuration
Edit the `buttonConfig` object in the script to customize:

- **position**: `'top-left'`, `'top-right'`, `'bottom-left'`, or `'bottom-right'`
- **direction**: `'vertical'` or `'horizontal'`
- **gap**: Space (in pixels) between buttons
- **size**: Button diameter (in pixels)
- **buttons**: Array of button definitions, each with:
  - `icon`: Unicode character or SVG/HTML string
  - `tooltip`: Text shown on hover
  - `onClick`: Function to execute when clicked

## Usage
Once installed and configured, the floating action buttons will appear on matching pages. Click a button to trigger its associated action. Customize the actions by editing the `onClick` handlers in the configuration.