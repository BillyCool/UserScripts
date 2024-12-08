# Keyboard Pagination
A userscript that automatically rounds and formats prices on various e-commerce websites for better readability.

# How to
1. Install the ViolentMonkey (or similar) browser extension ([Firefox](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/), [Chrome](https://chromewebstore.google.com/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag), [Edge](https://microsoftedge.microsoft.com/addons/detail/violentmonkey/eeagobfjdenkkddmbclomhiblgggliao))
2. Install the [userscript](https://github.com/BillyCool/UserScripts/raw/master/Keyboard-Pagination/keyboard-pagination.user.js)
3. Enjoy

# Supported sites
* Amazon
* eBay
* Neokyo
* OzBargain

# Customization 
Requests for additional site support via issues on the GitHub repository are welcomed. If you prefer to customize the script yourself, you can easily add support for new sites. 

To do this, add the relevant match attribute and another call to the `onElementReady` function, passing the appropriate selectors and parameters. For example:
```js
onElementReady('.price', false, true, callback);
```
This will enable the script on the new site using the specified selectors.