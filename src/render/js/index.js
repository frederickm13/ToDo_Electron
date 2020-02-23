const $ = require("jquery");


//////////////////////////
// View Model definition
//////////////////////////
function toDoItem(title, createdDate, lastModified, content) {
    var self = this;

    self.itemTitle = ko.observable(title);
    self.itemCreatedOn = createdDate;
    self.itemLastModifiedOn = lastModified;
    self.itemContent = content;
}

function toDoList(id, title, createdOn, modifiedOn) {
    var self = this;

    self.listId = id;
    self.listTitle = ko.observable(title);
    self.listCreatedOn = createdOn;
    self.listModifiedOn = modifiedOn;
    self.editListItem = ko.observable(false);
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
function RequestHomeData() {
    let fileName = "lists";
    JsonService.ReadJsonFileAsync(fileName)
        .then(function (data) {
            data.forEach(function(element) {
                let list = new toDoList(element.listId, element.listTitle, element.listCreatedOn, element.listModifiedOn);
                appViewModel.itemLists.push(list);
            });
        }, function (errorResponse) {
            console.log("An issue occurred when reading home data.");
        });
}

function RequestListData(list) {
    appViewModel.activeList(list);
    JsonService.ReadJsonFileAsync(list.listId.toString())
        .then(function(data) {
            data.forEach(function(element) {
                let item = new toDoItem(element.itemTitle, element.itemCreatedOn, element.itemLastModifiedOn, element.itemContent);
                appViewModel.activeList().listItems.push(item);
            });
        }, function (errorResponse) {
            console.log("An issue occurred when reading list data.");
        });

    appViewModel.home(false);
}

function ShowListItem(listItem) {
    appViewModel.activeItem(listItem);
}

function NavigateHome() {
    // TODO: Add functionality to save when prompted
    SaveActiveList();
    appViewModel.activeItem(null);
    appViewModel.activeList(null);
    appViewModel.itemLists([]);
    RequestHomeData();
    appViewModel.home(true);
}

function SaveActiveList() {
    $("#ListSaveIcon").addClass("w3-spin");
    let activeList = ko.toJSON(appViewModel.activeList().listItems);
    JsonService.WriteJsonFileAsync(appViewModel.activeList().listId.toString(), activeList)
        .then(function(successResponse) {
            console.log("Save executed successfully");
            setTimeout(function () { $("#ListSaveIcon").removeClass("w3-spin"); }, 1000);
        }, function(errorResponse) {
            console.log("Save failed");
            setTimeout(function () { $("#ListSaveIcon").removeClass("w3-spin"); }, 1000);
        });
}

function SaveHomeLists() {
    $("#HomeSaveIcon").addClass("w3-spin");
    let itemLists = ko.toJSON(appViewModel.itemLists());
    JsonService.WriteJsonFileAsync("lists", itemLists)
        .then(function (successResponse) {
            console.log("Save executed successfully");
            setTimeout(function () { $("#HomeSaveIcon").removeClass("w3-spin"); }, 1000);
        }, function (errorResponse) {
            console.log("Save failed");
            setTimeout(function () { $("#HomeSaveIcon").removeClass("w3-spin"); }, 1000);
        });
}

function CreateNewList() {
    let currentDateTime = new Date();
    let newItemId = currentDateTime.getTime()
    let newItem = new toDoList(newItemId, "New List", currentDateTime, currentDateTime);
    appViewModel.itemLists.push(newItem);

    SaveHomeLists();

    JsonService.WriteJsonFileAsync(newItemId.toString(), "")
        .then(function (successResponse) {
            console.log("New list created successfully");
        }, function (errorResponse) {
            console.log("Failed to create new list");
        });
}

function CreateNewListItem() {
    let newItem = new toDoItem("", new Date(), new Date(), "");
    appViewModel.activeList().listItems.push(newItem);
    appViewModel.activeItem(newItem);
}

function DeleteItem(list) {
    let listId = list.listId;
    let index = appViewModel.itemLists.indexOf(list);
    if (index != -1) {
        appViewModel.itemLists.splice(index, 1);
    }

    SaveHomeLists();

    JsonService.DeleteJsonFileAsync(listId.toString())
        .then(function (successResponse) {
            console.log("List deleted successfully");
        }, function (errorResponse) {
            console.log("Failed to delete list");
        });
}

function EditItem(list) {
    list.editListItem(true);
}

function SaveItem(list) {
    list.editListItem(false);
    SaveHomeLists();
}


/////////////////////
// Initialize Page
/////////////////////
ko.applyBindings(appViewModel);

$(document).ready(function(event) {
    RequestHomeData();
})