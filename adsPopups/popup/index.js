const  allowPopUpsID = "allowPopUpsss",
  blockUrisID = "b-uri",
  blockDomainsID = "b-domain",
  s_blockedUris = "blockedUris",
  s_allowPopUps = "allowPopUps";


document.addEventListener("DOMContentLoaded", function () {
  // Set the checkbox state based on the stored value
  chrome.storage.sync.get(s_allowPopUps, function (data) {
    document.getElementById(allowPopUpsID).checked =
      data[s_allowPopUps] || false;
  });
  // Listen for changes to the checkbox and store the new value
  document
    .getElementById(allowPopUpsID)
    .addEventListener("change", function () {
      chrome.storage.sync.set({ allowPopUps: this.checked });
    });
  //
  //
  //
  //
  //
  // chrome.storage.sync.set({
  //   blockedUris: [],
  // });

  function blockURIDOMAINclick(event) {
    chrome.storage.sync.get(s_blockedUris, function (data) {
      var dlockUriList = data[s_blockedUris] || [];

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // Get the active tab
        const currentTab = tabs[0];
        const uro = new URL(currentTab.url);
        const whatToAdd =
          event.target.id == blockDomainsID
            ? `*://${uro.hostname}/*`
            : currentTab.url;

        if (!dlockUriList.includes(whatToAdd)) {
          dlockUriList.push(whatToAdd);
        }

        chrome.storage.sync.set({
          blockedUris: dlockUriList,
        });

        console.log(dlockUriList);
      });
    });
  }

  document.getElementById(blockUrisID).onclick = blockURIDOMAINclick;
  document.getElementById(blockDomainsID).onclick = blockURIDOMAINclick;
});
