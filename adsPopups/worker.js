// self.importScripts("def.js");

/* global config, URLPattern */

function BlockUrls() {
  const domainVToBlock = async () => {
    try {
      const { s_bool_blockurl, blockedUris = [] } = await chrome.storage.sync.get(['s_bool_blockurl', 'blockedUris']);
      
      const _BlockRuleList = [];

      // If blocking is enabled and the list of URLs exists
      if (s_bool_blockurl) {
        blockedUris.forEach((url, index) => {
          _BlockRuleList.push({
            id: 2 + index,
            priority: 1,
            action: { type: "block" },
            condition: {
              urlFilter: url,
              resourceTypes: [
                "main_frame",
                "sub_frame",
                "image",
                "script",
                "xmlhttprequest",
              ],
            },
          });
        });
      }

      // Get existing dynamic rules
      const rules = await chrome.declarativeNetRequest.getDynamicRules();
      const ruleIdsToRemove = rules.map((rule) => rule.id);

      // Update dynamic rules with new block rules
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ruleIdsToRemove, // Remove old rules
        addRules: _BlockRuleList,        // Add new block rules
      });

    } catch (e) {
      console.warn("Blocker Registration Failed", e);
      await chrome.scripting.unregisterContentScripts();
    }
  };

  chrome.runtime.onStartup.addListener(domainVToBlock);
  chrome.runtime.onInstalled.addListener(domainVToBlock);

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && (changes['s_bool_blockurl'] || changes['blockedUris'])) {
      domainVToBlock();
    }
  });
}

function Popups() {
  const activate = async () => {
    try {
      const { s_blockAllPopUps } = await chrome.storage.sync.get('s_blockAllPopUps');
      await chrome.scripting.unregisterContentScripts(); // Clear existing scripts

      if (s_blockAllPopUps) {
        // If blocking all popups is enabled, register the content script
        await chrome.scripting.registerContentScripts([{
          id: "main",
          js: ["/inject/main.js"],
          world: "MAIN",
          matches: ["*://*/*"],
          allFrames: true,
          matchOriginAsFallback: true,
          runAt: "document_start",
        }]);
      }
    } catch (e) {
      console.warn("Popup Blocker Registration Failed", e);
      await chrome.scripting.unregisterContentScripts();
    }
  };

  chrome.runtime.onStartup.addListener(activate);
  chrome.runtime.onInstalled.addListener(activate);

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes['s_blockAllPopUps']) {
      activate();
    }
  });
}

// Initialize functions
BlockUrls();
Popups();
