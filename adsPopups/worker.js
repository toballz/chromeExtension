//self.importScripts("def.js");

/* global config, URLPattern */
function BlockUrls() {//
  const domainVToBlock = async () => {
    try {
      chrome.storage.sync.get(['s_bool_blockurl', 'blockedUris'], function (storage) {
        let _BlockRuleList = [];
        console.log(storage.blockedUris);
        // if checkboc your block list true
        if (storage.s_bool_blockurl) {
          //if  list exists
          (storage.blockedUris || []).forEach((url, index) => {
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

        chrome.declarativeNetRequest.getDynamicRules((rules) => {
          const ruleIdsToRemove = rules.map((rule) => rule.id);

          chrome.declarativeNetRequest.updateDynamicRules(
            {
              removeRuleIds: ruleIdsToRemove,//delete old list 
              addRules: _BlockRuleList, //add new list
            },
            () => {
              //console.log(`Blocked domain: ${BlockRuleList}`);
            }
          );
        });


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

function popups() {
  // Enable or disable the popup blocker
  const activate = async () => {
    try {
      const data = await chrome.storage.sync.get('s_blockAllPopUps');
      if (data['s_blockAllPopUps']) { // If blocking all popups is true
        await chrome.scripting.unregisterContentScripts(); // Await here for consistency

        await chrome.scripting.registerContentScripts([
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
        // Allow popups
        await chrome.scripting.unregisterContentScripts();
      }
    } catch (e) {
      console.warn("Blocker Registration Failed", e);
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

BlockUrls();
popups();
