const del = require('del')

module.exports = function (router) {
  router.get('/choose-reason', function (req, res) {
    console.log('/// CHOOSE REASON ///')
    console.log(req.query)
    console.log(req.session.scenario)
    var companyNumber = req.session.scenario.company.number
    var id = 0
    var reasonObject = {}
    var checkedIllness = false
    var checkedDamage = false
    var checkedComputer = false
    var checkedAccounts = false
    var checkedCompany = false
    var checkedDisaster = false

    if (req.query.restart === 'yes') {
      console.log('/// RESTART ///')
      req.session.extensionReasons = []
      del('public/saved-sessions/' + companyNumber + '.json')
      res.render('choose-reason')
    } else if (req.query.id) {
      console.log('/// EDIT MODE ///')
      id = req.query.id
      console.log(req.session.extensionReasons)
      reasonObject = req.session.extensionReasons[id]
      switch (reasonObject.reason) {
        case 'illness':
          checkedIllness = true
          break
        case 'damage':
          checkedDamage = true
          break
        case 'computerProblem':
          checkedComputer = true
          break
        case 'accounts':
          checkedAccounts = true
          break
        case 'companyChanges':
          checkedCompany = true
          break
        case 'disaster':
          checkedDisaster = true
          break
      }
      res.render('choose-reason', {
        checkedIllness: checkedIllness,
        checkedDamage: checkedDamage,
        checkedComputer: checkedComputer,
        checkedAccounts: checkedAccounts,
        checkedCompany: checkedCompany,
        checkedDisaster: checkedDisaster,
        id: id
      })
    } else {
      console.log('/// NUTHIN ///')
      res.render('choose-reason')
    }
  })
  router.post('/choose-reason', function (req, res) {
    var reasonObject = {}
    var extensionReason = req.body.extensionReason
    var otherReason = req.body.otherReason
    var editId = req.body.editId
    var errorFlag = false
    var extensionReasonErr = {}
    var otherReasonErr = {}
    var errorList = []

    if (typeof extensionReason === 'undefined') {
      extensionReasonErr.type = 'blank'
      extensionReasonErr.text = 'You must select a reason'
      extensionReasonErr.href = '#choose-reason-1'
      extensionReasonErr.flag = true
    }
    if (extensionReason === 'other' && otherReason === '') {
      extensionReasonErr.type = 'invalid'
      extensionReasonErr.text = 'You must tell us the reason'
      extensionReasonErr.href = '#other-reason'
      extensionReasonErr.flag = true
    }
    if (extensionReasonErr.flag) {
      errorList.push(extensionReasonErr)
      errorFlag = true
    }
    if (otherReasonErr.flag) {
      errorList.push(otherReasonErr)
      errorFlag = true
    }
    if (errorFlag === true) {
      req.session.extensionReasons.push(reasonObject)
      res.render('choose-reason', {
        errorList: errorList,
        extensionReasonErr: extensionReasonErr,
        otherReasonErr: otherReasonErr,
        extensionReason: extensionReason,
        otherReason: otherReason
      })
    } else {
      reasonObject.reason = req.body.extensionReason
      reasonObject.complete = false
      switch (req.body.extensionReason) {
        case 'illness':
          if (editId !== '') {
            req.session.extensionReasons[editId].reason = reasonObject.reason
          } else {
            reasonObject.nextStep = 'illness/who-was-ill'
            req.session.extensionReasons.push(reasonObject)
          }
          res.redirect('/illness/who-was-ill')
          break
        case 'damage':
          if (editId !== '') {
            req.session.extensionReasons[editId].reason = reasonObject.reason
          } else {
            reasonObject.nextStep = '/theft-criminal-damage/damage-date'
            req.session.extensionReasons.push(reasonObject)
          }
          res.redirect('/theft-criminal-damage/damage-date')
          break
        case 'disaster':
          if (editId !== '') {
            req.session.extensionReasons[editId].reason = reasonObject.reason
          } else {
            reasonObject.nextStep = '/natural-disaster/disaster-date'
            req.session.extensionReasons.push(reasonObject)
          }
          res.redirect('/natural-disaster/disaster-date')
          break
        case 'accounts':
          if (editId !== '') {
            req.session.extensionReasons[editId].reason = reasonObject.reason
          } else {
            reasonObject.nextStep = '/accounts/accounts-date'
            req.session.extensionReasons.push(reasonObject)
          }
          res.redirect('/accounts/accounts-date')
          break
        case 'companyChanges':
          if (editId !== '') {
            req.session.extensionReasons[editId].reason = reasonObject.reason
          } else {
            reasonObject.nextStep = '/company-changes/change-happened'
            req.session.extensionReasons.push(reasonObject)
          }
          res.redirect('/company-changes/change-happened')
          break
        case 'computerProblem':
          if (editId !== '') {
            req.session.extensionReasons[editId].reason = reasonObject.reason
          } else {
            reasonObject.nextStep = '/computer-problem/choose-computer-problem'
            req.session.extensionReasons.push(reasonObject)
          }
          res.redirect('/computer-problem/choose-computer-problem')
          console.log(req.session.extensionReasons)
          break
        case 'death':
          if (editId !== '') {
            req.session.extensionReasons[editId].reason = reasonObject.reason
          } else {
            req.session.extensionReasons.push(reasonObject)
          }
          res.redirect('/death/reason-death')
          break
        case 'other':
          reasonObject.otherReason = req.body.otherReason
          reasonObject.nextStep = 'other/reason-other'
          req.session.extensionReasons.push(reasonObject)
          res.redirect('other/reason-other')
          break
      }
    }
  })
  router.get('/add-extension-reason', function (req, res) {
    res.render('add-extension-reason')
  })
  router.post('/add-extension-reason', function (req, res) {
    var addExtensionReason = req.body.addExtensionReason
    var errorFlag = false
    var Err = {}
    var errorList = []

    if (typeof addExtensionReason === 'undefined') {
      Err.type = 'blank'
      Err.text = 'You must tell us if there is another reason for your extension'
      Err.href = '#add-extension-reason-1'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('add-extension-reason', {
        errorList: errorList,
        Err: Err
      })
    } else {
      switch (req.body.addExtensionReason) {
        case 'yes':
          res.redirect('/choose-reason')
          break
        case 'no':
          res.redirect('/check-your-answers')
          break
      }
    }
  })

  router.get('/evidence', function (req, res) {
    res.render('evidence')
  })
  router.post('/evidence', function (req, res) {
    var supportingEvidence = req.body.supportingEvidence
    var errorFlag = false
    var Err = {}
    var errorList = []
    var reasonObject = {}

    if (typeof supportingEvidence === 'undefined') {
      Err.type = 'blank'
      Err.text = 'You must tell us if you want to upload evidence'
      Err.href = '#supporting-evidence-1'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('evidence', {
        errorList: errorList,
        Err: Err
      })
    } else {
      reasonObject = req.session.extensionReasons.pop()
      reasonObject.supportingEvidence = req.body.supportingEvidence
      req.session.extensionReasons.push(reasonObject)
      switch (req.body.supportingEvidence) {
        case 'yes':
          reasonObject.nextStep = 'evidence-upload'
          res.redirect('/evidence-upload')
          break
        case 'no':
          reasonObject.nextStep = 'add-extension-reason'
          res.redirect('/add-extension-reason')
          break
      }
    }
  })
  router.get('/evidence-upload', function (req, res) {
    res.render('evidence-upload')
  })
  router.post('/evidence-upload', function (req, res) {
    var reasonObject = {}

    reasonObject.nextStep = 'complete'
    res.redirect('/add-extension-reason')
  })
  router.get('/accountsnotdue', function (req, res) {
    res.render('accountsnotdue', {
      scenario: req.session.scenario
    })
  })
  router.post('/accountsnotdue', function (req, res) {
    res.redirect('accountsnotdue')
  })
  router.get('/ptf/ptf', function (req, res) {
    res.render('ptf/ptf', {
      scenario: req.session.scenario
    })
  })
  router.post('/ptf/ptf', function (req, res) {
    var ptfConfirm = req.body.ptfConfirm
    var errorFlag = false
    var Err = {}
    var errorList = []
    if (ptfConfirm === '_unchecked') {
      Err.type = 'blank'
      Err.text = 'You must declare the company is still active and will file its accounts before continuing'
      Err.href = '#ptfConfirm'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('ptf/ptf', {
        errorList: errorList,
        Err: Err
      })
    } else {
      res.redirect('/ptf/ptfconfirm')
    }
  })
  router.get('/ptf/ptfconfirm', function (req, res) {
    res.render('ptf/ptfconfirm', {
      scenario: req.session.scenario
    })
  })
  router.post('/ptf/ptfconfirm', function (req, res) {
    res.redirect('ptfconfirm')
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
  router.get('/remove-reason', function (req, res) {
    var id = req.query.id
    var reasonObject = {}
    reasonObject = req.session.extensionReasons[id]
    res.render('remove-reason', {
      scenario: req.session.scenario,
      extensionReasons: req.session.extensionReasons,
      reason: reasonObject,
      id: id
    })
  })
  router.post('/remove-reason', function (req, res) {
    var id = req.body.id
    var reasonObject = {}
    reasonObject = req.session.extensionReasons[id]
    var removeReason = req.body.removeReason
    var errorFlag = false
    var Err = {}
    var errorList = []

    if (typeof removeReason === 'undefined') {
      Err.type = 'blank'
      Err.text = 'You must tell us if you want to remove this reason'
      Err.href = '#remove-reason-1'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('remove-reason', {
        errorList: errorList,
        Err: Err,
        reason: reasonObject,
        extensionReasons: req.session.extensionReasons
      })
    } else {
      switch (removeReason) {
        case 'yes':
          req.session.extensionReasons.splice(id, 1)
          if (req.session.extensionReasons.length === 0) {
            res.redirect('/choose-reason')
          } else {
            res.redirect('/check-your-answers')
          }
          break
        case 'no':
          res.redirect('/check-your-answers')
          break
      }
    }
  })
}
