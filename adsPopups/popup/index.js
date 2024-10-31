const ID_BlockAllPopUpss = "BlockAllPopUpss",
  ID_blockUris = "b-uri",
  ID_blockDomains = "b-domain",
  ID_BTN_editblockedsdomain = "BTN_editblockedsdomain",
  ID_enableYourBlocklist = "enableYourBlocklist";



document.addEventListener("DOMContentLoaded", function () {

  //get current tab
  chrome.tabs.query({ active: true, currentWindow: true }, async function (
    tabs
  ) {

    // Get the active tab
    const currentTab = tabs[0];
    const uro = new URL(currentTab.url);

    //##################################################################################
    //*************
    //popups 

    // Set the checkbox state based on load
    chrome.storage.sync.get('s_blockAllPopUps', function (store) {
      const ab = store['s_blockAllPopUps'] || true;
      document.getElementById(ID_BlockAllPopUpss).checked = ab
        ;
      chrome.storage.sync.set({ 's_blockAllPopUps': ab });
    });

    // Listen for changes to the checkbox and store the new value 
    document
      .getElementById(ID_BlockAllPopUpss)
      .addEventListener("change", function () {
        //update to storage
        chrome.storage.sync.set({ 's_blockAllPopUps': this.checked });
        //reload
        setTimeout(function () {
          chrome.tabs.reload(currentTab.id);
        }, 100);
      });
    //#################################################################################
    //********
    //your block list 
    // Set the checkbox state based on load
    chrome.storage.sync.get('s_bool_blockurl', function (data) {
      const aa = data['s_bool_blockurl'] || true;
      document.getElementById(ID_enableYourBlocklist).checked =
        aa;
      chrome.storage.sync.set({ 's_bool_blockurl': aa });


    });

    // Listen for changes to the checkbox and store the new value
    // popups
    document
      .getElementById(ID_enableYourBlocklist)
      .addEventListener("change", function () {
        //update to storage
        chrome.storage.sync.set({ 's_bool_blockurl': this.checked });
        //reload
        setTimeout(function () {
          chrome.tabs.reload(currentTab.id);
        }, 100);
      });
    //#################################################################################






    //*************
    //ads
    //
    //
    //

    function blockURIDOMAINclick(event) {
      chrome.storage.sync.get('blockedUris', async function (data) {
        var dlockUriList = data['blockedUris'] || [];

        const whatToAdd =
          event.target.id == ID_blockDomains
            ? `*://${uro.hostname}/*`
            : currentTab.url;


        if (!dlockUriList.includes(whatToAdd)) {
          dlockUriList.push(whatToAdd);
          if (event.target.id == ID_blockDomains) {
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
    }

    document.getElementById(ID_blockUris).onclick = blockURIDOMAINclick;
    document.getElementById(ID_blockDomains).onclick = blockURIDOMAINclick;
    document.getElementById(ID_BTN_editblockedsdomain).onclick = function () {
      chrome.tabs.create({ url: chrome.runtime.getURL("/popup/edits.html") });
    };

  });





});
