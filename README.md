Reuses the site's trustedHTML.createHTML policy for innerHTML assignments and insertAdjacentHTML.

Installation:
1. https://github.com/tophf/trust-any-html/raw/main/code.user.js
2. Customize the matching sites where you want to run it.

It can be also used as a `@require`, but you'll need to add `@run-at document-start` to your script's meta comment and you'll probably need to run your main logic later: `window.addEventListener('DOMContentLoaded', () => { /* your main logic here */ }, { once: true });`
