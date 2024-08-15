window.open = function () {
  return null; // Return null to indicate the window wasn't opened
};

//********** */
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
      console.warn("Blocked iframe click event");
    }
  },
  true
);
//********** */


//debugger
Object.defineProperty(window, "debugger", {
  configurable: true,
  enumerable: false,
  writable: true,
  value: function () {},
});
