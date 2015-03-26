function clickHandler() {
   // alert("Will add here the annotate function");
    console.log("Adding annotator to body");

    chrome.tabs.insertCSS(null, { file: "css/jquery-ui.css" }, function () {
        chrome.tabs.insertCSS(null, { file: "css/annotator.min.css" });
    });

    chrome.tabs.executeScript(null, { file: "js/jquery.min.js" }, function () {
        chrome.tabs.executeScript(null, { file: "js/jquery-ui.min.js" }, function () {
            chrome.tabs.executeScript(null, { file: "js/annotator-full.min.js" }, function () {
                chrome.tabs.executeScript(null, { file: "js/annotate.js" });
            })
        })
    });
}
chrome.contextMenus.create(
    {
        "title": "Enable Annotations",
        "contexts": ["page", "selection"],
        "onclick": clickHandler
    }

);
/*
chrome.contextMenus.create(
    {
        "title": "Add Comments and tag",
        "contexts": ["selection"],
        "onclick": clickHandler
    }

);*/


//Message Handler when annotation is created
