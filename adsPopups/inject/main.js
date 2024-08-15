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
  console.log("Blocked document.write call");
  return null;
};
document._ = function () {
  console.log("Blocked document.write call");
  return null;
};

//********** */
//*********** */
//************ */
//************* */
//listen for new iframe created
function handleIframeCreation(node) {
  if (node.tagName === "IFRAME") {
    // Block or modify iframe behavior here
    console.log("Blocked an iframe creation:", node);
    return null;
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
  subtree: true,
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
