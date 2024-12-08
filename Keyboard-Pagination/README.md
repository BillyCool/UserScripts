# Keyboard Pagination
A userscript to navigate through paginated content on various websites using keyboard arrow keys.

# How to
1. Install the ViolentMonkey (or similar) browser extension ([Firefox](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/), [Chrome](https://chromewebstore.google.com/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag), [Edge](https://microsoftedge.microsoft.com/addons/detail/violentmonkey/eeagobfjdenkkddmbclomhiblgggliao))
2. Install the [userscript](https://github.com/BillyCool/UserScripts/raw/master/Keyboard-Pagination/keyboard-pagination.user.js)
3. Enjoy

# Supported sites
* Amazon
* eBay
* GitHub
* Neokyo
* OzBargain

# Customization
Requests for additional site support via issues on the GitHub repository are welcomed. If you prefer to customize the script yourself, you can easily add support for new sites. 

To do this, add the relevant match attribute and another call to the `observePagination` function, passing the appropriate selectors for the pagination container, previous button, and next button elements. For example:
```js
observePagination('.pagination', '.prev', '.next');
```
This will enable the script to handle pagination on the new site using the specified selectors.