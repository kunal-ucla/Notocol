$(function () {
    $.ajaxSetup({
        
    });
    //$(document.body).annotator();
    var pageURL = window.location.href;
    var title = document.title;
    var content = $('body');
    
    content.annotator();
    content.annotator('addPlugin', 'Tags')
    content.data('annotator').plugins.Tags.input.autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "http://localhost:5555/api/Tag",
                dataType: "json",
                headers: { "X-Notocol-Token": tokenValue },
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
    })
    content.annotator('addPlugin', 'Store', {
        // The endpoint of the store on your server.
        prefix: 'http://localhost:5555/api/Annotation',
        annotationData: {
            'uri': pageURL,
            'title':title
        },

        loadFromSearch: {
            'uri': pageURL
            

        }
    });
    console.log("Added annotator");
});
/*
if (typeof Annotator !== 'function') {
    alert("Function not found");
} else {
    // alert("Adding annotator");
    $(document.body).annotator()

   
    
    console.log("Added annotator");
}*/