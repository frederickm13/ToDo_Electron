var fs = require("fs");
var path = require("path");

function createDataDir() {
    let dirPath = path.join(".", "listdata");

    return new Promise(function(resolve, reject) {
        fs.mkdir(dirPath, function(err) {
            if (err) {
                // Handle error here
                if (err.code === "EEXIST") {
                    createListsFile()
                        .then(function(result) {
                            if (result === true) {
                                resolve(result);
                            }
                        }, function(err) {
                            // Handle error here
                            reject(err.message);
                        });
                } else {
                    reject(err);
                }
            } else {
                resolve(true);
            }
        });
    });
}

function createListsFile() {
    let dirPath = path.join(".", "listdata");

    return new Promise(function(resolve, reject) {
        fs.writeFile(path.join(dirPath, "lists.json"), "[]", function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    })
}

exports.readListsAsync = function readListsAsync() {
    let dirPath = path.join(".", "listdata", "lists.json");

    return new Promise(function(resolve, reject) {
        fs.readFile(dirPath, function (err, data) {
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
                resolve(JSON.parse(data));
            }
        });
    });
}