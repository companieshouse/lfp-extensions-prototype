const express = require('express')
const router = express.Router()

const async = require('async')
const fs = require('graceful-fs')
const path = require('path')
const del = require('del')

// Sign in pages

router.get('/', function (req, res) {
  res.render('start')
})
router.get('/start', function (req, res) {
  res.render('start')
})
router.get('/signin', function (req, res) {
  res.render('signin')
})
router.post('/signin', function (req, res) {
  req.session.userEmail = req.body.email
  res.redirect('company-number')
})
router.get('/company-number', function (req, res) {
  res.render('company-number')
})
router.post('/company-number', function (req, res) {
  var companyNumber = req.body.companyNumber
  var errorFlag = false
  var Err = {}
  var errorList = []
  var file = ''
  var savedSession = {}

  if (companyNumber === '') {
    Err.type = 'blank'
    Err.text = 'You must enter a company number'
    Err.href = '#company-number'
    Err.flag = true
  }
  if (Err.flag) {
    errorList.push(Err)
    errorFlag = true
  }
  if (errorFlag === true) {
    res.render('company-number', {
      errorList: errorList,
      Err: Err
    })
  } else {
    if (fs.existsSync('public/saved-sessions/' + companyNumber + '.json')) {
      file = 'public/saved-sessions/' + companyNumber + '.json'
      fs.readFile(file, function (err, data) {
        if (err) {
          return done(err, data)
        }
        savedSession = JSON.parse(data)
        req.session.userEmail = savedSession.userEmail
        req.session.scenario = savedSession.scenario
        req.session.extensionReasons = savedSession.extensionReasons
        res.redirect('resume-application')
      })
    } else {
      req.session.scenario = require('./assets/scenarios/' + companyNumber)
      req.session.extensionReasons = []
      res.redirect('confirm-company')
    }
  }
})

router.get('/resume-application', function (req, res) {
  var userEmail = req.session.userEmail
  var scenario = req.session.scenario
  var extensionReasons = req.session.extensionReasons

  res.render('resume-application', {
    scenario: scenario,
    userEmail: userEmail,
    extensionReasons: extensionReasons
  })
})
router.post('/resume-application', function (req, res) {
  res.render('confirm-company', {
    scenario: req.session.scenario
  })
})
router.get('/confirm-company', function (req, res) {
  res.render('confirm-company', {
    scenario: req.session.scenario
  })
})
router.get('/accountsnotdue', function (req, res) {
  res.render('accountsnotdue', {
    scenario: req.session.scenario
  })
})
router.post('/accountsnotdue', function (req, res) {
  res.redirect('accountsnotdue')
})

// Promise to file

router.get('/ptf/ptf', function (req, res) {
  res.render('ptf/ptf', {
    scenario: req.session.scenario
  })
})
router.post('/ptf/ptf', function (req, res) {
  var ptfConfirm = req.body.ptfConfirm
  var errorFlag = false
  var Err = {}
  var errorList = []
  if (ptfConfirm === '_unchecked') {
    Err.type = 'blank'
    Err.text = 'You must declare the company is still active and will file its accounts before continuing'
    Err.href = '#ptfConfirm'
    Err.flag = true
  }
  if (Err.flag) {
    errorList.push(Err)
    errorFlag = true
  }
  if (errorFlag === true) {
    res.render('ptf/ptf', {
      errorList: errorList,
      Err: Err
    })
  } else {
    res.redirect('/ptf/ptfconfirm')
  }
})
router.get('/ptf/ptfconfirm', function (req, res) {
  res.render('ptf/ptfconfirm', {
    scenario: req.session.scenario
  })
})
router.post('/ptf/ptfconfirm', function (req, res) {
  res.redirect('ptfconfirm')
})

// Not in use

router.get('/filing-deadline', function (req, res) {
  res.render('filing-deadline')
})
router.post('/filing-deadline', function (req, res) {
  req.session.extensionApply = req.body.extensionApply

  switch (req.session.extensionApply) {
    case 'yes':
      res.redirect('choose-reason')
      break
    case 'no':
      res.redirect('start')
      break
  }
})

// choose reason

router.get('/choose-reason', function (req, res) {
  var companyNumber = req.session.scenario.company.number
  if (req.query.restart === 'yes') {
    req.session.extensionReasons = []
    del('public/saved-sessions/' + companyNumber + '.json')
    res.render('choose-reason')
  } else {
    res.render('choose-reason')
  }
})
router.post('/choose-reason', function (req, res) {
  var reasonObject = {}
  var extensionReason = req.body.extensionReason
  var otherReason = req.body.otherReason
  var errorFlag = false
  var extensionReasonErr = {}
  var otherReasonErr = {}
  var errorList = []

  if (typeof extensionReason === 'undefined') {
    extensionReasonErr.type = 'blank'
    extensionReasonErr.text = 'You must select a reason'
    extensionReasonErr.href = '#choose-reason'
    extensionReasonErr.flag = true
  }
  if (extensionReason === 'other' && otherReason === '') {
    extensionReasonErr.type = 'invalid'
    extensionReasonErr.text = 'You must tell us the reason'
    extensionReasonErr.href = '#other-reason'
    extensionReasonErr.flag = true
  }
  if (extensionReasonErr.flag) {
    errorList.push(extensionReasonErr)
    errorFlag = true
  }
  if (otherReasonErr.flag) {
    errorList.push(otherReasonErr)
    errorFlag = true
  }
  if (errorFlag === true) {
    req.session.extensionReasons.push(reasonObject)
    res.render('choose-reason', {
      errorList: errorList,
      extensionReasonErr: extensionReasonErr,
      otherReasonErr: otherReasonErr,
      extensionReason: extensionReason,
      otherReason: otherReason
    })
  } else {
    switch (req.body.extensionReason) {
      case 'illness':
        reasonObject.reason = req.body.extensionReason
        req.session.extensionReasons.push(reasonObject)
        res.redirect('/illness/who-was-ill')
        break
      case 'damage':
        reasonObject.reason = req.body.extensionReason
        req.session.extensionReasons.push(reasonObject)
        res.redirect('/theft-criminal-damage/reason-damage')
        break
      case 'disaster':
        reasonObject.reason = req.body.extensionReason
        req.session.extensionReasons.push(reasonObject)
        res.redirect('/natural-disaster/reason-natural-disaster')
        break
      case 'accounts':
        reasonObject.reason = req.body.extensionReason
        req.session.extensionReasons.push(reasonObject)
        res.redirect('/accounts/reason-accounts')
        break
      case 'companyChanges':
        reasonObject.reason = req.body.extensionReason
        req.session.extensionReasons.push(reasonObject)
        res.redirect('/company-changes/reason-company-changes')
        break
      case 'computerProblem':
        reasonObject.reason = req.body.extensionReason
        req.session.extensionReasons.push(reasonObject)
        res.redirect('/computer-problem/reason-computer-problem')
        break
      case 'death':
        reasonObject.reason = req.body.extensionReason
        req.session.extensionReasons.push(reasonObject)
        res.redirect('/death/reason-death')
        break
      case 'other':
        reasonObject.reason = req.body.extensionReason
        reasonObject.otherReason = req.body.otherReason
        req.session.extensionReasons.push(reasonObject)
        res.redirect('other/reason-other')
        break
    }
  }
})

// illness

router.get('/illness/who-was-ill', function (req, res) {
  res.render('illness/who-was-ill')
})
router.post('/illness/who-was-ill', function (req, res) {
  var reasonObject = req.session.extensionReasons.pop()
  var illPerson = req.body.illPerson
  var otherPerson = req.body.otherPerson
  var errorFlag = false
  var illPersonErr = {}
  var otherPersonErr = {}
  var errorList = []

  if (typeof illPerson === 'undefined') {
    illPersonErr.type = 'blank'
    illPersonErr.text = 'You must select a person'
    illPersonErr.href = '#ill-person'
    illPersonErr.flag = true
  }
  if (illPerson === 'Someone else' && otherPerson === '') {
    otherPersonErr.type = 'invalid'
    otherPersonErr.text = 'You must tell us the person'
    otherPersonErr.href = '#other-person'
    otherPersonErr.flag = true
  }
  if (illPersonErr.flag) {
    errorList.push(illPersonErr)
    errorFlag = true
  }
  if (otherPersonErr.flag) {
    errorList.push(otherPersonErr)
    errorFlag = true
  }
  if (errorFlag === true) {
    req.session.extensionReasons.push(reasonObject)
    res.render('illness/who-was-ill', {
      errorList: errorList,
      illPersonErr: illPersonErr,
      otherPersonErr: otherPersonErr,
      illPerson: illPerson,
      otherPerson: otherPerson
    })
  } else {
    reasonObject.illPerson = req.body.illPerson
    reasonObject.otherPerson = req.body.otherPerson
    req.session.extensionReasons.push(reasonObject)
    res.redirect('/illness/illness-start-date')
  }
})
router.get('/illness/illness-start-date', function (req, res) {
  var inputClasses = {}
  inputClasses.day = 'govuk-input--width-2'
  inputClasses.month = 'govuk-input--width-2'
  inputClasses.year = 'govuk-input--width-4'
  res.render('illness/illness-start-date', {
    inputClasses: inputClasses
  })
})
router.post('/illness/illness-start-date', function (req, res) {
  var reasonObject = req.session.extensionReasons.pop()
  var startDay = req.body['illnessStart-day']
  var startMonth = req.body['illnessStart-month']
  var startYear = req.body['illnessStart-year']
  var errorFlag = false
  var startDayErr = {}
  var startMonthErr = {}
  var startYearErr = {}
  var errorList = []
  var illnessStartDate = {}
  var inputClasses = {}

  inputClasses.day = 'govuk-input--width-2'
  inputClasses.month = 'govuk-input--width-2'
  inputClasses.year = 'govuk-input--width-4'

  if (startDay === '') {
    startDayErr.type = 'blank'
    startDayErr.text = 'You must enter a day'
    startDayErr.href = '#illness-start-day'
    startDayErr.flag = true
  }
  if (startDayErr.flag) {
    inputClasses.day = 'govuk-input--width-2 govuk-input--error'
    errorList.push(startDayErr)
    errorFlag = true
  }
  if (startMonth === '') {
    startMonthErr.type = 'blank'
    startMonthErr.text = 'You must enter a month'
    startMonthErr.href = '#illness-start-month'
    startMonthErr.flag = true
  }
  if (startMonthErr.flag) {
    inputClasses.month = 'govuk-input--width-2 govuk-input--error'
    errorList.push(startMonthErr)
    errorFlag = true
  }
  if (startYear === '') {
    startYearErr.type = 'blank'
    startYearErr.text = 'You must enter a year'
    startYearErr.href = '#illness-start-year'
    startYearErr.flag = true
  }
  if (startYearErr.flag) {
    inputClasses.year = 'govuk-input--width-4 govuk-input--error'
    errorList.push(startYearErr)
    errorFlag = true
  }
  if (errorFlag === true) {
    req.session.extensionReasons.push(reasonObject)
    res.render('illness/illness-start-date', {
      errorList: errorList,
      startDayErr: startDayErr,
      startDay: startDay,
      startMonth: startMonth,
      startYear: startYear,
      inputClasses: inputClasses
    })
  } else {
    illnessStartDate.day = req.body['illnessStart-day']
    illnessStartDate.month = req.body['illnessStart-month']
    illnessStartDate.year = req.body['illnessStart-year']
    reasonObject.illnessStartDate = illnessStartDate
    req.session.extensionReasons.push(reasonObject)
    res.redirect('/illness/continued-illness')
  }
})
router.get('/illness/continued-illness', function (req, res) {
  res.render('illness/continued-illness', {
  })
})
router.post('/illness/continued-illness', function (req, res) {
  var reasonObject = req.session.extensionReasons.pop()
  reasonObject.continuedIllness = req.body.continuedIllness
  req.session.extensionReasons.push(reasonObject)
  var continuedIllness = req.body.continuedIllness
  var errorFlag = false
  var Err = {}
  var errorList = []

  if (typeof continuedIllness === 'undefined') {
    Err.type = 'blank'
    Err.text = 'You must tell us if this is a continued illness'
    Err.href = '#continued-illness'
    Err.flag = true
  }
  if (Err.flag) {
    errorList.push(Err)
    errorFlag = true
  }
  if (errorFlag === true) {
    res.render('illness/continued-illness', {
      errorList: errorList,
      Err: Err
    })
  } else {
    switch (req.body.continuedIllness) {
      case 'yes':
        res.redirect('/illness/illness-pre-information')
        break
      case 'no':
        res.redirect('/illness/illness-end-date')
        break
    }
  }
})
router.get('/illness/illness-end-date', function (req, res) {
  var currentReason = {}
  var inputClasses = {}
  currentReason = req.session.extensionReasons.pop()
  req.session.extensionReasons.push(currentReason)
  inputClasses.day = 'govuk-input--width-2'
  inputClasses.month = 'govuk-input--width-2'
  inputClasses.year = 'govuk-input--width-4'
  res.render('illness/illness-end-date', {
    inputClasses: inputClasses,
    scenario: req.session.scenario,
    reason: currentReason
  })
})
router.post('/illness/illness-end-date', function (req, res) {
  var reasonObject = req.session.extensionReasons.pop()
  var endDay = req.body['illnessEndDate-day']
  var endMonth = req.body['illnessEndDate-month']
  var endYear = req.body['illnessEndDate-year']
  var errorFlag = false
  var endDayErr = {}
  var endMonthErr = {}
  var endYearErr = {}
  var errorList = []
  var illnessEndDate = {}
  var inputClasses = {}

  inputClasses.day = 'govuk-input--width-2'
  inputClasses.month = 'govuk-input--width-2'
  inputClasses.year = 'govuk-input--width-4'

  if (endDay === '') {
    endDayErr.type = 'blank'
    endDayErr.text = 'You must enter a day'
    endDayErr.href = '#illness-end-date-day'
    endDayErr.flag = true
  }
  if (endDayErr.flag) {
    inputClasses.day = 'govuk-input--width-2 govuk-input--error'
    errorList.push(endDayErr)
    errorFlag = true
  }
  if (endMonth === '') {
    endMonthErr.type = 'blank'
    endMonthErr.text = 'You must enter a month'
    endMonthErr.href = '#illness-end-date-month'
    endMonthErr.flag = true
  }
  if (endMonthErr.flag) {
    inputClasses.month = 'govuk-input--width-2 govuk-input--error'
    errorList.push(endMonthErr)
    errorFlag = true
  }
  if (endYear === '') {
    endYearErr.type = 'blank'
    endYearErr.text = 'You must enter a year'
    endYearErr.href = '#illness-end-date-year'
    endYearErr.flag = true
  }
  if (endYearErr.flag) {
    inputClasses.year = 'govuk-input--width-4 govuk-input--error'
    errorList.push(endYearErr)
    errorFlag = true
  }
  if (errorFlag === true) {
    req.session.extensionReasons.push(reasonObject)
    res.render('illness/illness-end-date', {
      errorList: errorList,
      endDayErr: endDayErr,
      endMonthErr: endMonthErr,
      endYearErr: endYearErr,
      endDay: endDay,
      endMonth: endMonth,
      endYear: endYear,
      inputClasses: inputClasses
    })
  } else {
    illnessEndDate.day = req.body['illnessEndDate-day']
    illnessEndDate.month = req.body['illnessEndDate-month']
    illnessEndDate.year = req.body['illnessEndDate-year']
    reasonObject.illnessEndDate = illnessEndDate
    req.session.extensionReasons.push(reasonObject)
    res.redirect('/illness/illness-pre-information')
  }
})
router.get('/illness-pre-information', function (req, res) {
  res.render('illness-pre-information')
})
router.post('/illness/illness-pre-information', function (req, res) {
  var provideDetail = req.body.provideDetail
  var errorFlag = false
  var Err = {}
  var errorList = []

  if (typeof provideDetail === 'undefined') {
    Err.type = 'blank'
    Err.text = 'You must tell us if you would like to provide more information'
    Err.href = '#provide-information'
    Err.flag = true
  }
  if (Err.flag) {
    errorList.push(Err)
    errorFlag = true
  }
  if (errorFlag === true) {
    res.render('illness/illness-pre-information', {
      errorList: errorList,
      Err: Err
    })
  } else {
    switch (req.body.provideDetail) {
      case 'yes':
        res.redirect('/illness/illness-information')
        break
      case 'no':
        res.redirect('/evidence')
        break
    }
  }
})

// More reasons

router.get('/add-extension-reason', function (req, res) {
  res.render('add-extension-reason')
})
router.post('/add-extension-reason', function (req, res) {
  var addExtensionReason = req.body.addExtensionReason
  var errorFlag = false
  var Err = {}
  var errorList = []

  if (typeof addExtensionReason === 'undefined') {
    Err.type = 'blank'
    Err.text = 'You must tell us if there is another reason for your extension'
    Err.href = '#add-extension-reason'
    Err.flag = true
  }
  if (Err.flag) {
    errorList.push(Err)
    errorFlag = true
  }
  if (errorFlag === true) {
    res.render('add-extension-reason', {
      errorList: errorList,
      Err: Err
    })
  } else {
    switch (req.body.addExtensionReason) {
      case 'yes':
        res.redirect('/choose-reason')
        break
      case 'no':
        res.redirect('/check-your-answers')
        break
    }
  }
})
router.get('/illness/illness-information', function (req, res) {
  res.render('illness/illness-information')
})
router.post('/illness/illness-information', function (req, res) {
  var illnessInformation = req.body.illnessInformation
  var errorFlag = false
  var Err = {}
  var errorList = []

  if (illnessInformation === '') {
    Err.type = 'blank'
    Err.text = 'You must tell us more information'
    Err.href = '#illness-information'
    Err.flag = true
  }
  if (Err.flag) {
    errorList.push(Err)
    errorFlag = true
  }
  if (errorFlag === true) {
    res.render('illness/illness-information', {
      errorList: errorList,
      Err: Err
    })
  } else {
    var reasonObject = req.session.extensionReasons.pop()
    reasonObject.illnessInformation = req.body.illnessInformation
    req.session.extensionReasons.push(reasonObject)
    res.redirect('/evidence')
  }
})
router.get('/evidence', function (req, res) {
  res.render('evidence')
})
router.post('/evidence', function (req, res) {
  var supportingEvidence = req.body.supportingEvidence
  var errorFlag = false
  var Err = {}
  var errorList = []
  var reasonObject = {}

  if (typeof supportingEvidence === 'undefined') {
    Err.type = 'blank'
    Err.text = 'You must tell us if you want to upload evidence'
    Err.href = '#supporting-evidence'
    Err.flag = true
  }
  if (Err.flag) {
    errorList.push(Err)
    errorFlag = true
  }
  if (errorFlag === true) {
    res.render('evidence', {
      errorList: errorList,
      Err: Err
    })
  } else {
    reasonObject = req.session.extensionReasons.pop()
    reasonObject.supportingEvidence = req.body.supportingEvidence
    req.session.extensionReasons.push(reasonObject)
    console.log(req.session.extensionReasons)
    switch (req.body.supportingEvidence) {
      case 'yes':
        res.redirect('/evidence-upload')
        break
      case 'no':
        res.redirect('/add-extension-reason')
        break
    }
  }
})
router.get('/evidence-upload', function (req, res) {
  res.render('evidence-upload')
})
router.post('/evidence-upload', function (req, res) {
  res.redirect('/add-extension-reason')
})
// Natural disaster
router.get('/natural-disaster/reason-natural-disaster', function (req, res) {
  res.render('natural-disaster/reason-natural-disaster')
})
router.post('/natural-disaster/reason-natural-disaster', function (req, res) {
  var naturalDisaster = req.body.naturalDisaster
  var errorFlag = false
  var Err = {}
  var errorList = []

  if (naturalDisaster === '') {
    Err.type = 'blank'
    Err.text = 'You must give us more information'
    Err.href = '#natural-disaster'
    Err.flag = true
  }
  if (Err.flag) {
    errorList.push(Err)
    errorFlag = true
  }
  if (errorFlag === true) {
    res.render('natural-disaster/reason-natural-disaster', {
      errorList: errorList,
      Err: Err
    })
  } else {
    var reasonObject = req.session.extensionReasons.pop()
    reasonObject.naturalDisaster = req.body.naturalDisaster
    req.session.extensionReasons.push(reasonObject)
    res.redirect('/evidence')
  }
  // theft or criminal damage
})
router.get('/theft-criminal-damage/reason-damage', function (req, res) {
  res.render('theft-criminal-damage/reason-damage')
})
router.post('/theft-criminal-damage/reason-damage', function (req, res) {
  var damage = req.body.damage
  var errorFlag = false
  var Err = {}
  var errorList = []

  if (damage === '') {
    Err.type = 'blank'
    Err.text = 'You must give us more information'
    Err.href = '#damage'
    Err.flag = true
  }
  if (Err.flag) {
    errorList.push(Err)
    errorFlag = true
  }
  if (errorFlag === true) {
    res.render('theft-criminal-damage/reason-damage', {
      errorList: errorList,
      Err: Err
    })
  } else {
    var reasonObject = req.session.extensionReasons.pop()
    reasonObject.damage = req.body.damage
    req.session.extensionReasons.push(reasonObject)
    res.redirect('/evidence')
  }
  // accounts
})
router.get('/accounts/reason-accounts', function (req, res) {
  res.render('accounts/reason-accounts')
})
router.post('/accounts/reason-accounts', function (req, res) {
  var accounts = req.body.accounts
  var errorFlag = false
  var Err = {}
  var errorList = []

  if (accounts === '') {
    Err.type = 'blank'
    Err.text = 'You must give us more information'
    Err.href = '#accounts'
    Err.flag = true
  }
  if (Err.flag) {
    errorList.push(Err)
    errorFlag = true
  }
  if (errorFlag === true) {
    res.render('accounts/reason-accounts', {
      errorList: errorList,
      Err: Err
    })
  } else {
    var reasonObject = req.session.extensionReasons.pop()
    reasonObject.accounts = req.body.accounts
    req.session.extensionReasons.push(reasonObject)
    res.redirect('/evidence')
  }
  // company changes
})
router.get('/company-changes/reason-company-changes', function (req, res) {
  res.render('company-changes/reason-company-changes')
})
router.post('/company-changes/reason-company-changes', function (req, res) {
  var companyChanges = req.body.companyChanges
  var errorFlag = false
  var Err = {}
  var errorList = []

  if (companyChanges === '') {
    Err.type = 'blank'
    Err.text = 'You must give us more information'
    Err.href = '#companyChanges'
    Err.flag = true
  }
  if (Err.flag) {
    errorList.push(Err)
    errorFlag = true
  }
  if (errorFlag === true) {
    res.render('company-changes/reason-company-changes', {
      errorList: errorList,
      Err: Err
    })
  } else {
    var reasonObject = req.session.extensionReasons.pop()
    reasonObject.companyChanges = req.body.companyChanges
    req.session.extensionReasons.push(reasonObject)
    res.redirect('/evidence')
  }
  // computer problems
})
router.get('/computer-problem/reason-computer-problem', function (req, res) {
  res.render('computer-problem/reason-computer-problem')
})
router.post('/computer-problem/reason-computer-problem', function (req, res) {
  var computerProblem = req.body.computerProblem
  var errorFlag = false
  var Err = {}
  var errorList = []

  if (computerProblem === '') {
    Err.type = 'blank'
    Err.text = 'You must give us more information'
    Err.href = '#computerProblem'
    Err.flag = true
  }
  if (Err.flag) {
    errorList.push(Err)
    errorFlag = true
  }
  if (errorFlag === true) {
    res.render('computer-problem/reason-computer-problem', {
      errorList: errorList,
      Err: Err
    })
  } else {
    var reasonObject = req.session.extensionReasons.pop()
    reasonObject.computerProblem = req.body.computerProblem
    req.session.extensionReasons.push(reasonObject)
    res.redirect('/evidence')
  }
  // death
})
router.get('/death/reason-death', function (req, res) {
  res.render('death/reason-death')
})
router.post('/death/reason-death', function (req, res) {
  var death = req.body.death
  var errorFlag = false
  var Err = {}
  var errorList = []

  if (death === '') {
    Err.type = 'blank'
    Err.text = 'You must give us more information'
    Err.href = '#death'
    Err.flag = true
  }
  if (Err.flag) {
    errorList.push(Err)
    errorFlag = true
  }
  if (errorFlag === true) {
    res.render('death/reason-death', {
      errorList: errorList,
      Err: Err
    })
  } else {
    var reasonObject = req.session.extensionReasons.pop()
    reasonObject.death = req.body.death
    req.session.extensionReasons.push(reasonObject)
    res.redirect('/evidence')
  }
})
router.get('/other/reason-other', function (req, res) {
  res.render('other/reason-other')
})
router.post('/other/reason-other', function (req, res) {
  var otherInformation = req.body.otherInformation
  var errorFlag = false
  var Err = {}
  var errorList = []

  if (otherInformation === '') {
    Err.type = 'blank'
    Err.text = 'You must give us more information'
    Err.href = '#other-information'
    Err.flag = true
  }
  if (Err.flag) {
    errorList.push(Err)
    errorFlag = true
  }
  if (errorFlag === true) {
    res.render('other/reason-other', {
      errorList: errorList,
      Err: Err
    })
  } else {
    var reasonObject = req.session.extensionReasons.pop()
    reasonObject.otherInformation = req.body.otherInformation
    req.session.extensionReasons.push(reasonObject)
    res.redirect('/evidence')
  }
})

// End of journey
router.get('/check-your-answers', function (req, res) {
  console.log(req.session.extensionReasons)
  res.render('check-your-answers', {
    scenario: req.session.scenario,
    extensionReasons: req.session.extensionReasons,
    extensionLength: req.session.extensionLength,
    userEmail: req.session.userEmail
  })
})
router.post('/check-your-answers', function (req, res) {
  res.redirect('confirmation')
})
router.get('/sign-out', function (req, res) {
  var application = {}
  var json = ''
  var jsonName = ''

  application.userEmail = req.session.userEmail
  application.scenario = req.session.scenario
  application.extensionReasons = req.session.extensionReasons
  jsonName = application.scenario.company.number
  console.log(application)
  json = JSON.stringify(application, null, '\t')
  fs.writeFile('public/saved-sessions/' + jsonName + '.json', json, 'utf8')

  res.render('sign-out', {
    scenario: req.session.scenario,
    extensionReasons: req.session.extensionReasons,
    extensionLength: req.session.extensionLength,
    userEmail: req.session.userEmail
  })
})
router.get('/confirmation', function (req, res) {
  res.render('confirmation', {
    scenario: req.session.scenario,
    extensionReasons: req.session.extensionReasons,
    extensionLength: req.session.extensionLength,
    userEmail: req.session.userEmail
  })
})
router.get('/print-application', function (req, res) {
  res.render('print-application', {
    scenario: req.session.scenario,
    extensionReasons: req.session.extensionReasons,
    extensionLength: req.session.extensionLength,
    userEmail: req.session.userEmail,
    backLinkHref: 'confirmation'
  })
})
module.exports = router
