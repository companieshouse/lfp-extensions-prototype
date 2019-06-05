module.exports = function (router) {
  router.get('/computer-problem/choose-computer-problem', function (req, res) {
    var currentReason = {}
    var id = 0
    var info = ''
    currentReason = req.session.extensionReasons.pop()
    req.session.extensionReasons.push(currentReason)
    if (req.query.id) {
      id = req.query.id
      info = req.session.extensionReasons[id].problemReason
      res.render('computer-problem/choose-computer-problem', {
        id: id,
        info: info
      })
    } else {
      res.render('computer-problem/choose-computer-problem')
    }
  })
  router.post('/computer-problem/choose-computer-problem', function (req, res) {
    var reasonObject = {}
    var problemReason = req.body.problemReason
    var otherProblemReason = req.body.otherProblemReason
    var editId = req.body.editId
    var errorFlag = false
    var problemReasonErr = {}
    var errorList = []

    if (typeof problemReason === 'undefined') {
      problemReasonErr.type = 'blank'
      problemReasonErr.text = 'You must choose a reason'
      problemReasonErr.href = '#problemReason'
      problemReasonErr.flag = true
    }
    if (problemReason === 'other' && otherProblemReason === '') {
      problemReasonErr.type = 'invalid'
      problemReasonErr.text = 'You must tell us the reason'
      problemReasonErr.href = '#other-reason'
      problemReasonErr.flag = true
    }
    if (problemReasonErr.flag) {
      errorList.push(problemReasonErr)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('computer-problem/choose-computer-problem', {
        errorList: errorList,
        problemReasonErr: problemReasonErr
      })
    } else {
      reasonObject = req.session.extensionReasons.pop()
      if (problemReason === 'Authentication code') {
        reasonObject.problemReason = req.body.problemReason
        if (editId !== '') {
          req.session.extensionReasons[editId].problemReason = reasonObject.problemReason
        } else {
          req.session.extensionReasons.push(reasonObject)
        }
        res.redirect('/add-extension-reason')
      } else if (problemReason === 'Companies House website' || problemReason === 'Computer problems') {
        reasonObject.problemReason = req.body.problemReason
        if (editId !== '') {
          req.session.extensionReasons[editId].problemReason = reasonObject.problemReason
        } else {
          req.session.extensionReasons.push(reasonObject)
        }
        res.redirect('/computer-problem/problem-date')
      } else {
        reasonObject.problemReason = req.body.problemReason
        reasonObject.otherProblemReason = req.body.otherProblemReason
        reasonObject.nextStep = 'computer-problem/problem-date'
        req.session.extensionReasons.push(reasonObject)
        res.redirect('/computer-problem/problem-date')
      }
    }
  })
  router.get('/computer-problem/problem-date', function (req, res) {
    var currentReason = {}
    var inputClasses = {}
    var id = 0
    var info = ''
    currentReason = req.session.extensionReasons.pop()
    req.session.extensionReasons.push(currentReason)
    inputClasses.day = 'govuk-input--width-2'
    inputClasses.month = 'govuk-input--width-2'
    inputClasses.year = 'govuk-input--width-4'
    if (req.query.id) {
      id = req.query.id
      info = req.session.extensionReasons[id].problemDate
      res.render('computer-problem/problem-date', {
        inputClasses: inputClasses,
        reason: currentReason,
        id: id,
        info: info
      })
    } else {
      res.render('computer-problem/problem-date', {
        inputClasses: inputClasses,
        reason: currentReason
      })
    }
  })
  router.post('/computer-problem/problem-date', function (req, res) {
    var editId = req.body.editId
    var reasonObject = {}
    var problemDateDay = req.body['problemDate-day']
    var problemDateMonth = req.body['problemDate-month']
    var problemDateYear = req.body['problemDate-year']
    var errorFlag = false
    var problemDateDayErr = {}
    var problemDateMonthErr = {}
    var problemDateYearErr = {}
    var errorList = []
    var problemDate = {}
    var inputClasses = {}

    if (editId !== '') {
      reasonObject = req.session.extensionReasons[editId]
    } else {
      reasonObject = req.session.extensionReasons.pop()
    }

    inputClasses.day = 'govuk-input--width-2'
    inputClasses.month = 'govuk-input--width-2'
    inputClasses.year = 'govuk-input--width-4'

    if (problemDateDay === '') {
      problemDateDayErr.type = 'blank'
      problemDateDayErr.text = 'You must enter a day'
      problemDateDayErr.href = '#problemDate-day'
      problemDateDayErr.flag = true
    }
    if (problemDateDayErr.flag) {
      inputClasses.day = 'govuk-input--width-2 govuk-input--error'
      errorList.push(problemDateDayErr)
      errorFlag = true
    }
    if (problemDateMonth === '') {
      problemDateMonthErr.type = 'blank'
      problemDateMonthErr.text = 'You must enter a month'
      problemDateMonthErr.href = '#problemDate-month'
      problemDateMonthErr.flag = true
    }
    if (problemDateMonthErr.flag) {
      inputClasses.month = 'govuk-input--width-2 govuk-input--error'
      errorList.push(problemDateMonthErr)
      errorFlag = true
    }
    if (problemDateYear === '') {
      problemDateYearErr.type = 'blank'
      problemDateYearErr.text = 'You must enter a year'
      problemDateYearErr.href = '#problemDate-year'
      problemDateYearErr.flag = true
    }
    if (problemDateYearErr.flag) {
      inputClasses.year = 'govuk-input--width-4 govuk-input--error'
      errorList.push(problemDateYearErr)
      errorFlag = true
    }
    if (errorFlag === true) {
      req.session.extensionReasons.push(reasonObject)
      res.render('computer-problem/problem-date', {
        errorList: errorList,
        problemDateDayErr: problemDateDayErr,
        problemDateDay: problemDateDay,
        problemDateMonth: problemDateMonth,
        problemDateYear: problemDateYear,
        inputClasses: inputClasses,
        reason: reasonObject,
        editId: editId
      })
    } else {
      if (req.body.editId !== '') {
        problemDate.day = problemDateDay
        problemDate.month = problemDateMonth
        problemDate.year = problemDateYear
        req.session.extensionReasons[editId].problemDate = problemDate
        res.redirect('/check-your-answers')
      } else {
        problemDate.day = req.body['problemDate-day']
        problemDate.month = req.body['problemDate-month']
        problemDate.year = req.body['problemDate-year']
        reasonObject.problemDate = problemDate
        reasonObject.nextStep = 'computer-problem/reason-computer-problem'
        req.session.extensionReasons.push(reasonObject)
        console.log(req.session.extensionReasons)
        res.redirect('/computer-problem/reason-computer-problem')
        console.log(reasonObject)
      }
    }
  })
  router.get('/computer-problem/reason-computer-problem', function (req, res) {
    var id = 0
    var info = ''
    if (req.query.id) {
      id = req.query.id
      info = req.session.extensionReasons[id].computerProblem
      res.render('computer-problem/reason-computer-problem', {
        id: id,
        info: info
      })
    } else {
      res.render('computer-problem/reason-computer-problem')
    }
  })
  router.post('/computer-problem/reason-computer-problem', function (req, res) {
    var computerProblem = req.body.computerProblem
    var editId = req.body.editId
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
      if (req.body.editId !== '') {
        req.session.extensionReasons[editId].computerProblem = computerProblem
        res.redirect('/check-your-answers')
      } else {
        var reasonObject = req.session.extensionReasons.pop()
        reasonObject.computerProblem = req.body.computerProblem
        reasonObject.nextStep = 'evidence'
        req.session.extensionReasons.push(reasonObject)
        console.log(reasonObject)
        res.redirect('/evidence')
      }
    }
  })
}
