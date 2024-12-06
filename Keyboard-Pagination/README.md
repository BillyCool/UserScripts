# Keyboard Pagination
A script to navigate pagination using keyboard left and right arrows.

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
Happy to take requests for sites via issues. Also feel free to edit the script to change the assigned keyboard keys or add your own sites yourself if you prefer. Add another call to `observePagination`, passing selectors for the pagination, previous button and next button elements, e.g.
```js
observePagination('.pagination', '.prev', '.next');
```