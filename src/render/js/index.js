const { ipcRenderer } = require("electron");

function requestListsAsync() {
    ipcRenderer.send("requestListsAsync");

    ipcRenderer.on("requestListsAsyncResponse", function(event, args) {
        args.forEach(function(element) {
            console.log(element);
        });
    })
}

window.addEventListener("DOMContentLoaded", function(event) {
    requestListsAsync();
})