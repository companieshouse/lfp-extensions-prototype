module.exports = function (router) {
  router.get('/natural-disaster/disaster-date', function (req, res) {
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
      info = req.session.extensionReasons[id].accountsDate
      res.render('natural-disaster/disaster-date', {
        inputClasses: inputClasses,
        reason: currentReason,
        id: id,
        info: info
      })
    } else {
      res.render('natural-disaster/disaster-date', {
        inputClasses: inputClasses,
        reason: currentReason
      })
    }
  })
  router.post('/natural-disaster/disaster-date', function (req, res) {
    var editId = req.body.editId
    var reasonObject = {}
    var disasterDateDay = req.body['disasterDate-day']
    var disasterDateMonth = req.body['disasterDate-month']
    var disasterDateYear = req.body['disasterDate-year']
    var errorFlag = false
    var disasterDateDayErr = {}
    var disasterDateMonthErr = {}
    var disasterDateYearErr = {}
    var errorList = []
    var disasterDate = {}
    var inputClasses = {}

    if (req.body.editId !== '') {
      reasonObject = req.session.extensionReasons[editId]
    } else {
      reasonObject = req.session.extensionReasons.pop()
    }

    inputClasses.day = 'govuk-input--width-2'
    inputClasses.month = 'govuk-input--width-2'
    inputClasses.year = 'govuk-input--width-4'

    if (disasterDateDay === '') {
      disasterDateDayErr.type = 'blank'
      disasterDateDayErr.text = 'You must enter a day'
      disasterDateDayErr.href = '#disasterDateDay'
      disasterDateDayErr.flag = true
    }
    if (disasterDateDayErr.flag) {
      inputClasses.day = 'govuk-input--width-2 govuk-input--error'
      errorList.push(disasterDateDayErr)
      errorFlag = true
    }
    if (disasterDateMonth === '') {
      disasterDateMonthErr.type = 'blank'
      disasterDateMonthErr.text = 'You must enter a month'
      disasterDateMonthErr.href = '#disasterDateMonth'
      disasterDateMonthErr.flag = true
    }
    if (disasterDateMonthErr.flag) {
      inputClasses.month = 'govuk-input--width-2 govuk-input--error'
      errorList.push(disasterDateMonthErr)
      errorFlag = true
    }
    if (disasterDateYear === '') {
      disasterDateYearErr.type = 'blank'
      disasterDateYearErr.text = 'You must enter a year'
      disasterDateYearErr.href = '#disasterDateYear'
      disasterDateYearErr.flag = true
    }
    if (disasterDateYearErr.flag) {
      inputClasses.year = 'govuk-input--width-4 govuk-input--error'
      errorList.push(disasterDateYearErr)
      errorFlag = true
    }
    if (errorFlag === true) {
      req.session.extensionReasons.push(reasonObject)
      res.render('natural-disaster/disaster-date', {
        errorList: errorList,
        disasterDateDayErr: disasterDateDayErr,
        disasterDateDay: disasterDateDay,
        disasterDateMonth: disasterDateMonth,
        disasterDateYear: disasterDateYear,
        inputClasses: inputClasses,
        reason: reasonObject,
        editId: editId
      })
    } else {
      if (req.body.editId !== '') {
        disasterDate.day = disasterDateDay
        disasterDate.month = disasterDateMonth
        disasterDate.year = disasterDateYear
        req.session.extensionReasons[editId].disasterDate = disasterDate
        res.redirect('/check-your-answers')
      } else {
        disasterDate.day = req.body['disasterDate-day']
        disasterDate.month = req.body['disasterDate-month']
        disasterDate.year = req.body['disasterDate-year']
        reasonObject.disasterDate = disasterDate
        req.session.extensionReasons.push(reasonObject)
        res.redirect('/natural-disaster/reason-natural-disaster')
      }
    }
  })
  router.get('/natural-disaster/reason-natural-disaster', function (req, res) {
    var id = 0
    var info = ''
    if (req.query.id) {
      id = req.query.id
      info = req.session.extensionReasons[id].naturalDisaster
      res.render('natural-disaster/reason-natural-disaster', {
        id: id,
        info: info
      })
    } else {
      res.render('natural-disaster/reason-natural-disaster')
    }
  })
  router.post('/natural-disaster/reason-natural-disaster', function (req, res) {
    var reasonObject = {}
    var naturalDisaster = req.body.naturalDisaster
    var editId = req.body.editId
    var errorFlag = false
    var Err = {}
    var errorList = []

    if (req.body.editId !== '') {
      reasonObject = req.session.extensionReasons[editId]
    } else {
      reasonObject = req.session.extensionReasons.pop()
    }

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
      if (req.body.editId !== '') {
        req.session.extensionReasons[editId].naturalDistaster = naturalDisaster
        res.redirect('/check-your-answers')
      } else {
        reasonObject.naturalDisaster = req.body.naturalDisaster
        reasonObject.nextStep = 'evidence'
        req.session.extensionReasons.push(reasonObject)
        res.redirect('/evidence')
      }
    }
  })
}
