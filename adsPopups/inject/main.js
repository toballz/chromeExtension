function onDocumentLoad() {
  //********** */
  //*********** */A
  //************ */
  //************* */
  //listen for new iframe created
  function handleIframeCreation(node) {
    if (node.tagName === "IFRAME") {
      node.onload = function () {
        try {
          const iframeWindow = node.contentWindow;
          iframeWindow.open = function () {
            return null;
          };
        } catch (e) {
          console.error("Error accessing iframe content:", e);
        }
      };
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
  //href
  document.querySelectorAll("a[target]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      return null;
      // You can add any other logic you want to execute here
    });
  });
}
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
  return null;
};
document._ = function () {
  //console.log("Blocked document.write call");
  return null;
};

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

//
document.addEventListener("DOMContentLoaded", function () {
  onDocumentLoad();
});
