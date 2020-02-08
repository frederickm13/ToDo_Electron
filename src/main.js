const { app, BrowserWindow, ipcMain } = require('electron')
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

ipcMain.on("ReadJsonFileAsync", function(event, filePath) {
    filePath = ["_data", filePath];
    fileOps.ReadJsonFileAsync(filePath)
        .then(function(successResponse) {
            event.reply("ReadJsonFileAsyncResponse", [true, successResponse]);
        }, function(errResponse) {
            event.reply("ReadJsonFileAsyncResponse", [false, errResponse]);
        });
});

ipcMain.on("WriteJsonFileAsync", function(event, filePath, content) {
    filePath = ["_data", filePath];
    fileOps.WriteJsonFileAsync(filePath, content)
        .then(function(successResponse) {
            event.reply("WriteJsonFileAsyncResponse", [true, null]);
        }, function(errResponse) {
            event.reply("WriteJsonFileAsyncResponse", [false, errResponse]);
        });
});

ipcMain.on("CreateDirAsync", function(event, dirPath) {
    fileOps.CreateDirAsync(dirPath)
        .then(function(successResponse) {
            event.reply("CreateDirAsyncResponse", [true, null]);
        }, function(errResponse) {
            event.reply("CreateDirAsyncResponse", [false, errResponse]);
        });
});