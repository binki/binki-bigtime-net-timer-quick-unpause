// ==UserScript==
// @name     binki-bigtime-net-timer-quick-unpause
// @homepageURL https://github.com/binki/binki-bigtime-net-timer-quick-unpause
// @version  1.1.1
// @grant    none
// @match https://*.bigtime.net/bigtime
// @match https://*.bigtime.net/bigtime/*
// @match https://*.bigtime.net/Bigtime
// @match https://*.bigtime.net/Bigtime/*
// @require https://github.com/binki/binki-userscript-when-element-changed-async/raw/master/binki-userscript-when-element-changed-async.js
// ==/UserScript==

(async () => {
  // We are forced to use wildcard @match above but we don’t want to match irrelevant subdomains.
  // The only subdomain which has a fixed alternative purpose that we know about so far is “www.bigtime.net”,
  // so test for that. See #3.
  if (/^[^:]+:\/\/www\./.test(document.URL)) return;

  // Multiple instances can be created in the document (see #2), so don’t bother
  // with identifying elements ahead of time.
  document.body.addEventListener('click', e => {
    // Wait specifically for a click on the button. If the user clicks on the
    // entry itself instead of the button, they should be presented the edit
    // screen in order to be able to fix things.
    const buttonGroup = e.target.closest('.timerMenu > ul.list div.btn-group');
    if (buttonGroup) (async () => {
      console.log('detected action click, following up with auto-click');
      const timerMenuSelector = '.timerMenu';
      const timerMenu = buttonGroup.closest(timerMenuSelector);
      if (!timerMenu) {
        console.error({
          buttonGroup,
        });
        throw new Error(`Unable to find ${timerMenuSelector} as an ancestor of the buttonGroup`);
      }
      const timerMenuEdit = timerMenu.querySelector('.timerMenu > ul.edit');
      while (timerMenuEdit.matches('.ng-hide')) {
        await whenElementChangedAsync(timerMenuEdit);
      }
      console.log('edit screen loaded, auto-clicking…');
      timerMenuEdit.querySelector('button.btn-primary').click();
    })();
  });
})();
