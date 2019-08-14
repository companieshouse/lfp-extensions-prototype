const fs = require('graceful-fs')
const postmark = require('postmark')

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
      extensionReasons: extensionReasons,
      mode: true
    })
  })
  router.post('/resume-application', function (req, res) {
    var i = 0
    var reasonPos = 0
    var falseReason = false

    for (i = 0; i < req.session.extensionReasons.length; i++) {
      if (req.session.extensionReasons[i].complete === false) {
        reasonPos = i
        falseReason = true
        break
      }
    }
    if (falseReason) {
      res.redirect(req.session.extensionReasons[i].nextStep)
    } else {
      res.redirect('check-your-answers')
    }
  })
  router.get('/check-your-answers', function (req, res) {
    var i

    for (i = 0; i < req.session.extensionReasons.length; i++) {
      req.session.extensionReasons[i].complete = true
    }
    res.render('check-your-answers', {
      scenario: req.session.scenario,
      extensionReasons: req.session.extensionReasons,
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
    // fs.writeFile('public/saved-sessions/' + jsonName + '.json', json, 'utf8')

    res.render('sign-out', {
      scenario: req.session.scenario,
      extensionReasons: req.session.extensionReasons,
      extensionLength: req.session.extensionLength,
      userEmail: req.session.userEmail
    })
  })
  router.get('/get-session', function (req, res) {
    var application = {}
    // var json = ''

    application.userEmail = req.session.userEmail
    application.scenario = req.session.scenario
    application.extensionReasons = req.session.extensionReasons
    // json = JSON.stringify(application, null, '\t')
    res.send(JSON.stringify(application))
  })
  router.get('/set-session', function (req, res) {
    var application = {}

    application = JSON.parse(req.query.application)
    req.session.userEmail = application.userEmail
    req.session.scenario = application.scenario
    req.session.extensionReasons = application.extensionReasons
    res.send(true)
  })
  router.get('/confirmation', function (req, res) {
    var scenario = req.session.scenario
    var extensionReasons = req.session.extensionReasons
    var userEmail = req.session.userEmail
    var authCodeFlag = false
    var i = 0

    for (i = 0; i < extensionReasons.length; i++) {
      if (extensionReasons[i].reason === 'authCode') {
        console.log('auth code flag 2')
        authCodeFlag = true
      }
    }

    if (process.env.POSTMARK_API_KEY) {
      var client = new postmark.Client(process.env.POSTMARK_API_KEY)

      // SEND CONFIRMATION EMAIL
      client.sendEmailWithTemplate({
        'From': process.env.FROM_EMAIL,
        'To': process.env.TO_EMAIL,
        'TemplateId': process.env.ETID_CONFIRMATION,
        'TemplateModel': {
          'scenario': scenario,
          'extensionReasons': extensionReasons,
          'userEmail': userEmail
        }
      }, function (error, success) {
        if (error) {
          console.error('Unable to send via postmark: ' + error.message)
        }
      })
      // SEND SUBMISSION EMAIL
      /*
      client.sendEmailWithTemplate({
        'From': process.env.FROM_EMAIL,
        'To': process.env.TO_EMAIL,
        'TemplateId': process.env.ETID_SUBMISSION,
        'TemplateModel': {
          'scenario': scenario,
          'extensionReasons': extensionReasons,
          'userEmail': userEmail
        }
      }, function (error, success) {
        if (error) {
          console.error('Unable to send via postmark: ' + error.message)
        }
      })
      */
    } else {
      console.log('No Postmrk API key detected. To test emails run app locally with `heroku local web`')
    }
    res.render('confirmation', {
      scenario: req.session.scenario,
      extensionReasons: req.session.extensionReasons,
      extensionLength: req.session.extensionLength,
      userEmail: req.session.userEmail,
      authCodeFlag: authCodeFlag
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
  // DOCUMENT DOWNLOAD
  router.get('/download', function (req, res) {
    res.render('download')
  })
}
