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
    })
}

exports.CreateDirAsync = function CreateDirAsync(dirName) {
    let dirPath = path.join(".", dirName);

    return new Promise(function(resolve, reject) {
        fs.mkdir(dirPath, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}