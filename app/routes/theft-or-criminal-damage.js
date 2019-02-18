module.exports = function (router) {
  router.get('/theft-criminal-damage/damage-date', function (req, res) {
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
      res.render('theft-criminal-damage/damage-date', {
        inputClasses: inputClasses,
        reason: currentReason,
        id: id,
        info: info
      })
    } else {
      res.render('theft-criminal-damage/damage-date', {
        inputClasses: inputClasses,
        reason: currentReason
      })
    }
  })
  router.post('/theft-criminal-damage/damage-date', function (req, res) {
    var editId = req.body.editId
    var reasonObject = {}
    var damageDateDay = req.body['damageDate-day']
    var damageDateMonth = req.body['damageDate-month']
    var damageDateYear = req.body['damageDate-year']
    var errorFlag = false
    var damageDateDayErr = {}
    var damageDateMonthErr = {}
    var damageDateYearErr = {}
    var errorList = []
    var damageDate = {}
    var inputClasses = {}

    if (req.body.editId !== '') {
      reasonObject = req.session.extensionReasons[editId]
    } else {
      reasonObject = req.session.extensionReasons.pop()
    }

    inputClasses.day = 'govuk-input--width-2'
    inputClasses.month = 'govuk-input--width-2'
    inputClasses.year = 'govuk-input--width-4'

    if (damageDateDay === '') {
      damageDateDayErr.type = 'blank'
      damageDateDayErr.text = 'You must enter a day'
      damageDateDayErr.href = '#damageDateDay'
      damageDateDayErr.flag = true
    }
    if (damageDateDayErr.flag) {
      inputClasses.day = 'govuk-input--width-2 govuk-input--error'
      errorList.push(damageDateDayErr)
      errorFlag = true
    }
    if (damageDateMonth === '') {
      damageDateMonthErr.type = 'blank'
      damageDateMonthErr.text = 'You must enter a month'
      damageDateMonthErr.href = '#damageDateMonth'
      damageDateMonthErr.flag = true
    }
    if (damageDateMonthErr.flag) {
      inputClasses.month = 'govuk-input--width-2 govuk-input--error'
      errorList.push(damageDateMonthErr)
      errorFlag = true
    }
    if (damageDateYear === '') {
      damageDateYearErr.type = 'blank'
      damageDateYearErr.text = 'You must enter a year'
      damageDateYearErr.href = '#damageDateYear'
      damageDateYearErr.flag = true
    }
    if (damageDateYearErr.flag) {
      inputClasses.year = 'govuk-input--width-4 govuk-input--error'
      errorList.push(damageDateYearErr)
      errorFlag = true
    }
    if (errorFlag === true) {
      req.session.extensionReasons.push(reasonObject)
      res.render('theft-criminal-damage/damage-date', {
        errorList: errorList,
        damageDateDayErr: damageDateDayErr,
        damageDateDay: damageDateDay,
        damageDateMonth: damageDateMonth,
        damageDateYear: damageDateYear,
        inputClasses: inputClasses,
        reason: reasonObject,
        editId: editId
      })
    } else {
      if (req.body.editId !== '') {
        damageDate.day = damageDateDay
        damageDate.month = damageDateMonth
        damageDate.year = damageDateYear
        req.session.extensionReasons[editId].damageDate = damageDate
        res.redirect('/check-your-answers')
      } else {
        damageDate.day = req.body['damageDate-day']
        damageDate.month = req.body['damageDate-month']
        damageDate.year = req.body['damageDate-year']
        reasonObject.damageDate = damageDate
        reasonObject.nextStep = 'theft-criminal-damage/reason-damage'
        req.session.extensionReasons.push(reasonObject)
        res.redirect('/theft-criminal-damage/reason-damage')
      }
    }
  })
  router.get('/theft-criminal-damage/reason-damage', function (req, res) {
    var id = 0
    var info = ''
    if (req.query.id) {
      id = req.query.id
      info = req.session.extensionReasons[id].damage
      res.render('theft-criminal-damage/reason-damage', {
        id: id,
        info: info
      })
    } else {
      res.render('theft-criminal-damage/reason-damage')
    }
  })
  router.post('/theft-criminal-damage/reason-damage', function (req, res) {
    var reasonObject = {}
    var damage = req.body.damage
    var editId = req.body.editId
    var errorFlag = false
    var Err = {}
    var errorList = []

    if (req.body.editId !== '') {
      reasonObject = req.session.extensionReasons[editId]
    } else {
      reasonObject = req.session.extensionReasons.pop()
    }

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
      if (req.body.editId !== '') {
        req.session.extensionReasons[editId].damage = damage
        res.redirect('/check-your-answers')
      } else {
        reasonObject.damage = req.body.damage
        reasonObject.nextStep = 'evidence'
        req.session.extensionReasons.push(reasonObject)
        res.redirect('/evidence')
      }
    }
  })
}
