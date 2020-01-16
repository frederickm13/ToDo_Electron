const { app, BrowserWindow } = require('electron')
const path = require("path");
const fileOps = require("./main/fileoperations.js");

function createWindow () {
    // Create the browser window.
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    win.loadFile('./src/render/html/index.html');
    
    win.on("closed", () => {
        win = null;
    });
}

app.on('ready', function() {
    createWindow();

    fileOps.readListsAsync()
        .then(function(filesList) {
            filesList.forEach(file => {
                console.log(file);
            });
        });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});