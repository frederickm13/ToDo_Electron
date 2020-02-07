var fs = require("fs");
var path = require("path");

function createDataDir(dirName, fileName) {
    let dirPath = path.join(".", dirName);

    return new Promise(function(resolve, reject) {
        fs.mkdir(dirPath, function(err) {
            if (err) {
                // Handle error here
                if (err.code === "EEXIST") {
                    createJsonFile(dirName, fileName)
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

function createJsonFile(dirName, fileName) {
    let dirPath = path.join(".", dirName);

    return new Promise(function(resolve, reject) {
        fs.writeFile(path.join(dirPath, fileName + ".json"), "[]", function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    })
}

exports.readJsonAsync = function readJsonAsync(dirName, fileName) {
    let dirPath = path.join(".", dirName, fileName + ".json");

    return new Promise(function(resolve, reject) {
        fs.readFile(dirPath, function (err, data) {
            if (err) {
                // Add error logic here
                if (err.code === "ENOENT") {
                    createDataDir(dirName, fileName)
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