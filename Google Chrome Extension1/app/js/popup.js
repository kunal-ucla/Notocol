$(document).ready(function () {
    $("#myTags").tagit({ allowSpaces: true });
    $(".ui-autocomplete-input").attr("placeholder", "Enter tags");
    $("#page_title").val(document.title);
    $("#page_url").val(window.location.href);
    $('#saveSource').on("click", function () {


        var url = $("#page_url").val();
        var note = $("#page_summary").val();
        //var tagnames = $("#page_tag").val().split(",");
        var title = $("#page_title").val();
        alert("Sending data url=" + url + "Note=" + note + "tags=" + $("#page_tag").val() + "title=" + title);
        var tagData = [];

        for (var i = 0; i < $(".tagit-label").length; i++) {
            tagData[i] = {
                "ID": i,
                "Name": $(".tagit-label")[i].innerHTML,
                "ParentID": "1",
                "UserID": "2"
            };
        }

        var srcData = {
            "Source": {
                "ID": 0,
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
            dataType: "application/json",
            data: srcData,
            url: 'http://localhost:5555/api/Source',
            success: function (data) {
                alert(data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
    });
});