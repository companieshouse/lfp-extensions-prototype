const fs = require('graceful-fs')

module.exports = function (router) {
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
        req.session.scenario = require('../assets/scenarios/' + companyNumber)
        req.session.extensionReasons = []
        res.redirect('confirm-company')
      }
    }
  })
  router.get('/confirm-company', function (req, res) {
    res.render('confirm-company', {
      scenario: req.session.scenario
    })
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
    json = JSON.stringify(application, null, '\t')
    fs.writeFile('/public/saved-sessions/' + jsonName + '.json', json, 'utf8')
    console.log('should have saved my session')

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
}
