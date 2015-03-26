$(document).ready(function ()
{
    if (annotateInit == undefined) {
        //TODO Need to use another way to check, 
        //this is not working since one content script cannot access other sript's variable
        var annotateInit = 1; 
        var content = $('body');
        content.annotator();
        Annotator.Plugin.UpdateSourceWithAnnotation = function (element, options) {
            var myPlugin = {};
            var possibleSelectedTags;
            var pageURL = window.location.href;
            console.log("Current URL is " + pageURL);
            function addAnnotation(annotation) {
                /*for (var i = 0; i < annotations.tags.length; i++) {
                    tagData[i] = {
                        "ID": i,
                        "Name": annotations.tags[i],
                        "ParentID": "1",
                        "UserID": "2"
                    };
                }*/
                
                var AnnData = {
                    'pageURL': 'jkjk',
                    'userI': 2,
                    'objAnnotationData': 'str2CheckFromBody'
                }
                
                console.log(AnnData);
                // Script to add Source to database.
                $.ajax({
                    type: 'POST',
                    //dataType: "application/json", //TODO Commenting since extension throws error on this
                    //contentType: 'application/json',
                    data: AnnData,
                    url: 'http://localhost:5555/api/Annotation'
                }).success(function (data) {
                    alert("Annotation Saved");
                }).error(function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("Failed to save annotation");
                });
            
            };

            function upDateAnnotation(annotations) {

            };

            myPlugin.pluginInit = function () {
                // This annotator instance
                this.annotator
                    //Tag the pages with tag in the annotation
                    .subscribe("annotationCreated", addAnnotation)
                    
            };
            return myPlugin;
        };

        content.annotator().annotator('addPlugin', 'UpdateSourceWithAnnotation');
        content.annotator().annotator('addPlugin', 'Tags');
        content.data('annotator').plugins.Tags.input.autocomplete({
            //    source: availableTags
            source: function (request, response) {
                $.ajax({
                    url: "http://localhost:5555/api/Tag",
                    dataType: "json",
                    data: {
                        strSearch: request.term
                    },
                    success: function (data) {
                        possibleSelectedTags = data;
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
        });
                
           
        console.log("Added annotator");
    }else
        console.log("Already added annotator, not addding again");
});