self.importScripts('def.js');

/* global config, URLPattern */
function BlockUrls() {
  const domainVToBlock = async () => {
    //delete all
    chrome.declarativeNetRequest.getDynamicRules((rules) => {
      const ruleIds = rules.map((rule) => rule.id);

      // Step 2: Remove all rules
      chrome.declarativeNetRequest.updateDynamicRules(
        {
          removeRuleIds: ruleIds,
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error(
              `Failed to remove rules: ${chrome.runtime.lastError.message}`
            );
          } else {
            //console.log("Blocked domain: removed all rules");
            if (typeof callback === "function") {
              callback();
            }
          }
        }
      );
    });

    chrome.storage.sync.get(s_blockedUris, function (data) {
      let BlockRuleList = [];

      data[s_blockedUris].forEach((url, index) => {
        console.log(url);
        BlockRuleList.push({
          id: getRandomInt(2, 100 + index),
          priority: 1,
          action: { type: "block" },
          condition: {
            urlFilter: url,
            resourceTypes: ["main_frame", "sub_frame", "image"],
          },
        });
      });

      chrome.declarativeNetRequest.updateDynamicRules(
        {
          addRules: BlockRuleList,
          removeRuleIds: [1], // Remove previous rules with the same ID if necessary
        },
        () => {
          //console.log(`Blocked domain: ${BlockRuleList}`);
        }
      );
    });
  };
  chrome.runtime.onStartup.addListener(domainVToBlock);
  chrome.runtime.onInstalled.addListener(domainVToBlock);
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
