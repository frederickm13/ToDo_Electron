const { ipcRenderer } = require("electron");


//////////////////////////
// View Model definition
//////////////////////////
function toDoItem(title, createdDate, lastModified, content) {
    var self = this;

    self.itemTitle = title;
    self.itemCreatedDate = createdDate;
    self.itemLastModified = lastModified;
    self.itemContent = content;
}

function toDoList(id, title, createdOn, modifiedOn) {
    var self = this;

    self.id = id;
    self.listTitle = title;
    self.listCreatedOn = createdOn;
    self.listModifiedOn = modifiedOn;
    self.listItems = ko.observableArray();
}

function viewModel() {
    var self = this;

    self.home = ko.observable(true);
    self.itemLists = ko.observableArray();
    self.activeList = ko.observable();
    self.activeItem = ko.observable();
};

var appViewModel = new viewModel();


/////////////////////////
// Functions Definition
/////////////////////////
function requestJsonFileDataAsync(fileName) {    
    return new Promise(function(resolve, reject) {
        ipcRenderer.send("requestJsonFileDataAsync", fileName);

        ipcRenderer.on("requestJsonFileDataAsyncResponse", function(event, args) {
            resolve(args);
        });
    });
}

function requestHomeData() {
    let fileName = "lists";
    requestJsonFileDataAsync(fileName).then(
        function(data) {
            data.forEach(function(element) {
                let list = new toDoList(element.Id, element.Title, element.CreatedOn, element.ModifiedOn);
                appViewModel.itemLists.push(list);
            });
        }
    );
}

function requestListData(list) {
    appViewModel.activeList(list);
    requestJsonFileDataAsync(list.id).then(
        function(data) {
            data.forEach(function(element) {
                let item = new toDoItem(element.title, element.createdon, element.modifiedon, element.content);
                appViewModel.activeList().listItems.push(item);
            });
        }
    );

    appViewModel.home(false);
}

function showListItem(listItem) {
    appViewModel.activeItem(listItem);
}

function navigateHome() {
    appViewModel.activeItem(null);
    appViewModel.activeList(null);
    appViewModel.home(true);
}

function saveAll() {
    let saveIcon = document.getElementById("SaveIcon");
    saveIcon.classList.add("w3-spin");

    // Add logic here to save

    saveIcon.classList.remove("w3-spin");
}


/////////////////////
// Initialize Page
/////////////////////
ko.applyBindings(appViewModel);

window.addEventListener("DOMContentLoaded", function(event) {
    requestHomeData();
})