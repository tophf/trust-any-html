// ==UserScript==
// @name        Circumvent trustedTypes for HTML
// @namespace   Violentmonkey Scripts
// @grant       none
// @run-at      document-start
// ==/UserScript==
{
  const CP = 'createPolicy';
  const createPolicy = trustedTypes[CP];
  let createHTML;
  trustedTypes[CP] = function ovr(name, opts) {
    const p = createPolicy.call(trustedTypes, name, opts);
    if (!createHTML && (createHTML = p.createHTML)) {
      const el = document.documentElement.appendChild(document.createElement('div'));
      try {
        el.innerHTML = createHTML.call(p, '');
        if (trustedTypes[CP] === ovr) delete trustedTypes[CP];
        const proto = Element.prototype;
        const { insertAdjacentHTML } = proto;
        const d = Object.getOwnPropertyDescriptor(proto, 'innerHTML');
        const { set } = d;
        d.set = function (val) {
          set.call(this, createHTML(val));
        };
        Object.defineProperty(proto, 'innerHTML', d);
        proto.insertAdjacentHTML = function (pos, html) {
          return insertAdjacentHTML.call(this, pos, createHTML.call(p, html));
        };
      } catch (err) {
        createHTML = null;
      }
      el.remove();
    }
    return p;
  };
}
