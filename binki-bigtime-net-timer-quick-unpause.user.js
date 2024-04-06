// ==UserScript==
// @name     binki-bigtime-net-timer-quick-unpause
// @version  1.0.0
// @grant    none
// @match https://intuit.bigtime.net/bigtime
// @match https://intuit.bigtime.net/bigtime/*
// @match https://intuit.bigtime.net/Bigtime
// @match https://intuit.bigtime.net/Bigtime/*
// @require https://github.com/binki/binki-userscript-when-element-changed-async/raw/master/binki-userscript-when-element-changed-async.js
// ==/UserScript==

(async () => {
  const timerMenuList = await (async () => {
    while (true) {
      const timerMenuList = document.querySelector('.timerMenu > ul.list');
      if (timerMenuList) return timerMenuList;
      await whenElementChangedAsync(document.body);
    }
  })();
  console.log('found timerMenu list', timerMenuList);
  const timerMenuEdit = await (async () => {
    while (true) {
  	  const timerMenuEdit = document.querySelector('.timerMenu > ul.edit');
      if (timerMenuEdit) return timerMenuEdit;
      await whenElementChangedAsync(document.body);
    }
  })();
  console.log('found timerMenu edit', timerMenuEdit);
  timerMenuList.addEventListener('click', e => {
    const button = (() => {
      let target = e.target;
      while (target && target.nodeName.toLowerCase() !== 'button') target = target.parentNode;
      return target;
    })();
    console.log('sought under ', e.target, ' and found ', button);
    if (!button) return;
    // A button in the menu was clicked. So do followup action.
    console.log('detected action click, following up with auto-click');
    (async () => {
      while (document.querySelector('.timerMenu > ul.edit.ng-hide')) {
        await whenElementChangedAsync(timerMenuEdit);
      }
      console.log('edit screen loaded, auto-clicking…');
      timerMenuEdit.querySelector('button.btn-primary').click();
    })();
  });
})();
