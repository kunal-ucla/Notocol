var tokenValue="";

function fetchTokenValue(){
    chrome.cookies.get({ "url": 'http://localhost:5555', "name": 'UserInfo' }, function (cookie) {
        console.log(cookie.value);
        tokenValue = cookie.value;
    });
}
fetchTokenValue();

function disableAnnotator() {

}
function initAnnotator() {
    console.log("Adding annotator to body");
    if (tokenValue != "") {

        chrome.tabs.insertCSS(null, { file: "css/jquery-ui.css" }, function () {
            chrome.tabs.insertCSS(null, { file: "css/annotator.min.css" });
        });

        chrome.tabs.executeScript(null, { file: "js/jquery-2.1.3.min.js" }, function () {
            chrome.tabs.executeScript(null, { file: "js/jquery-ui.min.js" }, function () {
                chrome.tabs.executeScript(null, { code: 'var tokenValue=' + tokenValue }, function () {
                    chrome.tabs.executeScript(null, { file: "js/annotator-full.min.js" }, function () {
                        chrome.tabs.executeScript(null, { file: "js/annotate.js" });
                    })
                })
            })
        });
    } else {
        alert("Token not set yet!");
    }
    
}
        
chrome.contextMenus.create(
{
    "title": "Enable Annotations",
    "contexts": ["page", "selection"],
    "onclick": initAnnotator
});

chrome.tabs.onUpdated.addListener(function (tabId, changeinfo, tab) {
    var url = tab.url;
    if (url !== undefined && changeinfo.status == "complete") {
        
        $.ajax({
            method: "GET",
            url: "http://localhost:5555/api/SourceDataForExtension",
            dataType: "json",
            headers: { "X-Notocol-Token": tokenValue },
            data:
            {
                pageURL: tab.url
            },
            success: function (data) {
                if (data) {
                    var annCheck=0;
                    if (data.Annotations) {
                        initAnnotator();
                        
                    }
                }else {
                    
                }

            }
        });
    }
});


