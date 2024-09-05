function stopTR() {
  //console.log("Blocked action");
  return null;
}
let aggressive = 3;

const blocker = {};
blocker.frame = (target) => {
  const { src, tagName } = target;
  if (src && (tagName === "IFRAME" || tagName === "FRAME")) {
    const s = src.toLowerCase();
    if (s.startsWith("javascript:") || s.startsWith("data:")) {
      try {
        blocker.install(target.contentWindow);
      } catch (e) {}
    }
  }
};
blocker.onclick = (e) => {
  const a = e.target.closest("[target]") || e.target.closest("a");

  // If this is not a form or anchor element, ignore the click
  if (a) {
    blocker.onclick.pointer.call(a, e); // Using call to pass the context
    return true;
  } else {
    return false;
  }
};
blocker.onclick.pointer = MouseEvent.prototype.preventDefault;
blocker.install = (w = window) => {
  const d = w.document;

  /* overwrites */
  const { HTMLAnchorElement, HTMLFormElement } = w;
  HTMLAnchorElement.prototype.click = stopTR;
  HTMLAnchorElement.prototype.dispatchEvent = stopTR;
  HTMLFormElement.prototype.submit = stopTR;
  HTMLFormElement.prototype.dispatchEvent = stopTR;

  /* iframe mess */
  if (aggressive > 1) {
    const { HTMLIFrameElement, HTMLFrameElement } = w;

    const wf = Object.getOwnPropertyDescriptor(
      HTMLFrameElement.prototype,
      "contentWindow"
    );
    Object.defineProperty(HTMLFrameElement.prototype, "contentWindow", {
      configurable: true,
      enumerable: true,
      get: function () {
        const w = wf.get.call(this);
        try {
          blocker.install(w);
        } catch (e) {}
        return w;
      },
    });
    const wif = Object.getOwnPropertyDescriptor(
      HTMLIFrameElement.prototype,
      "contentWindow"
    );
    Object.defineProperty(HTMLIFrameElement.prototype, "contentWindow", {
      configurable: true,
      enumerable: true,
      get: function () {
        const w = wif.get.call(this);
        try {
          blocker.install(w);
        } catch (e) {}
        return w;
      },
    });
    const cf = Object.getOwnPropertyDescriptor(
      HTMLFrameElement.prototype,
      "contentDocument"
    );
    Object.defineProperty(HTMLFrameElement.prototype, "contentDocument", {
      configurable: true,
      enumerable: true,
      get: function () {
        const d = cf.get.call(this);
        try {
          blocker.install(d.defaultView);
        } catch (e) {}
        return d;
      },
    });
    const cif = Object.getOwnPropertyDescriptor(
      HTMLIFrameElement.prototype,
      "contentDocument"
    );
    Object.defineProperty(HTMLIFrameElement.prototype, "contentDocument", {
      configurable: true,
      enumerable: true,
      get: function () {
        const d = cif.get.call(this);
        try {
          blocker.install(d.defaultView);
        } catch (e) {}
        return d;
      },
    });
  }

  /* iframe creation with innerHTML */
  if (aggressive > 2) {
    new MutationObserver((ms) => {
      for (const m of ms) {
        for (const e of m.addedNodes) {
          blocker.frame(e);
          if (e.childElementCount) {
            [...e.querySelectorAll("iframe")].forEach(blocker.frame);
          }
        }
      }
    }).observe(d, { childList: true, subtree: true });
  }

  /* click */
  d.addEventListener("click", blocker.onclick, true); // with capture;

  /* window.open */
  w.open = new Proxy(w.open, {
    apply(target, self, args) {
      // do not block if window is opened inside a frame
      const name = args[1];
      if (name && typeof name === "string" && frames[name]) {
        return Reflect.apply(target, self, args);
      }

      //
      //simulate
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);
      return iframe.contentWindow;

      return false; //Reflect.apply(target, self, args);
    },
  });

  /* DOM replacement (document.open removes all the DOM listeners) */
  let dHTML = d.documentElement;
  d.write = new Proxy(d.write, {
    apply(target, self, args) {
      const r = Reflect.apply(target, self, args);
      if (dHTML !== self.documentElement) {
        dHTML = self.documentElement;
        self.addEventListener("click", blocker.onclick, true);
      }
      return r;
    },
  });
};
blocker.remove = (w = window, d = document) => {
  d.removeEventListener("click", blocker.onclick);
};

// always install since we do not know the enabling status right now
blocker.install();
