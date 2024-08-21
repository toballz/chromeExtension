function stopTR() {
  console.log(" window.open");
  return null;
}

function onDocumentLoad() {
  //********** */
  //*********** */
  //************ */
  //************* */
  //href
  document.querySelectorAll("a[target]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      return null;
      // You can add any other logic you want to execute here
    });
    //********** */
    //*********** */A
    //************ */
    //************* */
    //listen for new iframe created
    // Create a MutationObserver to monitor DOM changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.tagName === "IFRAME" || node.tagName === "FRAME") {
            handleIframe(node);
          }
        });
      });
    }).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    // Function to handle an iframe and its nested iframes
    function handleIframe(iframe) {
      try {
        iframe.onload = function () {
          try {
            const iframeWindow = iframe.contentWindow;

            // Block popups and document modifications
            iframeWindow.open = stopTR;
            iframeWindow.document.write = stopTR;
            iframeWindow.document.writeln = stopTR;
            iframeWindow.document.open = stopTR;

            // Observe and handle nested iframes
            const nestedObserver = new MutationObserver((mutations) => {
              mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((nestedNode) => {
                  if (nestedNode.tagName === "IFRAME") {
                    const iframeSrc = node.getAttribute("src");
                    if (
                      iframeSrc.startsWith("javascript:") ||
                      iframeSrc.startsWith("data:")
                    ) {
                      handleIframe(nestedNode);
                    }
                  }
                });
              });
            });

            nestedObserver.observe(iframeWindow.document.documentElement, {
              childList: true,
              subtree: true,
            });
          } catch (e) {
            console.error("Error accessing iframe content:", e);
          }
        };

        // In case the iframe is already loaded
        if (iframe.contentWindow) {
          iframe.onload();
        }
      } catch (e) {
        console.error("Error setting up iframe handling:", e);
      }
    }
  });
}

window.open = stopTR;
document.write = stopTR;
document.writeln = stopTR;
HTMLAnchorElement.prototype.click = stopTR;
HTMLAnchorElement.prototype.dispatchEvent = stopTR;
HTMLFormElement.prototype.submit = stopTR;
HTMLFormElement.prototype.dispatchEvent = stopTR;
document.addEventListener("click", stopTR, true); // with capture;

//********** */
//*********** */A
//************ */
//************* */
//DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  onDocumentLoad();
});
