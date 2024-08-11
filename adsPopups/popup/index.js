
let allowPopUpsID="allowPopUpsss";

document.addEventListener('DOMContentLoaded', function () {
  // Set the checkbox state based on the stored value
  chrome.storage.sync.get("allowPopUps", function (data) {
      document.getElementById(allowPopUpsID).checked = data.allowPopUps || false;
  });

  // Listen for changes to the checkbox and store the new value
  document.getElementById(allowPopUpsID).addEventListener("change", function () {
      chrome.storage.sync.set({ allowPopUps: this.checked });
  });
});