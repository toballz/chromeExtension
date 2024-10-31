const ID_BLOCK_ALL_POPUPS = "BlockAllPopUpss",
      ID_BLOCK_URIS = "b-uri",
      ID_BLOCK_DOMAINS = "b-domain",
      ID_BTN_EDIT_BLOCKED_DOMAINS = "BTN_editblockedsdomain",
      ID_ENABLE_YOUR_BLOCKLIST = "enableYourBlocklist";

document.addEventListener("DOMContentLoaded", async function () {
  // Get current active tab
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const currentTab = tabs[0];
  const currentUrl = new URL(currentTab.url);

  // Initialize popup settings
  const initPopupSettings = async () => {
    const { s_blockAllPopUps = true } = await chrome.storage.sync.get('s_blockAllPopUps');
    document.getElementById(ID_BLOCK_ALL_POPUPS).checked = s_blockAllPopUps;

    document.getElementById(ID_BLOCK_ALL_POPUPS).addEventListener("change", function () {
      chrome.storage.sync.set({ s_blockAllPopUps: this.checked });
      setTimeout(() => chrome.tabs.reload(currentTab.id), 100);    });
  };

  // Initialize block list settings
  const initBlockListSettings = async () => {
    const { s_bool_blockurl = true } = await chrome.storage.sync.get('s_bool_blockurl');
    document.getElementById(ID_ENABLE_YOUR_BLOCKLIST).checked = s_bool_blockurl;

    document.getElementById(ID_ENABLE_YOUR_BLOCKLIST).addEventListener("change", function () {
      chrome.storage.sync.set({ s_bool_blockurl: this.checked });
      setTimeout(() => chrome.tabs.reload(currentTab.id), 100);    });
  };

  // Add URI or domain to block list
  const blockURIDOMAINclick = async (event) => {
    const { blockedUris = [] } = await chrome.storage.sync.get('blockedUris');
    
    const whatToAdd = event.target.id === ID_BLOCK_DOMAINS
      ? `*://${currentUrl.hostname}/*`
      : currentTab.url;

    if (!blockedUris.includes(whatToAdd)) {
      blockedUris.push(whatToAdd);
      if (event.target.id === ID_BLOCK_DOMAINS) {
        // Add subdomain block rule
        blockedUris.push(`*://*.${currentUrl.hostname}/*`);
      }
      await chrome.storage.sync.set({ blockedUris });
      setTimeout(() => chrome.tabs.reload(currentTab.id), 100);
    }
  };

  // Event listeners
  document.getElementById(ID_BLOCK_URIS).addEventListener("click", blockURIDOMAINclick);
  document.getElementById(ID_BLOCK_DOMAINS).addEventListener("click", blockURIDOMAINclick);
  document.getElementById(ID_BTN_EDIT_BLOCKED_DOMAINS).addEventListener("click", () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("/popup/edits.html") });
  });

  // Initialize settings
  await initPopupSettings();
  await initBlockListSettings();
});
