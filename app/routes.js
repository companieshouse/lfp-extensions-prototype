const express = require('express')
const router = express.Router()

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
  res.redirect('company-number')
})
router.get('/company-number', function (req, res) {
  res.render('company-number')
})
router.post('/company-number', function (req, res) {
  req.session.extensionReasons = []
  res.redirect('confirm-company')
})
router.get('/filing-deadline', function (req, res) {
  res.render('filing-deadline')
})
router.post('/filing-deadline', function (req, res) {
  req.session.extensionApply = req.body.extensionApply

  switch (req.session.extensionApply) {
    case 'yes':
      res.redirect('choose-reason')
      break
    case 'no':
      res.redirect('start')
      break
  }
})
router.get('/choose-reason', function (req, res) {
  res.render('choose-reason')
})
router.post('/choose-reason', function (req, res) {
  var reasonObject = {}

  switch (req.body.extensionReason) {
    case 'illness':
      reasonObject.reason = req.body.extensionReason
      req.session.extensionReasons.push(reasonObject)
      res.redirect('/illness/who-was-ill')
      break
    case 'disaster':
      reasonObject.reason = req.body.extensionReason
      req.session.extensionReasons.push(reasonObject)
      res.redirect('/natural-disaster/type-of-disaster')
      break
    case 'other':
      reasonObject.reason = req.body.extensionReason
      reasonObject.otherReason = req.body.otherReason
      req.session.extensionReasons.push(reasonObject)
      res.redirect('other/reason-other')
      break
  }
})
router.get('/illness/who-was-ill', function (req, res) {
  res.render('illness/who-was-ill')
})
router.post('/illness/who-was-ill', function (req, res) {
  var reasonObject = req.session.extensionReasons.pop()
  reasonObject.illPerson = req.body.illPerson
  reasonObject.otherIllPerson = req.body.otherIllPerson
  req.session.extensionReasons.push(reasonObject)
  res.redirect('/illness/illness-start-date')
})
router.get('/illness/illness-start-date', function (req, res) {
  res.render('illness/illness-start-date')
})
router.post('/illness/illness-start-date', function (req, res) {
  var reasonObject = req.session.extensionReasons.pop()

  var illnessStartDate = {}
  illnessStartDate.day = req.body['illnessStart-day']
  illnessStartDate.month = req.body['illnessStart-month']
  illnessStartDate.year = req.body['illnessStart-year']
  reasonObject.illnessStartDate = illnessStartDate
  req.session.extensionReasons.push(reasonObject)
  res.redirect('/illness/continued-illness')
})
router.get('/illness/continued-illness', function (req, res) {
  res.render('illness/continued-illness')
})
router.post('/illness/continued-illness', function (req, res) {
  var reasonObject = req.session.extensionReasons.pop()
  reasonObject.continuedIllness = req.body.continuedIllness
  req.session.extensionReasons.push(reasonObject)
  switch (req.body.continuedIllness) {
    case 'yes':
      res.redirect('/illness/illness-pre-information')
      break
    case 'no':
      res.redirect('/illness/illness-end-date')
      break
  }
})
router.get('/illness/illness-end-date', function (req, res) {
  res.render('illness/illness-end-date')
})
router.post('/illness/illness-end-date', function (req, res) {
  var reasonObject = req.session.extensionReasons.pop()
  var illnessEndDate = {}
  console.log(req.body['illnessEnd-day'])
  illnessEndDate.day = req.body['illnessEndDate-day']
  illnessEndDate.month = req.body['illnessEndDate-month']
  illnessEndDate.year = req.body['illnessEndDate-year']
  console.log(illnessEndDate)
  reasonObject.illnessEndDate = illnessEndDate
  console.log(reasonObject.illnessEndDate)
  req.session.extensionReasons.push(reasonObject)
  res.redirect('/illness/illness-pre-information')
})
router.get('/illness-pre-information', function (req, res) {
  res.render('illness-pre-information')
})
router.post('/illness/illness-pre-information', function (req, res) {
  switch (req.body.provideDetail) {
    case 'yes':
      res.redirect('/illness/illness-information')
      break
    case 'no':
      res.redirect('/illness/illness-evidence')
      break
  }
})
router.get('/add-extension-reason', function (req, res) {
  res.render('add-extension-reason')
})
router.post('/add-extension-reason', function (req, res) {
  switch (req.body.addExtensionReason) {
    case 'yes':
      res.redirect('/choose-reason')
      break
    case 'no':
      res.redirect('/extension-length')
      break
  }
})
router.get('/illness/illness-information', function (req, res) {
  res.render('illness/illness-information')
})
router.post('/illness/illness-information', function (req, res) {
  var reasonObject = req.session.extensionReasons.pop()
  reasonObject.illnessInformation = req.body.illnessInformation
  req.session.extensionReasons.push(reasonObject)
  res.redirect('/illness/illness-evidence')
})
router.get('/illness/illness-evidence', function (req, res) {
  res.render('illness/illness-evidence')
})
router.post('/illness/illness-evidence', function (req, res) {
  switch (req.body.supportingEvidence) {
    case 'yes':
      res.redirect('/illness/illness-evidence-upload')
      break
    case 'no':
      res.redirect('/add-extension-reason')
      break
  }
})
router.get('/illness/illness-evidence-upload', function (req, res) {
  res.render('illness/illness-evidence-upload')
})
router.post('/illness/illness-evidence-upload', function (req, res) {
  res.redirect('/add-extension-reason')
})
router.get('/other/reason-other', function (req, res) {
  res.render('other/reason-other')
})
router.post('/other/reason-other', function (req, res) {
  var reasonObject = req.session.extensionReasons.pop()
  reasonObject.otherInformation = req.body.otherInformation
  req.session.extensionReasons.push(reasonObject)
  res.redirect('/add-extension-reason')
})
router.get('/extension-length', function (req, res) {
  res.render('extension-length')
})
router.post('/extension-length', function (req, res) {
  req.session.extensionLength = req.body.extensionLength
  res.redirect('check-your-answers')
})
router.get('/check-your-answers', function (req, res) {
  console.log(req.session.extensionReasons)
  res.render('check-your-answers', {
    extensionReasons: req.session.extensionReasons,
    extensionLength: req.session.extensionLength
  })
})
router.post('/check-your-answers', function (req, res) {
  res.redirect('confirmation')
})
router.get('/confirmation', function (req, res) {
  res.render('confirmation')
})
router.post('/confirmation', function (req, res) {
  res.redirect('confirmation')
})
module.exports = router
