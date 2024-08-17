self.importScripts("def.js");

/* global config, URLPattern */
function BlockUrls() {
  const domainVToBlock = async () => {
    chrome.storage.sync.get(s_blockedUris, function (data) {
      let BlockRuleList = [];

      console.log(data[s_blockedUris]);
      
      data[s_blockedUris].forEach((url, index) => {
        BlockRuleList.push({
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

      //delete all
      chrome.declarativeNetRequest.getDynamicRules((rules) => {
        const ruleIdsToRemove = rules.map((rule) => rule.id);

        chrome.declarativeNetRequest.updateDynamicRules(
          {
            removeRuleIds: ruleIdsToRemove,
            addRules: BlockRuleList,
          },
          () => {
            //console.log(`Blocked domain: ${BlockRuleList}`);
          }
        );
      });
    });
  };
  chrome.runtime.onStartup.addListener(domainVToBlock);
  chrome.runtime.onInstalled.addListener(domainVToBlock);
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes[s_blockedUris]) {
      domainVToBlock();
    }
  });
}

function popups() {
  // Enable or disable the blocker
  const activate = async () => {
    try {
      chrome.storage.sync.get(s_allowPopUps, function (data) {
        if (!data[s_allowPopUps]) {
          chrome.scripting.unregisterContentScripts();

          chrome.scripting.registerContentScripts([
            {
              id: "main",
              js: ["/inject/main.js"],
              world: "MAIN",
              matches: ["*://*/*"],
              allFrames: true,
              matchOriginAsFallback: true,
              runAt: "document_start",
            },
          ]);
        } else {
          console.log("allow popups");
          chrome.scripting.unregisterContentScripts();
        }
      });
    } catch (e) {
      console.log("Blocker Registration Failed", e);
      await chrome.scripting.unregisterContentScripts();
    }
  };

  chrome.runtime.onStartup.addListener(activate);
  chrome.runtime.onInstalled.addListener(activate);

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes[s_allowPopUps]) {
      activate();
    }
  });
}

BlockUrls();
popups();
