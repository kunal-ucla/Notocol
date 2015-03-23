$(document).ready(function () {
    var content = $('body');
    //content.annotator();
    var url = document.URL;
    content.annotator('addPlugin', 'Auth', {
        tokenUrl: 'http://127.0.0.1:5000/genToken',
        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3N1ZWRBdCI6IjIwMTUtMDMtMjNUMTE6MDM6MzlaIiwidHRsIjo4NjQwMCwidXNlcklkIjoiMiIsImNvbnN1bWVyS2V5IjoiYTBhMTUxNWY1MTkwNDU3ODhhOTU2ZmVjMTM5ZjIwYzQifQ.ClPMybi6M-OOlUSP6IfOvwocVNgrB0WvFrKL40AFKYY'
    });

    content.annotator('addPlugin', 'Store', {
        // The endpoint of the store on your server.
        prefix: 'http://localhost:5555/api/Annotation',
        //prefix: 'http://annotateit.org/api',
        
        //Attach the uri of the current page to all annotations to allow search.
        annotationData: {
            'uri': url
        },

        // This will perform a "search" action when the plugin loads. Will
        // request the last 20 annotations for the current url.
        // eg. /store/endpoint/search?limit=20&uri=http://this/document/only
        loadFromSearch: {
            'limit': 20,
            'uri': url
        }
    });
});
