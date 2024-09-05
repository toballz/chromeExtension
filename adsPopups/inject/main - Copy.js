function stopTR() {
  //console.log("Blocked action");
  return null;
}

function onDocumentLoad(w = window) {
  const { HTMLAnchorElement, HTMLFormElement } = w;
  const wd = w.document;
  //
  //
  // Disable certain actions
  w.open = stopTR;
  wd.write = stopTR;
  wd.writeln = stopTR;

  HTMLAnchorElement.prototype.click = stopTR;
  HTMLAnchorElement.prototype.dispatchEvent = stopTR;
  HTMLFormElement.prototype.submit = stopTR;
  HTMLFormElement.prototype.dispatchEvent = stopTR;

  //
  //
  // Prevent default action on anchor tags with target attribute
  wd.addEventListener("DOMContentLoaded", function () {
    wd.querySelectorAll("base[target]").forEach(function (link) {
      link.setAttribute("target", "#");
      link.remove();
    });
    //
    //
    //
    wd.querySelectorAll("a[target]").forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        return null;
      });
    });
  });

  //
  //
  // Listen for new iframes created
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        const iframeWindow = node.contentWindow;

        if (node.tagName === "IFRAME" || node.tagName === "FRAME") {
          
          try {
            //** */
            const src = node.src.toLowerCase();
            if (src.startsWith("javascript:") || src.startsWith("data:")) {
              node.remove();
            }
            //** */
            onDocumentLoad(iframeWindow); // Apply the function to the iframe's contentWindow
          } catch (e) {
            //console.log("Error accessing iframe content:", e);
          }
        }
      });
    });
  }).observe(wd.documentElement, {
    childList: true,
    subtree: true,
  });

  //
  //
  // Override iframe src setter to prevent loading
  Object.defineProperty(HTMLIFrameElement.prototype, "src", {
    set: function () {
      //console.warn("Blocked attempt to set iframe src.");
    },
    configurable: true,
  });
}
//
//
// Apply the function to the current document
onDocumentLoad();
