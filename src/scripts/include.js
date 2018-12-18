'use strict';
/**
 * 全局函数
 * Created by ping on 2018/5/5.
 */

window.util = {
  getSalaryMax (str) {
    var temp = str.match(/\d+/g)
    if (temp) {
      return temp[temp.length - 1]
    }
    return 0
  },
  getSalaryMin (str) {
    var temp = str.match(/\d+/g)
    return temp ? temp[0] : 0
  }
}
