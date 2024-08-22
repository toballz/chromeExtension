document.addEventListener("DOMContentLoaded", function () {
  // Set the checkbox state based on the stored value
  chrome.storage.sync.get(s_allowPopUps, function (data) {
    document.getElementById(ID_allowPopUps).checked =
      data[s_allowPopUps] || false;
  });
  // Listen for changes to the checkbox and store the new value
  document
    .getElementById(ID_allowPopUps)
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

      chrome.tabs.query({ active: true, currentWindow: true }, async function (
        tabs
      ) {
        // Get the active tab
        const currentTab = tabs[0];
        const uro = new URL(currentTab.url);
        const whatToAdd =
          event.target.id == ID_blockDomains
            ? `*://${uro.hostname}/*`
            : currentTab.url;

        if (!dlockUriList.includes(whatToAdd)) {
          dlockUriList.push(whatToAdd);
          if(event.target.id == ID_blockDomains){
            //and subdomains
            dlockUriList.push(`*://*.${uro.hostname}/*`);
          }
        }

        await chrome.storage.sync.set({
          blockedUris: dlockUriList,
        });

        setTimeout(function () {
          chrome.tabs.reload(currentTab.id);
        }, 1000);
      });
    });
  }

  document.getElementById(ID_blockUris).onclick = blockURIDOMAINclick;
  document.getElementById(ID_blockDomains).onclick = blockURIDOMAINclick;
  document.getElementById(ID_BTN_editblockedsdomain).onclick = function(){
    chrome.tabs.create({ url: chrome.runtime.getURL("/popup/edits.html") });
  };
});
