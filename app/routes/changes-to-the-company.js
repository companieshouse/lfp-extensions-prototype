module.exports = function (router) {
  router.get('/company-changes/change-happened', function (req, res) {
    res.render('company-changes/change-happened')
  })
  router.post('/company-changes/change-happened', function (req, res) {
    var changeHappened = req.body.changeHappened
    var errorFlag = false
    var Err = {}
    var errorList = []
    var reasonObject = {}

    if (typeof changeHappened === 'undefined') {
      Err.type = 'blank'
      Err.text = 'You must tell us if the change to the company has happened'
      Err.href = '#change-happened-1'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('company-changes/change-happened', {
        errorList: errorList,
        Err: Err
      })
    } else {
      reasonObject = req.session.extensionReasons.pop()
      switch (req.body.changeHappened) {
        case 'yes':
          reasonObject.nextStep = 'company-changes/date-was-changed'
          req.session.extensionReasons.push(reasonObject)
          res.redirect('/company-changes/date-was-changed')
          break
        case 'no':
          reasonObject.nextStep = 'company-changes/date-will-change'
          req.session.extensionReasons.push(reasonObject)
          res.redirect('/company-changes/date-will-change')
          break
      }
    }
  })
  router.get('/company-changes/aware-of-change', function (req, res) {
    res.render('company-changes/aware-of-change')
  })
  router.post('/company-changes/aware-of-change', function (req, res) {
    var awareOfChange = req.body.awareOfChange
    var errorFlag = false
    var Err = {}
    var errorList = []
    var reasonObject = {}

    if (typeof awareOfChange === 'undefined') {
      Err.type = 'blank'
      Err.text = 'You must tell us if you were aware of the change'
      Err.href = '#aware-of-change-1'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('company-changes/aware-of-change', {
        errorList: errorList,
        Err: Err
      })
    } else {
      reasonObject = req.session.extensionReasons.pop()
      switch (req.body.awareOfChange) {
        case 'yes':
          reasonObject.nextStep = 'company-changes/aware-change-date'
          req.session.extensionReasons.push(reasonObject)
          res.redirect('/company-changes/aware-change-date')
          break
        case 'no':
          reasonObject.nextStep = 'company-changes/reason-company-changes'
          req.session.extensionReasons.push(reasonObject)
          res.redirect('/company-changes/reason-company-changes')
          break
      }
    }
  })
  router.get('/company-changes/aware-change-date', function (req, res) {
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
      info = req.session.extensionReasons[id].awareChangeDate
      res.render('company-changes/aware-change-date', {
        inputClasses: inputClasses,
        reason: currentReason,
        id: id,
        info: info
      })
    } else {
      res.render('company-changes/aware-change-date', {
        inputClasses: inputClasses,
        reason: currentReason
      })
    }
  })
  router.post('/company-changes/aware-change-date', function (req, res) {
    var editId = req.body.editId
    var reasonObject = {}
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

    if (req.body.editId !== '') {
      reasonObject = req.session.extensionReasons[editId]
    } else {
      reasonObject = req.session.extensionReasons.pop()
    }

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
        inputClasses: inputClasses,
        reason: reasonObject,
        editId: editId
      })
    } else {
      if (req.body.editId !== '') {
        awareChangeDate.day = awareChangeDay
        awareChangeDate.month = awareChangeMonth
        awareChangeDate.year = awareChangeYear
        req.session.extensionReasons[editId].awareChangeDate = awareChangeDate
        res.redirect('/check-your-answers')
      } else {
        awareChangeDate.day = req.body['awareChangeDate-day']
        awareChangeDate.month = req.body['awareChangeDate-month']
        awareChangeDate.year = req.body['awareChangeDate-year']
        reasonObject.awareChangeDate = awareChangeDate
        reasonObject.nextStep = 'company-changes/reason-company-changes'
        req.session.extensionReasons.push(reasonObject)
        res.redirect('/company-changes/reason-company-changes')
      }
    }
  })
  router.get('/company-changes/date-was-changed', function (req, res) {
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
      info = req.session.extensionReasons[id].dateWasChanged
      res.render('company-changes/date-was-changed', {
        inputClasses: inputClasses,
        reason: currentReason,
        id: id,
        info: info
      })
    } else {
      res.render('company-changes/date-was-changed', {
        inputClasses: inputClasses,
        reason: currentReason
      })
    }
  })
  router.post('/company-changes/date-was-changed', function (req, res) {
    var editId = req.body.editId
    var reasonObject = {}
    var dateWasChangedDay = req.body['dateWasChanged-day']
    var dateWasChangedMonth = req.body['dateWasChanged-month']
    var dateWasChangedYear = req.body['dateWasChanged-year']
    var errorFlag = false
    var dateWasChangedDayErr = {}
    var dateWasChangedMonthErr = {}
    var dateWasChangedYearErr = {}
    var errorList = []
    var dateWasChanged = {}
    var inputClasses = {}

    if (editId !== '') {
      reasonObject = req.session.extensionReasons[editId]
    } else {
      reasonObject = req.session.extensionReasons.pop()
    }

    inputClasses.day = 'govuk-input--width-2'
    inputClasses.month = 'govuk-input--width-2'
    inputClasses.year = 'govuk-input--width-4'

    if (dateWasChangedDay === '') {
      dateWasChangedDayErr.type = 'blank'
      dateWasChangedDayErr.text = 'You must enter a day'
      dateWasChangedDayErr.href = '#dateWasChanged-day'
      dateWasChangedDayErr.flag = true
    }
    if (dateWasChangedDayErr.flag) {
      inputClasses.day = 'govuk-input--width-2 govuk-input--error'
      errorList.push(dateWasChangedDayErr)
      errorFlag = true
    }
    if (dateWasChangedMonth === '') {
      dateWasChangedMonthErr.type = 'blank'
      dateWasChangedMonthErr.text = 'You must enter a month'
      dateWasChangedMonthErr.href = '#dateWasChanged-month'
      dateWasChangedMonthErr.flag = true
    }
    if (dateWasChangedMonthErr.flag) {
      inputClasses.month = 'govuk-input--width-2 govuk-input--error'
      errorList.push(dateWasChangedMonthErr)
      errorFlag = true
    }
    if (dateWasChangedYear === '') {
      dateWasChangedYearErr.type = 'blank'
      dateWasChangedYearErr.text = 'You must enter a year'
      dateWasChangedYearErr.href = '#dateWasChanged-year'
      dateWasChangedYearErr.flag = true
    }
    if (dateWasChangedYearErr.flag) {
      inputClasses.year = 'govuk-input--width-4 govuk-input--error'
      errorList.push(dateWasChangedYearErr)
      errorFlag = true
    }
    if (errorFlag === true) {
      req.session.extensionReasons.push(reasonObject)
      res.render('company-changes/date-was-changed', {
        errorList: errorList,
        dateWasChangedDayErr: dateWasChangedDayErr,
        dateWasChangedDay: dateWasChangedDay,
        dateWasChangedMonth: dateWasChangedMonth,
        dateWasChangedYear: dateWasChangedYear,
        inputClasses: inputClasses,
        reason: reasonObject,
        editId: editId
      })
    } else {
      if (req.body.editId !== '') {
        dateWasChanged.day = dateWasChangedDay
        dateWasChanged.month = dateWasChangedMonth
        dateWasChanged.year = dateWasChangedYear
        req.session.extensionReasons[editId].dateWasChanged = dateWasChanged
        res.redirect('/check-your-answers')
      } else {
        dateWasChanged.day = req.body['dateWasChanged-day']
        dateWasChanged.month = req.body['dateWasChanged-month']
        dateWasChanged.year = req.body['dateWasChanged-year']
        reasonObject.dateWasChanged = dateWasChanged
        reasonObject.nextStep = 'company-changes/aware-of-change'
        req.session.extensionReasons.push(reasonObject)
        console.log(req.session.extensionReasons)
        res.redirect('/company-changes/aware-of-change')
      }
    }
  })
  router.get('/company-changes/date-will-change', function (req, res) {
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
      info = req.session.extensionReasons[id].dateWasChanged
      res.render('company-changes/date-will-change', {
        inputClasses: inputClasses,
        reason: currentReason,
        id: id,
        info: info
      })
    } else {
      res.render('company-changes/date-will-change', {
        inputClasses: inputClasses,
        reason: currentReason
      })
    }
  })
  router.post('/company-changes/date-will-change', function (req, res) {
    var editId = req.body.editId
    var reasonObject = {}
    var dateWillChangeDay = req.body['dateWillChange-day']
    var dateWillChangeMonth = req.body['dateWillChange-month']
    var dateWillChangeYear = req.body['dateWillChange-year']
    var errorFlag = false
    var dateWillChangeDayErr = {}
    var dateWillChangeMonthErr = {}
    var dateWillChangeYearErr = {}
    var errorList = []
    var dateWillChange = {}
    var inputClasses = {}

    if (editId !== '') {
      reasonObject = req.session.extensionReasons[editId]
    } else {
      reasonObject = req.session.extensionReasons.pop()
    }

    inputClasses.day = 'govuk-input--width-2'
    inputClasses.month = 'govuk-input--width-2'
    inputClasses.year = 'govuk-input--width-4'

    if (dateWillChangeDay === '') {
      dateWillChangeDayErr.type = 'blank'
      dateWillChangeDayErr.text = 'You must enter a day'
      dateWillChangeDayErr.href = '#date-will-change-day'
      dateWillChangeDayErr.flag = true
    }
    if (dateWillChangeDayErr.flag) {
      inputClasses.day = 'govuk-input--width-2 govuk-input--error'
      errorList.push(dateWillChangeDayErr)
      errorFlag = true
    }
    if (dateWillChangeMonth === '') {
      dateWillChangeMonthErr.type = 'blank'
      dateWillChangeMonthErr.text = 'You must enter a month'
      dateWillChangeMonthErr.href = '#date-will-change-month'
      dateWillChangeMonthErr.flag = true
    }
    if (dateWillChangeMonthErr.flag) {
      inputClasses.month = 'govuk-input--width-2 govuk-input--error'
      errorList.push(dateWillChangeMonthErr)
      errorFlag = true
    }
    if (dateWillChangeYear === '') {
      dateWillChangeYearErr.type = 'blank'
      dateWillChangeYearErr.text = 'You must enter a year'
      dateWillChangeYearErr.href = '#date-will-change-year'
      dateWillChangeYearErr.flag = true
    }
    if (dateWillChangeYearErr.flag) {
      inputClasses.year = 'govuk-input--width-4 govuk-input--error'
      errorList.push(dateWillChangeYearErr)
      errorFlag = true
    }
    if (errorFlag === true) {
      req.session.extensionReasons.push(reasonObject)
      res.render('company-changes/date-will-change', {
        errorList: errorList,
        dateWillChangeDayErr: dateWillChangeDayErr,
        dateWillChangeDay: dateWillChangeDay,
        dateWillChangeMonth: dateWillChangeMonth,
        dateWillChangeYear: dateWillChangeYear,
        inputClasses: inputClasses,
        reason: reasonObject,
        editId: editId
      })
    } else {
      if (req.body.editId !== '') {
        dateWillChange.day = dateWillChangeDay
        dateWillChange.month = dateWillChangeMonth
        dateWillChange.year = dateWillChangeYear
        req.session.extensionReasons[editId].dateWillChange = dateWillChange
        res.redirect('/check-your-answers')
      } else {
        dateWillChange.day = req.body['dateWillChange-day']
        dateWillChange.month = req.body['dateWillChange-month']
        dateWillChange.year = req.body['dateWillChange-year']
        reasonObject.dateWillChange = dateWillChange
        reasonObject.nextStep = 'company-changes/aware-change-date'
        req.session.extensionReasons.push(reasonObject)
        console.log(req.session.extensionReasons)
        res.redirect('/company-changes/aware-change-date')
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
    var reasonObject = {}
    var companyChanges = req.body.companyChanges
    var editId = req.body.editId
    var errorFlag = false
    var Err = {}
    var errorList = []

    if (req.body.editId !== '') {
      reasonObject = req.session.extensionReasons[editId]
    } else {
      reasonObject = req.session.extensionReasons.pop()
    }

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
        reasonObject.companyChanges = req.body.companyChanges
        reasonObject.nextStep = 'evidence'
        req.session.extensionReasons.push(reasonObject)
        res.redirect('/evidence')
      }
    }
  })
}
