$(document).ready(function () {
    $("#myTags").tagit();
    $(".ui-autocomplete-input").attr("placeholder", "Enter tags");
    $("#page_title").val(document.title);
    $("#page_url").val(window.location.href);
});