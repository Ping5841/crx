'use strict';

// 简历详情页 才可用 pageaction
if (location.href.match(/zp\.html$/)) {
    chrome.runtime.sendMessage({type: 'icon', showIcon: true})
} else {
    chrome.runtime.sendMessage({type: 'icon', showIcon: false})
}

// 监听消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
  switch (request.cmd) {
    case 'hello': 
      alert('hello popup, message from zp.js')
      break
    case 'getData':
      var data = getCandidateInfo()
      sendResponse(data)
    case 'getHTML':
      var html = getHTML()
      sendResponse(html)
    default:
  }
});

function getCandidateInfo () {
  var base = getBasicInfo()
  var desired = getDesired()
  var eduction = getEducation()
  var work = getWorkInfo()
  var pro = getProInfo()
  var evaluation = getEvaluation()
  var other = getOther()
  return {
    href: location.href,
    base: base,
    desired: desired,
    work: work,
    pro: pro,
    eduction: eduction,
    other: other,
    evaluation: evaluation
  }
}

// 基本信息
function getBasicInfo () {
  /*
  * nameZh 中文名
  * email 中文名
  * phone 中文名
  * sex 性别
  * studioTime 工作年限
  * birth 生日
  * nowCity 当前城市  上海-浦东
  * maritalStatus 婚姻状态
  * qualifications 学历,
  * currentYearlySalary 当前年薪
  * currentYearlySalaryRemark 年薪备注
  * */
  
  var nameZh = $('#name').text().trim()
  var phone = $('.user-info .cellphone').first().text().trim().match(/\d+/)
  phone = phone ? phone[0] : ''
  var email = $('.user-info .email').first().find('a').text().trim()
 
  var maritalStatus = ''
  var marital = $('.user-info .marry').first().text().trim()

  //  这里有可能 直接没有已婚和未婚
  if (marital.indexOf('已婚') !== -1) {
    maritalStatus = '已婚'
  } else if (marital.indexOf('未婚') !== -1) {
    maritalStatus = '未婚'
  }
  
  var sexInfo = $('.user-info .sex').first().text().trim()
  var sex = ''
  //  这里有可能 直接没有性别
  if (sexInfo.indexOf('女') !== -1) {
    sex = '女'
  } else if (sexInfo.indexOf('男') !== -1) {
    sex = '男'
  }

  
  var birth = $('.user-info .birthday').first().text().trim()
  
  var studioTime = $('.user-info .work-experience').first().text().trim()
  studioTime = studioTime.match(/(\d+)\s*年工作经验/)
  studioTime = studioTime ? studioTime[1] : 0

  

  
  var qualifications = $('.user-info .education').first().text().trim()
  
  var nowCity = $('.user-info .living-place').first().text().trim()
  nowCity = nowCity.replace(/现居住地(：|:)\s*/ ,'')

  var currentYearlySalary =  ''
  var currentYearlySalaryRemark = ''
  
  
  return {
    phone: phone,
    email: email,
    nameZh: nameZh,
    maritalStatus: maritalStatus,
    sex: sex,
    studioTime: studioTime,
    birth: birth,
    nowCity: nowCity,
    qualifications: qualifications,
    currentYearlySalary: currentYearlySalary,
    currentYearlySalaryRemark: currentYearlySalaryRemark,
  }
}

// 期望信息
function getDesired () {
  /*
  * desiredCitys 期望城市集合
  * desiredJob 期望职位
  * desiredYearlySalary 期望年薪
  * desiredYearlySalaryRemark 年薪备注
  * industries 期望行业
  * */
  var desiredCitys,
    desiredJob,
    desiredYearlySalary,
    desiredYearlySalaryRemark,
    industries
  $('.job-intention-area .content > table .item').each(function () {
    var key = $(this).find('td').eq(0).text().trim()
    var value = $(this).find('td').eq(1).text().trim()
    if (key.match(/工作地点/)) {
      desiredCitys = value
    } else if (key.match(/期望从事职业/)) {
      desiredJob = value
    } else if (key.match(/期望行业/)) {
      industries = value
    } else if (key.match(/期望薪资/)) {
      desiredYearlySalary = value
    }
  })
 
  return {
    desiredCitys: desiredCitys, // 期望城市集合
    desiredJob: desiredJob, // 期望职位
    desiredYearlySalary: desiredYearlySalary, // 期望年薪
    desiredYearlySalaryRemark: desiredYearlySalaryRemark, // 年薪备注
    industries: industries // 期望行业
  }
}

// 工作信息
function getWorkInfo () {
  /*
  * companyName: 公司名,
  * companyDesc: 描述,
  * jobName: 职位,
  * department: 部门,
  * leader: 汇报对象,
  * areaType: 'sys' 所在地区,
  * areaId: 所在地区,
  * subordinateCount: 下属人数,
  * workTime: 工作时间,
  * yearlySalary: 年薪,
  * yearlySalaryRemark: 年薪备注,
  * duty: duty,
  * achievement: 业绩,
  * leavingReason: 离职原因
  * */
  var work = []
  var workEls = $('.resume-detail-container .work-experience-area .content')
  workEls.each(function (index) {
    var detail = $(this)
    var leader = '' ,
      subordinateCount = 0,
      department = '',
      area = '',
      leavingReason = '',
      achievement = ''

    var workTime = detail.find('.work-time').text().trim().replace(/[(（].*[）)]/, '')
    var duty = detail.find('.desc-item').html()
    
    var companyName = detail.find('.company-name').text().replace(/[(（].*[）)]/,'').trim()
    var companyDesc = detail.find('.industry').text().trim()
    var companyDesc2 = detail.find('.company-nature').text().trim()
    if (companyDesc2) {
      companyDesc = companyDesc + '\n' + companyDesc2
    }
    
    var jobName = detail.find('.company-post').text().trim()
    var yearlySalary = detail.find('.monthly-salary').text().trim()
    var yearlySalaryRemark = yearlySalary
    yearlySalary = yearlySalary.match(/(\d*)元\/月/) || 0
    if (yearlySalary) {
      yearlySalary = parseInt(yearlySalary[yearlySalary.length - 1]) || 0
      yearlySalary = yearlySalary * 12
    }
    
    var item = {
      area: area,
      companyName: companyName,
      companyDesc: companyDesc,
      jobName: jobName,
      department: department,
      leader: leader,
      subordinateCount: subordinateCount,
      workTime: workTime,
      yearlySalary: yearlySalary,
      yearlySalaryRemark: yearlySalaryRemark,
      duty: duty,
      achievement: achievement,
      leavingReason: leavingReason
    }
    work.push(item)
  })
  return work
}

// 项目信息
function getProInfo () {
  var proInfo = []
  $('.resume-detail-container .project-experience-area .content').each(function () {
    var detail = $(this)
    /*
    * companyName: 公司名,
    * jobName: 职位,
    * projectDesc: 项目描述,
    * projectDuty: 项目职责,
    * projectAchievement: 项目业绩,
    * time: 时间
    * */
    var data = {
      companyName: '-',
      jobName: '-',
      projectName: '-',
      projectDesc: '-',
      projectDuty: '-',
      projectAchievement: '-',
    }
    data.projectName = detail.find('.project-name').text().trim()
    data.time = detail.find('.work-time').text().trim()
    data.projectDuty = detail.find('.duty-desc .desc-item').html()
    proInfo.push(data)
  })
  return proInfo
}

// 获取教育经历
function getEducation () {
  /*
   * schoolName: 学校名字
   * majorName: 专业
   * time: 时间
   * qualifications: 学历
   * theEntranceExamination: 是否统招
   * */
  var education = []
  $('.resume-detail-container .education-area .content').each(function () {
    // 学历和专业

    var qualifications = $(this).find('span').eq(6).text().trim()
    var majorName = $(this).find('span').eq(4).text().trim()
    var schoolName = $(this).find('span').eq(2).text().trim()
    var time = $(this).find('span').eq(0).text().trim()
   
  
    var item = {
      schoolName: schoolName,
      majorName: majorName,
      time: time,
      qualifications: qualifications,
      theEntranceExamination: false
    }
    education.push(item)
  })
  return education
}

// 自我评价内容
function getEvaluation () {
  return $('.self-assessment-area .content').html()
}

// 其他信息
function getOther () {
  
  // 语言
  var language = ''
  $('.resume-detail-container .language-area .content').each(function () {
    language = language
      + $(this).find('.language-item td').eq(0).text().trim()
      + ' '
      + $(this).find('.language-item td').eq(1).text().trim()
      + ' '
      + $(this).find('.language-item td').eq(2).text().trim()
      + '<br>'
  })
  // 证书
  var cert = ''
  $('.resume-detail-container .certificate-area .certificate-item').each(function () {
    cert = cert
      + $(this).find('td').eq(0).text().trim()
      + ' '
      + $(this).find('td').eq(1).text().trim()
      + '<br>'
  })

  return {
    language: language,
    cert: cert
  }
}

function getHTML (phone, ) {
  var obj = $('div.mainbox').clone()
  obj.find('script').remove()
  var html = obj.html() || 'error'
  html = '<!DOCTYPE html>' +
    '<html lang="en">' +
    '<head>' +
    '<meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '<meta http-equiv="X-UA-Compatible" content="ie=edge" >' +
    '<title>简历</title>' +
    '<link href="https://github.com/Ping5841/crx/blob/master/test_page/zp/base.css" rel="stylesheet">' +
    '<link href="https://github.com/Ping5841/crx/blob/master/test_page/zp/index.css" rel="stylesheet">' +
    '<link href="https://github.com/Ping5841/crx/blob/master/test_page/zp/normal.css" rel="stylesheet">' +
    '<link href="https://github.com/Ping5841/crx/blob/master/test_page/zp/resumepreview.css" rel="stylesheet">' +
    '<link href="https://github.com/Ping5841/crx/blob/master/test_page/zp/HtoCResume.css" rel="stylesheet">' +
    '<style> body {font-size: 14px;} .lx2-resume { margin: auto; }</style>' +
    '</head >' +
    '<body>' +
    '<div class="mainbox lx2-resume">'
    + html +
    '</div></body></html >'
  return html
}
