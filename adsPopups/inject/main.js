window.open = function () {
  return null; // Return null to indicate the window wasn't opened
};
window._ = function () {
  return null; // Return null to indicate the window wasn't opened
};


//********** */
//*********** */
//************ */
//************* */
// Override the default document.write behavior
document.write = function () {
  console.warn("Blocked document.write call");
};

// Remove iframe elements
document.querySelectorAll("iframe").forEach((iframe) => iframe.remove());

// Listen for click events and prevent window opening
window.addEventListener(
  "click",
  (e) => {
    if (e.target.tagName === "IFRAME") {
      e.stopImmediatePropagation();
      e.preventDefault();
      console.log("Blocked iframe click event");
    }
  },
  true
);


//********** */
//*********** */
//************ */
//************* */
//listen for new iframe created
function handleIframeCreation(node) {
  if (node.tagName === 'IFRAME') {
    // Add event listener to block popup behavior
    node.onload = () => {
      const iframeWindow = node.contentWindow;
      if (iframeWindow) {
        iframeWindow.addEventListener('beforeunload', (event) => {
          if (event.target !== node) {
            // Prevent popup
            event.preventDefault();
            event.returnValue = '';
          }
        });
      }
    };
  }
}

// Create a MutationObserver to monitor DOM changes
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach(handleIframeCreation);
  });
});

// Start observing the document for changes
observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});



//********** */
//*********** */
//************ */
//************* */
//debugger
Object.defineProperty(window, "debugger", {
  configurable: true,
  enumerable: false,
  writable: true,
  value: function () {},
});
