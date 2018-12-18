
// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.type) {
    case 'icon':
      showIcon(request.showIcon)
      break
    default:
      console.log(request)
  }
});

function showIcon (show) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (show) {
      chrome.pageAction.show(tabs[0].id)
    } else {
      chrome.pageAction.hide(tabs[0].id)
    }
  })
}
