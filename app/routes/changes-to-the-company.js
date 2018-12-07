module.exports = function (router) {
  router.get('/company-changes/aware-change-date', function (req, res) {
    var inputClasses = {}
    inputClasses.day = 'govuk-input--width-2'
    inputClasses.month = 'govuk-input--width-2'
    inputClasses.year = 'govuk-input--width-4'
    res.render('company-changes/aware-change-date', {
      inputClasses: inputClasses
    })
  })
  router.post('/company-changes/aware-change-date', function (req, res) {
    var reasonObject = req.session.extensionReasons.pop()
    var awareChangeDay = req.body['awareChangeDate-day']
    var awareChangeMonth = req.body['awareChangeDate-month']
    var awareChangeYear = req.body['awareChangeDate-year']
    var errorFlag = false
    var awareChangeDayErr = {}
    var awareChangeMonthErr = {}
    var awareChangeYearErr = {}
    var errorList = []
    var awareChangeDate = {}
    var inputClasses = {}

    inputClasses.day = 'govuk-input--width-2'
    inputClasses.month = 'govuk-input--width-2'
    inputClasses.year = 'govuk-input--width-4'

    if (awareChangeDay === '') {
      awareChangeDayErr.type = 'blank'
      awareChangeDayErr.text = 'You must enter a day'
      awareChangeDayErr.href = '#awareChangeDay'
      awareChangeDayErr.flag = true
    }
    if (awareChangeDayErr.flag) {
      inputClasses.day = 'govuk-input--width-2 govuk-input--error'
      errorList.push(awareChangeDayErr)
      errorFlag = true
    }
    if (awareChangeMonth === '') {
      awareChangeMonthErr.type = 'blank'
      awareChangeMonthErr.text = 'You must enter a month'
      awareChangeMonthErr.href = '#awareChangeMonth'
      awareChangeMonthErr.flag = true
    }
    if (awareChangeMonthErr.flag) {
      inputClasses.month = 'govuk-input--width-2 govuk-input--error'
      errorList.push(awareChangeMonthErr)
      errorFlag = true
    }
    if (awareChangeYear === '') {
      awareChangeYearErr.type = 'blank'
      awareChangeYearErr.text = 'You must enter a year'
      awareChangeYearErr.href = '#awareChangeYear'
      awareChangeYearErr.flag = true
    }
    if (awareChangeYearErr.flag) {
      inputClasses.year = 'govuk-input--width-4 govuk-input--error'
      errorList.push(awareChangeYearErr)
      errorFlag = true
    }
    if (errorFlag === true) {
      req.session.extensionReasons.push(reasonObject)
      res.render('company-changes/aware-change-date', {
        errorList: errorList,
        awareChangeDayErr: awareChangeDayErr,
        awareChangeDay: awareChangeDay,
        awareChangeMonth: awareChangeMonth,
        awareChangeYear: awareChangeYear,
        inputClasses: inputClasses
      })
    } else {
      awareChangeDate.day = req.body['awareChangeDate-day']
      awareChangeDate.month = req.body['awareChangeDate-month']
      awareChangeDate.year = req.body['awareChangeDate-year']
      reasonObject.awareChangeDate = awareChangeDate
      req.session.extensionReasons.push(reasonObject)
      res.redirect('/company-changes/date-changed')
    }
  })
  router.get('/company-changes/date-changed', function (req, res) {
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
      info = req.session.extensionReasons[id].changeDate
      res.render('company-changes/date-changed', {
        inputClasses: inputClasses,
        reason: currentReason,
        id: id,
        info: info
      })
    } else {
      res.render('company-changes/date-changed', {
        inputClasses: inputClasses,
        reason: currentReason
      })
    }
  })
  router.post('/company-changes/date-changed', function (req, res) {
    var id = req.body.editId
    var reasonObject = {}
    var changeDay = req.body['changeDate-day']
    var changeMonth = req.body['changeDate-month']
    var changeYear = req.body['changeDate-year']
    var errorFlag = false
    var changeDayErr = {}
    var changeMonthErr = {}
    var changeYearErr = {}
    var errorList = []
    var changeDate = {}
    var inputClasses = {}

    if (id !== '') {
      reasonObject = req.session.extensionReasons[id]
    } else {
      reasonObject = req.session.extensionReasons.pop()
    }

    inputClasses.day = 'govuk-input--width-2'
    inputClasses.month = 'govuk-input--width-2'
    inputClasses.year = 'govuk-input--width-4'

    if (changeDay === '') {
      changeDayErr.type = 'blank'
      changeDayErr.text = 'You must enter a day'
      changeDayErr.href = '#change-date-day'
      changeDayErr.flag = true
    }
    if (changeDayErr.flag) {
      inputClasses.day = 'govuk-input--width-2 govuk-input--error'
      errorList.push(changeDayErr)
      errorFlag = true
    }
    if (changeMonth === '') {
      changeMonthErr.type = 'blank'
      changeMonthErr.text = 'You must enter a month'
      changeMonthErr.href = '#change-date-month'
      changeMonthErr.flag = true
    }
    if (changeMonthErr.flag) {
      inputClasses.month = 'govuk-input--width-2 govuk-input--error'
      errorList.push(changeMonthErr)
      errorFlag = true
    }
    if (changeYear === '') {
      changeYearErr.type = 'blank'
      changeYearErr.text = 'You must enter a year'
      changeYearErr.href = '#change-date-year'
      changeYearErr.flag = true
    }
    if (changeYearErr.flag) {
      inputClasses.year = 'govuk-input--width-4 govuk-input--error'
      errorList.push(changeYearErr)
      errorFlag = true
    }
    if (errorFlag === true) {
      req.session.extensionReasons.push(reasonObject)
      res.render('company-changes/date-changed', {
        errorList: errorList,
        changeDayErr: changeDayErr,
        changeDay: changeDay,
        changeMonth: changeMonth,
        changeYear: changeYear,
        inputClasses: inputClasses,
        reason: reasonObject,
        id: id
      })
    } else {
      if (id !== '') {
        changeDate.day = changeDay
        changeDate.month = changeMonth
        changeDate.year = changeYear
        req.session.extensionReasons[id].changeDate = changeDate
        res.redirect('/check-your-answers')
      } else {
        changeDate.day = req.body['changeDate-day']
        changeDate.month = req.body['changeDate-month']
        changeDate.year = req.body['changeDate-year']
        reasonObject.changeDate = changeDate
        req.session.extensionReasons.push(reasonObject)
        console.log(req.session.extensionReasons)
        res.redirect('/company-changes/reason-company-changes')
      }
    }
  })
  router.get('/company-changes/reason-company-changes', function (req, res) {
    var id = 0
    var info = ''
    if (req.query.id) {
      id = req.query.id
      info = req.session.extensionReasons[id].companyChanges
      res.render('company-changes/reason-company-changes', {
        id: id,
        info: info
      })
    } else {
      res.render('company-changes/reason-company-changes')
    }
  })
  router.post('/company-changes/reason-company-changes', function (req, res) {
    var companyChanges = req.body.companyChanges
    var editId = req.body.editId
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
      if (req.body.editId !== '') {
        req.session.extensionReasons[editId].companyChanges = companyChanges
        res.redirect('/check-your-answers')
      } else {
        var reasonObject = req.session.extensionReasons.pop()
        reasonObject.companyChanges = req.body.companyChanges
        req.session.extensionReasons.push(reasonObject)
        res.redirect('/evidence')
      }
    }
  })
}
