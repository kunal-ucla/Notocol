chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
      //var gain = request.gen.range.start.split("/");
      //var x = $("document.all[0]")
      //if (request.greeting == "dom")
          sendResponse(document.all[0]);
  });