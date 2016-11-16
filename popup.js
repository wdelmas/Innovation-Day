function sendClicks() {
  console.log("popup.js > launch analysis");

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
      console.log("response", response)
    })
  })
}

$(function() {
  $('button').click(function(){
    sendClicks();
  });
});
