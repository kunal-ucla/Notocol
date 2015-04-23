var tokenValue="";
//alert("Loading background script");

function fetchTokenValue(){
    chrome.cookies.get({ "url": 'http://localhost:5555', "name": 'UserInfo' }, function (cookie) {
        if (cookie == null) return;
        console.log(cookie.value);
        tokenValue = cookie.value;
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
                //alert("Token not set yet!");
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
            console.log("Tab refreshed with status:" + changeinfo.status +"for URL:"+ url);
            if (url !== undefined && changeinfo.status == "complete") {
                console.log("Fetching data");
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
                            var annCheck = 0;
                            if (data.Annotations) {
                                console.log("Initialising annotator")
                                //This check is expected to prevent handling of the devtool opening.. But its not working now
                                if (tab.url.indexOf("chrome-devtools://") == -1) {
                                    initAnnotator();
                                }

                            }
                        } else {

                        }

                    }
                });
            }
        });
    });
}
fetchTokenValue();



function checkForToken(port)
{
   if (tokenValue == "") {
        var newURL = "http://localhost:5555/";
        chrome.tabs.create({ url: newURL });
   } else {
       port.postMessage(tokenValue);
   }
};

chrome.extension.onConnect.addListener(function (port) {
    console.log("Connected .....");
    port.onMessage.addListener(function (msg) {
        checkForToken(port);
        //console.log("message recieved " + msg);
        //port.postMessage("Hi Popup.js");
    });
});

chrome.runtime.onMessageExternal.addListener(
function (request, sender, sendResponse) {
    //alert("Reload received");
    if (request.reloadExtension)
        chrome.runtime.reload();
});