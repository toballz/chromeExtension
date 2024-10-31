function stopTR() {
  return null; // Placeholder function to block actions
}

let aggressive = 3; // Aggression level for blocking

const blocker = {};

// Block iframes and frames based on source
blocker.frame = (target) => {
  const { src, tagName } = target;
  if (src && (tagName === "IFRAME" || tagName === "FRAME")) {
    const s = src.toLowerCase();
    if (s.startsWith("javascript:") || s.startsWith("data:")) {
      try {
        const contentWindow = target.contentWindow;
        if (contentWindow) {
          blocker.install(contentWindow);
        }
      } catch (e) {
        console.warn("Error installing blocker on frame:", e);
      }
    }
  }
};

// Handle click events
blocker.onclick = (e) => {
  const a = e.target.closest("[target]") || e.target.closest("a");
  if (a) {
    // Block methods #1, #2, #3, #4, #5
    if (a.target === "_blank" || a.closest("base")?.target === "_blank") {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false; // Block the event
    }
  }
  return true; // Allow non-anchor clicks
};

// Prevent default actions
 
// Main installation function
blocker.install = (w = window) => {
  const d = w.document;

  // Overwrite default behavior for anchor and form elements
  const { HTMLAnchorElement, HTMLFormElement } = w;
  HTMLAnchorElement.prototype.click = stopTR;
  HTMLAnchorElement.prototype.dispatchEvent = stopTR;
  HTMLFormElement.prototype.submit = stopTR;
  HTMLFormElement.prototype.dispatchEvent = stopTR;

  // Aggressive blocking for iframes and frames
  if (aggressive > 1) {
    const { HTMLIFrameElement, HTMLFrameElement } = w;

    const overrideContentWindow = (element) => {
      const originalDescriptor = Object.getOwnPropertyDescriptor(element.prototype, "contentWindow");
      Object.defineProperty(element.prototype, "contentWindow", {
        configurable: true,
        enumerable: true,
        get: function () {
          const w = originalDescriptor.get.call(this);
          if (w) {
            try {
              blocker.install(w);
            } catch (e) {
              console.warn("Error installing blocker on content window:", e);
            }
          }
          return w;
        },
      });
    };

    overrideContentWindow(HTMLFrameElement);
    overrideContentWindow(HTMLIFrameElement);

    const overrideContentDocument = (element) => {
      const originalDescriptor = Object.getOwnPropertyDescriptor(element.prototype, "contentDocument");
      Object.defineProperty(element.prototype, "contentDocument", {
        configurable: true,
        enumerable: true,
        get: function () {
          const d = originalDescriptor.get.call(this);
          if (d && d.defaultView) {
            try {
              blocker.install(d.defaultView);
            } catch (e) {
              console.warn("Error installing blocker on content document:", e);
            }
          }
          return d;
        },
      });
    };

    overrideContentDocument(HTMLFrameElement);
    overrideContentDocument(HTMLIFrameElement);
  }

  // Monitor DOM changes for iframe creation
  if (aggressive > 2) {
    new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          blocker.frame(node);
          if (node.childElementCount) {
            [...node.querySelectorAll("iframe")].forEach(blocker.frame);
          }
        }
      }
    }).observe(d, { childList: true, subtree: true });
  }

  // Capture click events
  d.addEventListener("click", blocker.onclick, true);

  // Override window.open
  w.open = new Proxy(w.open, {
    apply(target, self, args) {
      const name = args[1];
      if (name && typeof name === "string" && frames[name]) {
        return Reflect.apply(target, self, args); // Allow if opened in a frame
      }

      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);
      return iframe.contentWindow; // Return the iframe's contentWindow
    },
  });

  // Monitor document.write
  let dHTML = d.documentElement;
  d.write = new Proxy(d.write, {
    apply(target, self, args) {
      const result = Reflect.apply(target, self, args);
      if (dHTML !== self.documentElement) {
        dHTML = self.documentElement;
        self.addEventListener("click", blocker.onclick, true);
      }
      return result;
    },
  });
};

// Remove event listeners and cleanup
blocker.remove = (w = window, d = document) => {
  d.removeEventListener("click", blocker.onclick);
};

// Always install since we do not know the enabling status right now
blocker.install();
