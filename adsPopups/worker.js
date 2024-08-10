function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; // Inclusive of min and max
}
/* global config, URLPattern */
function BlockUrls() {
  const domainVToBlock = async () => {
    //delete all
    chrome.declarativeNetRequest.updateDynamicRules(
      {
        addRules: [],
        removeRuleIds: [], // Remove previous rules with the same ID if necessary
      },
      () => {
        console.log(`Blocked domain:  removed all`);
      }
    );

    let BlockRuleList = [];
    const domainToBlock = [
      "https://www.gorecenter.com/images/advertisement_fuckyea.jpg",
      "*://*.displayvertising.com/*",
    ];

    domainToBlock.forEach((url, index) => {
      BlockRuleList.push({
        id: getRandomInt(2, 9000 + index),
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
        console.log(`Blocked domain: ${domainToBlock}`);
      }
    );
  };
  chrome.runtime.onStartup.addListener(domainVToBlock);
  chrome.runtime.onInstalled.addListener(domainVToBlock);
}

function popups() {
  // Enable or disable the blocker
  const activate = async () => {
    try {
      await chrome.scripting.unregisterContentScripts();

      await chrome.scripting.registerContentScripts([
        {
          id: "main",
          js: ["/data/inject/main.js"],
          world: "MAIN",
          matches: ["*://*/*"],
          allFrames: true,
          matchOriginAsFallback: true,
          runAt: "document_start",
        },
      ]);
    } catch (e) {
      console.log("Blocker Registration Failed", e);
      await chrome.scripting.unregisterContentScripts();
    }
  };

  chrome.runtime.onStartup.addListener(activate);
  chrome.runtime.onInstalled.addListener(activate);

  chrome.storage.onChanged.addListener((ps) => {
    if (ps.enabled || ps["top-hosts"]) {
      activate();
    }
  });
}

BlockUrls();
popups();
