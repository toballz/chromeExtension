const ID_EDIT_BLOCKED_DOMAINS = 'editblockedsdomain';

document.addEventListener("DOMContentLoaded", function () {
  const blockURIDOMAINclick = async () => {
    try {
      const { blockedUris = [] } = await chrome.storage.sync.get('blockedUris');

      // Clear existing rows before repopulating
      const tableBody = document.getElementById(ID_EDIT_BLOCKED_DOMAINS);
      tableBody.innerHTML = ''; // Clear existing rows

      // Populate the table with blocked URIs
      blockedUris.forEach((url) => {
        const row = document.createElement("tr");

        const cellUrl = document.createElement("td");
        cellUrl.textContent = url;
        cellUrl.classList.add("url-cell");
        row.appendChild(cellUrl);

        const cellBtn = document.createElement("td");
        const button = document.createElement("button");
        button.textContent = "Delete";
        
        button.onclick = async () => {
          const updatedList = blockedUris.filter((blockedUrl) => blockedUrl !== url);
          await chrome.storage.sync.set({ blockedUris: updatedList });

          // Re-render the table after deletion
          blockURIDOMAINclick();
        };

        cellBtn.appendChild(button);
        row.appendChild(cellBtn);

        tableBody.appendChild(row);
      });
    } catch (error) {
      console.warn("Failed to load blocked URIs:", error);
    }
  };

  blockURIDOMAINclick();
});
