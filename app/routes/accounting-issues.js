module.exports = function (router) {
  router.get('/accounts/accounts-date', function (req, res) {
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
      res.render('accounts/accounts-date', {
        inputClasses: inputClasses,
        reason: currentReason,
        id: id,
        info: info
      })
    } else {
      res.render('accounts/accounts-date', {
        inputClasses: inputClasses,
        reason: currentReason
      })
    }
  })
  router.post('/accounts/accounts-date', function (req, res) {
    var editId = req.body.editId
    var reasonObject = {}
    var accountsDateDay = req.body['accountsDate-day']
    var accountsDateMonth = req.body['accountsDate-month']
    var accountsDateYear = req.body['accountsDate-year']
    var errorFlag = false
    var accountsDateDayErr = {}
    var accountsDateMonthErr = {}
    var accountsDateYearErr = {}
    var errorList = []
    var accountsDate = {}
    var inputClasses = {}

    if (req.body.editId !== '') {
      reasonObject = req.session.extensionReasons[editId]
    } else {
      reasonObject = req.session.extensionReasons.pop()
    }

    inputClasses.day = 'govuk-input--width-2'
    inputClasses.month = 'govuk-input--width-2'
    inputClasses.year = 'govuk-input--width-4'

    if (accountsDateDay === '') {
      accountsDateDayErr.type = 'blank'
      accountsDateDayErr.text = 'You must enter a day'
      accountsDateDayErr.href = '#accountsDateDay'
      accountsDateDayErr.flag = true
    }
    if (accountsDateDayErr.flag) {
      inputClasses.day = 'govuk-input--width-2 govuk-input--error'
      errorList.push(accountsDateDayErr)
      errorFlag = true
    }
    if (accountsDateMonth === '') {
      accountsDateMonthErr.type = 'blank'
      accountsDateMonthErr.text = 'You must enter a month'
      accountsDateMonthErr.href = '#accountsDateMonth'
      accountsDateMonthErr.flag = true
    }
    if (accountsDateMonthErr.flag) {
      inputClasses.month = 'govuk-input--width-2 govuk-input--error'
      errorList.push(accountsDateMonthErr)
      errorFlag = true
    }
    if (accountsDateYear === '') {
      accountsDateYearErr.type = 'blank'
      accountsDateYearErr.text = 'You must enter a year'
      accountsDateYearErr.href = '#accountsDateYear'
      accountsDateYearErr.flag = true
    }
    if (accountsDateYearErr.flag) {
      inputClasses.year = 'govuk-input--width-4 govuk-input--error'
      errorList.push(accountsDateYearErr)
      errorFlag = true
    }
    if (errorFlag === true) {
      req.session.extensionReasons.push(reasonObject)
      res.render('accounts/accounts-date', {
        errorList: errorList,
        accountsDateDayErr: accountsDateDayErr,
        accountsDateDay: accountsDateDay,
        accountsDateMonth: accountsDateMonth,
        accountsDateYear: accountsDateYear,
        inputClasses: inputClasses,
        reason: reasonObject,
        editId: editId
      })
    } else {
      if (req.body.editId !== '') {
        accountsDate.day = accountsDateDay
        accountsDate.month = accountsDateMonth
        accountsDate.year = accountsDateYear
        req.session.extensionReasons[editId].accountsDate = accountsDate
        res.redirect('/check-your-answers')
      } else {
        accountsDate.day = req.body['accountsDate-day']
        accountsDate.month = req.body['accountsDate-month']
        accountsDate.year = req.body['accountsDate-year']
        reasonObject.accountsDate = accountsDate
        reasonObject.nextStep = 'accounts/reason-accounts'
        req.session.extensionReasons.push(reasonObject)
        res.redirect('/accounts/reason-accounts')
      }
    }
  })
  router.get('/accounts/reason-accounts', function (req, res) {
    var id = 0
    var info = ''
    if (req.query.id) {
      id = req.query.id
      info = req.session.extensionReasons[id].accounts
      res.render('accounts/reason-accounts', {
        id: id,
        info: info
      })
    } else {
      res.render('accounts/reason-accounts')
    }
  })
  router.post('/accounts/reason-accounts', function (req, res) {
    var reasonObject = {}
    var accounts = req.body.accounts
    var editId = req.body.editId
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
      reasonObject = req.session.extensionReasons.pop()
      if (req.body.editId !== '') {
        req.session.extensionReasons[editId].accounts = accounts
        res.redirect('/check-your-answers')
      } else {
        reasonObject.accounts = req.body.accounts
        reasonObject.nextStep = 'evidence'
        req.session.extensionReasons.push(reasonObject)
        res.redirect('/evidence')
      }
    }
  })
}
