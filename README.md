Reuses the site's `trustedHTML.createHTML` policy for `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `parseFromString`.

Installation:
1. https://github.com/tophf/trust-any-html/raw/main/code.user.js
2. Customize the matching sites where you want to run it.
3. Make sure it runs before other userscripts:
   * Tampermonkey: main dashboard -> script editor -> settings -> `position` -> 1
   * Violentmonkey: main dashboard -> `sort by` -> `injection order` -> drag the script to the beginning

It can be also used as a `@require`, but you'll need to add `@run-at document-start` to your script's meta comment and avoid setting innerHTML before the policy is intercepted, which means you can't use require jQuery as it tries to do it immediately, and you need to run your main logic later: `window.addEventListener('DOMContentLoaded', () => { /* your main logic here */ }, { once: true });`
