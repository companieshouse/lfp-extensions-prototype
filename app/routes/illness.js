module.exports = function (router) {
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
      illPersonErr.href = '#ill-person-1'
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
    var reasonObject = req.session.extensionReasons[req.session.extensionReasons.length - 1]
    res.render('illness/continued-illness', {
      scenario: req.session.scenario,
      startDate: reasonObject.illnessStartDate
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
      Err.href = '#continued-illness-1'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      reasonObject = req.session.extensionReasons[req.session.extensionReasons.length - 1]
      res.render('illness/continued-illness', {
        errorList: errorList,
        Err: Err,
        scenario: req.session.scenario,
        startDate: reasonObject.illnessStartDate
      })
    } else {
      switch (req.body.continuedIllness) {
        case 'yes':
          res.redirect('/illness/illness-information')
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
        inputClasses: inputClasses,
        reason: reasonObject
      })
    } else {
      illnessEndDate.day = req.body['illnessEndDate-day']
      illnessEndDate.month = req.body['illnessEndDate-month']
      illnessEndDate.year = req.body['illnessEndDate-year']
      reasonObject.illnessEndDate = illnessEndDate
      req.session.extensionReasons.push(reasonObject)
      res.redirect('/illness/illness-information')
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
      Err.text = 'You must tell us if you want to provide more information'
      Err.href = '#provide-detail-1'
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
}
