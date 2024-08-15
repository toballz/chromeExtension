window.open = function() {
  return null;  // Return null to indicate the window wasn't opened
};

//debugger
Object.defineProperty(window, "debugger", {
    configurable: true,
    enumerable: false,
    writable: true,
    value: function() {}
});