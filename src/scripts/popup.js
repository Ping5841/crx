'use strict';
/**
 * Created by ping on 2018/5/5.
 */

$(function () {
  $('.send-msg').on('click', function () {
    sendMessageToContentScript({ cmd: 'hello' })
  })

  $('.capture').on('click', function () {
    sendMessageToContentScript({ cmd: 'getData' }, onGetTalentInfo)
  })

  $('.open-internal').on('click', function () {
    createTab('html/internal.html')
  })

  $('.open-baidu').on('click', function () {
    createTab('https://www.baidu.com')
  })

  $('.preview').on('click', function () {
    sendMessageToContentScript({ cmd: 'getHTML' }, onGetHTML)
  })

  $('.download').on('click', function () {
    sendMessageToContentScript({ cmd: 'getHTML' }, onDownload)
  })
})


function onGetTalentInfo (res) {
  $('#text').text(JSON.stringify(res))
}

function onGetHTML (html) {
  $('iframe').attr('srcdoc', html).show()
}

function onDownload (html) {
  var blob = new Blob([html], { type: 'text/html' })
  var url = URL.createObjectURL(blob)
  var a = document.createElement('a')
  a.download = 'resume.html'
  a.style.display = 'none'
  a.href = url
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}



// 与content script 通信
function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
  {
    chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
      if(callback) callback(response);
    });
  });
}

// 打开新tab
function createTab(url) {
  chrome.tabs.create({ "url": url, "selected": true });
  window.close()
}
