var fs = require("fs");
var path = require("path");

exports.ReadJsonFileAsync = function ReadJsonFileAsync(filePath) {
    let fullPath = ".";
    filePath.forEach(function(element) {
        fullPath = path.join(fullPath, element);
    });

    return new Promise(function(resolve, reject) {
        fs.readFile(fullPath + ".json", function (err, data) {
            if (err) {
                reject(err);
            } else {
                let result = "";
                
                if (data.length > 0) {
                    result = JSON.parse(data);
                }

                resolve(result);
            }
        });
    });
}

exports.WriteJsonFileAsync = function WriteJsonFileAsync(filePath, content) {
    let fullPath = ".";
    filePath.forEach(function(element) {
        fullPath = path.join(fullPath, element);
    });

    return new Promise(function(resolve, reject) {
        fs.writeFile(fullPath + ".json", content, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

exports.CreateDirAsync = function CreateDirAsync(dirPath) {
    let fullPath = ".";
    dirPath.forEach(function(element) {
        fullPath = path.join(fullPath, element);
    });

    return new Promise(function(resolve, reject) {
        fs.mkdir(fullPath, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

exports.DeleteJsonFileAsync = function DeleteJsonFileAsync(filePath) {
    let fullPath = ".";
    filePath.forEach(function(element) {
        fullPath = path.join(fullPath, element);
    });

    return new Promise(function(resolve, reject) {
        fs.unlink(fullPath + ".json", function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    })
}

exports.CheckFileOrDirExists = function CheckFileOrDirExists(filePath) {
    let fullPath = ".";
    filePath.forEach(function(element) {
        fullPath = path.join(fullPath, element);
    });

    return new Promise(function (resolve, reject) {
        fs.access(fullPath, fs.constants.F_OK, function (error) {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                resolve(true);
            }
        });
    });
}