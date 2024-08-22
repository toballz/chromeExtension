document.addEventListener("DOMContentLoaded", function () {
  function blockURIDOMAINclick(event) {
    chrome.storage.sync.get(s_blockedUris, function (data) {
      var dlockUriList = data[s_blockedUris] || [];

      dlockUriList.forEach((url) => {
        const row = document.createElement("tr");

        const cellUrl = document.createElement("td");
        cellUrl.textContent = url;
        cellUrl.classList.add("url-cell");
        row.appendChild(cellUrl);

        const cellBtn = document.createElement("td");
        const button = document.createElement("button");
        button.textContent = "Delete";
        button.onclick = () => {
          dlockUriList = dlockUriList.filter((urlr) => urlr !== url);

          chrome.storage.sync.set({
            blockedUris: dlockUriList,
          });
          location.reload();
        };
        cellBtn.appendChild(button);
        row.appendChild(cellBtn);

        document.getElementById(ID_editblockedsdomain).appendChild(row);
      });
    });
  }
  blockURIDOMAINclick();
});
