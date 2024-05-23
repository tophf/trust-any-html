// ==UserScript==
// @name        Circumvent trustedTypes for HTML
// @namespace   Violentmonkey Scripts
// @unwrap
// @grant       none
// @run-at      document-start
// @version     2.0.0
// ==/UserScript==
{
  let policy, createHTML;
  const {Proxy} = window, {apply}  = Reflect;
  const P = 'prototype', CP = 'createPolicy', TTPF = TrustedTypePolicyFactory[P];
  const {getOwnPropertyDescriptor: describe, defineProperty: define} = Object;
  const proxify = (obj, key, i, hook) => (obj[key] = new Proxy(obj[key], {
    __proto__: null,
    apply: hook || ((fn, self, args) => (
      args[i] = apply(createHTML, policy, [args[i]]),
      apply(fn, self, args)
    ))
  }));
  const proxifySetter = (obj, key) => {
    const desc = describe(obj, key);
    proxify(desc, 'set', 0);
    define(obj, key, desc);
  };
  const origCP = TTPF[CP];
  const ovrCP = proxify(TTPF, CP, 0, (fn, thisArg, args) => {
    const pol = apply(fn, thisArg, args);
    if (!createHTML && (createHTML = pol.createHTML)) {
      const el = document.createElement('div');
      try {
        el.innerHTML = apply(createHTML, pol, ['']);
        policy = pol;
        if (TTPF[CP] === ovrCP)
          TTPF[CP] = origCP;
        const ElemP = Element[P];
        proxifySetter(ElemP, 'innerHTML');
        proxifySetter(ElemP, 'outerHTML');
        proxify(ElemP, 'insertAdjacentHTML'/* (pos, html) */, 1);
        proxify(DOMParser[P], 'parseFromString'/* (html, type) */, 0);
      } catch (err) {
        createHTML = null;
      }
    }
    return pol;
  });
}
