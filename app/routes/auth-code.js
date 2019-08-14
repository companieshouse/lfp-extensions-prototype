module.exports = function (router) {
  router.get('/auth-code/auth-code-requested', function (req, res) {
    res.render('auth-code/auth-code-requested', {
      scenario: req.session.scenario
    })
  })
  router.post('/auth-code/auth-code-requested', function (req, res) {
    var authCodeRequested = req.body.authCodeRequested
    var authCodeRequestedFlag = true
    var authCodeFlag = true
    var errorFlag = false
    var Err = {}
    var errorList = []
    var reasonObject = {}
    var id = req.body.id

    if (typeof authCodeRequested === 'undefined') {
      Err.type = 'blank'
      Err.text = 'You must tell us if you\'ve requested a new code'
      Err.href = '#auth-code-1'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('auth-code/auth-code-requested', {
        scenario: req.session.scenario,
        errorList: errorList,
        Err: Err
      })
    } else {
      switch (authCodeRequested) {
        case 'yes':
          reasonObject = req.session.extensionReasons.pop()
          reasonObject.requestedFlag = authCodeRequestedFlag
          reasonObject.flag = authCodeFlag
          req.session.extensionReasons.push(reasonObject)
          if (req.session.extensionReasons.length > 1) {
            res.redirect('/check-your-answers')
          } else {
            res.redirect('/add-extension-reason')
          }
          break
        case 'no':
          res.redirect('/auth-code/address')
          break
      }
    }
  })
  router.get('/auth-code/address', function (req, res) {
    res.render('auth-code/address', {
      scenario: req.session.scenario
    })
  })
  router.post('/auth-code/address', function (req, res) {
    var confirmAddress = req.body.confirmAddress
    var authCodeFlag = true
    var errorFlag = false
    var Err = {}
    var errorList = []
    var reasonObject = {}
    var id = req.body.id

    if (typeof confirmAddress === 'undefined') {
      Err.type = 'blank'
      Err.text = 'You must confirm the registered office'
      Err.href = '#auth-code-1'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('auth-code/address', {
        scenario: req.session.scenario,
        errorList: errorList,
        Err: Err
      })
    } else {
      switch (confirmAddress) {
        case 'yes':
          reasonObject = req.session.extensionReasons.pop()
          reasonObject.flag = authCodeFlag
          req.session.extensionReasons.push(reasonObject)
          if (req.session.extensionReasons.length > 1) {
            res.redirect('/check-your-answers')
          } else {
            res.redirect('/add-extension-reason')
          }
          break
        case 'no':
          res.redirect('/auth-code/change-address')
          break
      }
    }
  })
  router.get('/auth-code/change-address', function (req, res) {
    res.render('auth-code/change-address', {
      scenario: req.session.scenario
    })
  })
  router.post('/auth-code/change-address', function (req, res) {
    var reasonObject = {}
    var id = req.body.id

    res.render('auth-code/change-address')
    reasonObject = req.session.extensionReasons.pop()
    req.session.extensionReasons.push(reasonObject)
    reasonObject.nextStep = '/auth-code/address'
  })
}
