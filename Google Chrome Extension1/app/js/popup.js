$(document).ready(function () {

    $("#page_note").focusout(function () {
        $("#page_note").css({"height":"63px","transition":"0.2s ease-in-out","transition-property":"height"});
    });
    $("#myTags").focusin(function () {
        $("#myTags").removeClass("hclass");
    });
    $("#myTags").focusout(function () {
        $("#myTags").addClass("hclass");
    });

    var tokenValue = "";
    var port = chrome.extension.connect({ name: "Sample Communication" });
    port.postMessage("checkToken");
    port.onMessage.addListener(function (msg) {
        if (msg) {
            console.log("Token received:" + msg);
            tokenValue = msg;
        }
    
   
        var url;
        var sourceID = 0;
        var tabID = 0;
        var pageUrl = "";
        var pageTitle = "";


        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            pageUrl = tabs[0].url;
            pageTitle = tabs[0].title;
            tabID = tabs[0].id;
            //alert(pageTitle);
            $('#pageTitle').val(pageTitle);
        

           function getAnnotationElementHtml(annotation){
                var htmlString = "";
                var quote_string;
        
                quote_string = annotation.quote;
        

                if (quote_string.length > 60) {
                    quote_string = quote_string.substring(0, 60);
                    quote_string +="...";
                }
                htmlString += "<button class='annotation'>" +
                                "<span class='annotation-filler'></span>" +
                                "<div class='annotation-text'>\"" + quote_string + "\"</div>" +
                                "<p hidden='hidden' class='range-value'>" + annotation.range.start + "</p>" +
                               "</button>"

                return htmlString;
            }
           function getPopUpData(data) {
               console.log(data);
               if (data && data.Source) {

                   sourceID = data.Source.id;
                   //alert(data.Source.summary);
                   if (data.Source.summary) $('#page_note').val(data.Source.summary);
                   if (data.Tags) {
                       for (var i = 0; i < data.Tags.length; i++) {
                           $("#myTags").tagit({
                               afterTagAdded: function (event, ui) {
                                   var obj = document.getElementsByClassName("tagit-label");
                                   var ind = obj.length - 1;
                                   obj[ind].className += ' ' + data.Tags[i].id;
                               }
                           });
                           $("#myTags").tagit('createTag', data.Tags[i].tagName);
                           $("#myTags").tagit({
                               afterTagAdded: function (event, ui) {
                                   var obj = document.getElementsByClassName("tagit-label");
                                   var ind = obj.length - 1;
                                   //obj[ind].className += ' ' + 'new';
                                   $.ajax({
                                       url: "http://localhost:5555/api/Tag",
                                       dataType: "json",
                                       data: {
                                           strSearch: ui.tagLabel
                                       },
                                       headers: { "X-Notocol-Token": tokenValue },
                                       success: function (data2) {
                                           $.map(data2, function (item) {
                                               obj[ind].className += ' ' + item.ID;
                                               /*return {
                                                   label: item.Name, //Use rest of the data to map IDs
                                                   value: item.Name,
                                                   ID: item.ID
                                               }*/
                                           });
                                       },
                                       error: function (xhr, textStatus, errorThrown) {
                                           obj[ind].className += ' ' + 0;
                                       }
                                   });
                               }
                           });
                       }
                   }
                   if (data.Annotations) {

                       var annotationDataHtmlString = "<div class='annotation-container'>"
                       for (var i = 0; i < data.Annotations.length; i++) {
                           annotationDataHtmlString += getAnnotationElementHtml(data.Annotations[i]);
                       }
                       annotationDataHtmlString += "</div>";

                       document.getElementById("annotation-list").innerHTML += annotationDataHtmlString

                       $('.annotation').click(function () {
                           // alert("Click check!");
                           var range = ($(this).children('.range-value').text());
                           chrome.tabs.sendMessage(tabID, { action: "scrollToRange", range: range }, function (response) { });
                       });

                   }
               }
           }
           console.log("pageURL:" + pageUrl + " pageTitle:" + pageTitle + "  tabID:" + tabID + "tokenvalue: " + tokenValue);
            //chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            $.ajax({
                    method: "GET",
                    url: "http://localhost:5555/api/SourceDataForExtension",
                    dataType: "json",
                    headers: { "X-Notocol-Token": tokenValue },
                    data:
                    {
                        pageURL: pageUrl
                    },
                    success: function (data) {
                        console.log("Ajax response received with data as "+data);
                        getPopUpData(data);
                     
                    }
                });
     

            $("#myTags").tagit({
                afterTagAdded: function (event, ui) {
                    var obj = document.getElementsByClassName("tagit-label");
                    var ind = obj.length - 1;
                    //obj[ind].className += ' ' + 'new';
                    $.ajax({
                        url: "http://localhost:5555/api/Tag",
                        dataType: "json",
                        data: {
                            strSearch: ui.tagLabel
                        },
                        headers: { "X-Notocol-Token": tokenValue },
                        success: function (data) {
                            $.map(data, function (item) {
                                obj[ind].className += ' ' + item.ID;
                                /*return {
                                    label: item.Name, //Use rest of the data to map IDs
                                    value: item.Name,
                                    ID: item.ID
                                }*/
                            });
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            obj[ind].className += ' ' + 0;
                        }
                    });
                },
                allowSpaces: true,
                placeholderText:"Add Tags",
                showAutocompleteOnFocus: true,
                singleField:true,
                autocomplete: {
                    source: function (request, response) {
                        $.ajax({
                            url: "http://localhost:5555/api/Tag",
                            dataType: "json",
                            data: {
                                strSearch: request.term
                            },
                            headers: { "X-Notocol-Token": tokenValue },
                            success: function (data) {
                                response($.map(data, function (item) {
                                    return {
                                        label: item.Name, //Use rest of the data to map IDs
                                        value: item.Name,
                                        ID: item.ID
                                    }
                                }));
                            }
                        });
                    },
                    minLength: 1,
                    select: function (event, ui) {
                        alert(ui.item.label + "=" + ui.item.ID);
                    }
                }
            });

            //$(".ui-autocomplete-input").attr("placeholder", "Add tags");
            $(function () {
                $("#myTags").removeClass("ui-corner-all");
                $(".ui-autocomplete-input").focus(function () {
                    $("#myTags").addClass("blur");
                });
                $(".ui-autocomplete-input").focusout(function () {
                    $("#myTags").removeClass("blur");
                });
            });
    


            $('#save').click( function () {

                var url = pageUrl;
                var note = $("#page_note").val();
                var title = pageTitle;
        
                var tagData = [];
                
                for (var i = 0; i < $(".tagit-label").length; i++) {
                    var finId = parseInt($(".tagit-label")[i].className.replace("tagit-label ", ""));
                    if (isNaN(finId) == true) finId = 0;
                    tagData[i] = {
                        "ID": finId,
                        "Name": $(".tagit-label")[i].innerHTML,
                        "ParentID": "1",
                        "UserID": ""
                    };
                }

                var srcData = {
                    "Source": {
                        "ID": sourceID,
                        "UserID": 0,
                        "Title": title,
                        "Link": url,
                        "Summary": note,
                        "ReadLater": false,
                        "SaveOffline": false,
                        "Privacy": false,
                        "Rating": 0,
                        "ModifiedAt": Date()
                    },
                    "Tags": tagData,
                    "Annotations":[]
                }

                // Script to add Source to database.
                $.ajax({
                    type: "POST",
                    //dataType: "application/json", //TODO Commenting since extension throws error on this
                    data: srcData,
                    headers: { "X-Notocol-Token": tokenValue },
                    url: 'http://localhost:5555/api/Source'
                }).success(function (data) {
                    document.body.innerHTML += "<b><center>Saved</b></center>";
                    setTimeout(function () {
                        window.close();
                    }, 500);
                }).error(function(XMLHttpRequest, textStatus, errorThrown) {
                    document.body.innerHTML += "<b><center>Sorry...NOT saved</b></center>";
                });
            });
        });
    });
});