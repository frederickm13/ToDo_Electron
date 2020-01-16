var fs = require("fs");
var path = require("path");

createDataDir = function createDataDir() {
    let dirPath = path.join(".", "listdata");

    return new Promise(function(resolve, reject) {
        fs.mkdir(path.join(".", "listdata"), function(err) {
            if (err) {
                // Handle error here
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

exports.readListsAsync = function readListsAsync() {
    let dirPath = path.join(".", "listdata");

    return new Promise(function(resolve, reject) {
        fs.readdir(dirPath, function (err, files) {
            if (err) {
                // Add error logic here
                if (err.code === "ENOENT") {
                    createDataDir()
                        .then(function(result) {
                            if (result === true) {
                                resolve([]);
                            }
                        }, function(err) {
                            // Handle error here
                            reject(err.message);
                        });
                } else {
                    reject("An error occurred: " + err.message);
                }
            } else {
                resolve(files);
            }
        });
    });
}