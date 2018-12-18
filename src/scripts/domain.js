'use strict';
/**
 * Created by ping on 2018/8/15.
 */

$(function () {
  var domain = localStorage.domain
  $('.input').val(domain)
  $('.save-btn').on('click', function () {
    var url = $('.input').val()
    if (/[a-zA-Z0-9]+\.[a-zA-Z0-9]+/.test(url)) {
      console.log(url)
      if (url.substr(url.length - 1) === '/') {
        url = url.substring(0, url.length - 1)
      }
      localStorage.domain = url
      alert('保存成功, 插件已更新')
      window.close()
    } else {
      alert('域名输入有误, 请检查')
    }
  })
})