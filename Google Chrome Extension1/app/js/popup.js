$(document).ready(function () {
    var url;
    var sourceID = 0;
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        $("#page_url").val(tabs[0].url);
        $("#page_title").val(tabs[0].title);
    });

    /* Get the pre-existing source details for following:
      1) Assigned user tags
      2) Note/Description by user
      3) Tags
      4) Annotations
    */

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { greeting: "dom" }, function (response) {
            console.log(response);
        });
    });


    $("#myTags").tagit({
        allowSpaces: true,
        showAutocompleteOnFocus: true,
        autocomplete: {
            source: function (request, response) {
                $.ajax({
                    url: "http://localhost:5555/api/Tag",
                    dataType: "json",
                    data: {
                      strSearch: request.term
                    },
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
                console.log(ui.item.label + "=" + ui.item.ID);
            }

        }

    });

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        $.ajax({
            method:"GET",
            url: "http://localhost:5555/api/SourceDataForExtension",
            dataType: "json",
            data:
            {
                pageURL:tabs[0].url,
                userID: 2
            },
            success: function (data)
            {
                sourceID = data.Source.id;
                for (var i = 0; i < data.Tags.length; i++) $("#myTags").tagit('createTag', data.Tags[i].tagName);
                for (var i = 0; i < data.Annotations.length; i++) document.getElementById("myAnns").innerHTML+="<div class='myAnnList'>"+data.Annotations[i].quote+"</div>";
            }
        });
    });

    $(".ui-autocomplete-input").attr("placeholder", "Enter tags");
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

        var url = $("#page_url").val();
        var note = $("#page_summary").val();
        //var tagnames = $("#page_tag").val().split(",");
        var title = $("#page_title").val();
        //alert("Sending data url=" + url + "Note=" + note + "tags=" + $("#page_tag").val() + "title=" + title);
        var tagData = [];

        for (var i = 0; i < $(".tagit-label").length; i++) {
            tagData[i] = {
                "ID": 0,
                "Name": $(".tagit-label")[i].innerHTML,
                "ParentID": "1",
                "UserID": "2"
            };
        }

        var srcData = {
            "Source": {
                "ID": sourceID,
                "UserID": 2,
                "Title": title,
                "Link": url,
                "Summary": note,
                "ReadLater": false,
                "SaveOffline": false,
                "Privacy": false,
                "Rating": 0,
                "ModifiedAt": Date()
            },
            "Tags": tagData
        }

        // Script to add Source to database.
        $.ajax({
            type: "POST",
            //dataType: "application/json", //TODO Commenting since extension throws error on this
            data: srcData,
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