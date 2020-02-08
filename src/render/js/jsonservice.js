const { ipcRenderer } = require("electron");

var JsonService = function jsonService() {
    let self = this;

    self.ReadJsonFileAsync = function ReadJsonFileAsync(fileName) {    
        return new Promise(function(resolve, reject) {
            ipcRenderer.send("ReadJsonFileAsync", fileName);

            ipcRenderer.on("ReadJsonFileAsyncResponse", function(event, response) {
                // Check if error occurred
                if (response[0] = false) {
                    reject(response[1]);
                } else {
                    resolve(response[1]);
                }
            });
        });
    }

    self.WriteJsonFileAsync = function WriteJsonFileAsync(fileName, content) {
        return new Promise(function(resolve, reject) {
            ipcRenderer.send("WriteJsonFileAsync", fileName, content);

            ipcRenderer.on("WriteJsonFileAsyncResponse", function(event, response) {
                // Check if error occurred
                if (response[0] = false) {
                    reject(response[1]);
                } else {
                    resolve(response[0]);
                }
            });
        });
    }

    return {
        ReadJsonFileAsync: self.ReadJsonFileAsync,
        WriteJsonFileAsync: self.WriteJsonFileAsync
    }
}();