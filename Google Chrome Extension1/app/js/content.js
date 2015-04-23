//chrome.runtime.onMessage.addListener(
//  function (request, sender, sendResponse) {
//      //var gain = request.gen.range.start.split("/");
//      //var x = $("document.all[0]")
//      //if (request.greeting == "dom")
//          sendResponse(document.all[0]);
//  });


function scrollToRange(range) {
    var str_array = range.substr(1).split('/');
    var check_annotator = $("body").find(".annotator-wrapper");
    if(check_annotator.length > 0)
        element = check_annotator[0];
    else
        element = $('body');
    
    //var element = $('.annotator-wrapper');
    for (var i = 0; i < str_array.length; i++) {
        
        var elementDetalArray = str_array[i].split(/[\[\]]+/);
        var child_type = elementDetalArray[0];
        var child_number = elementDetalArray[1]-1;
          // alert(str_array[i]+" "+child_type+" "+child_number);

        element = $(element).children(child_type).eq(child_number);
        // 

    }
    //$('body').children('ul').eq(0).children('li').eq(1).css('background', 'red');
   // alert(element.attr('id'));
    $('html, body').animate({
        scrollTop: $(element).offset().top
    }, 1000);

    //$(element).css('background', 'red');
}



chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {

    if (msg.action == 'scrollToRange') {
       // alert("Range scroll recieved!" + msg.range);
        scrollToRange(msg.range);
    }
});