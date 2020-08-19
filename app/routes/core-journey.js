const del = require('del')

module.exports = function (router) {
  router.get('/choose-reason', function (req, res) {
    var companyNumber = req.session.scenario.company.number
    var id = 0
    var reasonObject = {}
    var checkedCovid = false
    var checkedIllness = false
    var checkedAuthCode = false
    var checkedDamage = false
    var checkedComputer = false
    var checkedAccounts = false
    var checkedCompany = false
    var checkedDisaster = false

    if (req.query.restart === 'yes') {
      req.session.extensionReasons = []
      del('public/saved-sessions/' + companyNumber + '.json')
      res.render('choose-reason')
    } else if (req.query.id) {
      id = req.query.id
      console.log(req.session.extensionReasons)
      reasonObject = req.session.extensionReasons[id]
      switch (reasonObject.reason) {
        case 'covid':
          checkedCovid = true
          break
        case 'illness':
          checkedIllness = true
          break
        case 'authCode':
          checkedAuthCode = true
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
        checkedCovid: checkedCovid,
        checkedIllness: checkedIllness,
        checkedAuthCode: checkedAuthCode,
        checkedDamage: checkedDamage,
        checkedComputer: checkedComputer,
        checkedAccounts: checkedAccounts,
        checkedCompany: checkedCompany,
        checkedDisaster: checkedDisaster,
        id: id
      })
    } else {
      res.render('choose-reason')
    }
  })
  router.post('/choose-reason', function (req, res) {
    var reasonObject = {}
    var deadlineStatus = req.session.scenario.company.deadlineStatus
    var extensionReason = req.body.extensionReason
    var editId = req.body.editId
    var errorFlag = false
    var extensionReasonErr = {}
    var errorList = []
    reasonObject.documents = []

    if (typeof extensionReason === 'undefined') {
      extensionReasonErr.type = 'blank'
      extensionReasonErr.text = 'You must select a reason'
      extensionReasonErr.href = '#choose-reason-1'
      extensionReasonErr.flag = true
    }
    if (extensionReasonErr.flag) {
      errorList.push(extensionReasonErr)
      errorFlag = true
    }
    if (errorFlag === true) {
      req.session.extensionReasons.push(reasonObject)
      res.render('choose-reason', {
        errorList: errorList,
        extensionReasonErr: extensionReasonErr,
        extensionReason: extensionReason,
        deadlineStatus: deadlineStatus
      })
    } else {
      reasonObject.reason = req.body.extensionReason
      reasonObject.complete = false
      switch (req.body.extensionReason) {
        case 'covid':
          if (editId !== '') {
            req.session.extensionReasons[editId].reason = reasonObject.reason
          } else {
            reasonObject.nextStep = 'coronavirus-information'
            req.session.extensionReasons.push(reasonObject)
          }
          res.redirect('/coronavirus-information')
          break
        case 'illness':
          if (editId !== '') {
            req.session.extensionReasons[editId].reason = reasonObject.reason
          } else {
            reasonObject.nextStep = 'illness/who-was-ill'
            req.session.extensionReasons.push(reasonObject)
          }
          res.redirect('/illness/who-was-ill')
          break
        case 'authCode':
          if (editId !== '') {
            req.session.extensionReasons[editId].reason = reasonObject.reason
          } else {
            reasonObject.nextStep = '/add-extension-reason'
            req.session.extensionReasons.push(reasonObject)
          }
          res.redirect('/add-extension-reason')
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
          break
        case 'other':
          if (editId !== '') {
            req.session.extensionReasons[editId].reason = reasonObject.reason
          } else {
            reasonObject.nextStep = 'other/reason-other'
            req.session.extensionReasons.push(reasonObject)
          }
          res.redirect('other/reason-other')
          break
      }
    }
  })
  router.get('/coronavirus-information', function (req, res) {
    var id = 0
    var info = ''
    if (req.query.id) {
      id = req.query.id
      info = req.session.extensionReasons[id].coronavirusInformation
      res.render('coronavirus-information', {
        id: id,
        info: info
      })
    } else {
      res.render('coronavirus-information')
    }
  })
  router.post('/coronavirus-information', function (req, res) {
    var coronavirusInformation = req.body.coronavirusInformation
    var editId = req.body.editId
    var errorFlag = false
    var Err = {}
    var errorList = []

    if (coronavirusInformation === '') {
      Err.type = 'blank'
      Err.text = 'You must tell us more information'
      Err.href = '#coronavirus-information'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('coronavirus-information', {
        errorList: errorList,
        Err: Err
      })
    } else {
      if (req.body.editId !== '') {
        req.session.extensionReasons[editId].coronavirusInformation = coronavirusInformation
        res.redirect('/check-your-answers')
      } else {
        var reasonObject = req.session.extensionReasons.pop()
        reasonObject.coronavirusInformation = req.body.coronavirusInformation
        reasonObject.nextStep = 'check-your-answers'
        req.session.extensionReasons.push(reasonObject)
        res.redirect('/check-your-answers')
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
    var id = req.query.id

    res.render('evidence', {
      id: id
    })
  })
  router.post('/evidence', function (req, res) {
    var supportingEvidence = req.body.supportingEvidence
    var errorFlag = false
    var Err = {}
    var errorList = []
    var id = req.query.id
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
        Err: Err,
        id: id
      })
    } else {
      reasonObject = req.session.extensionReasons.pop()
      reasonObject.supportingEvidence = req.body.supportingEvidence
      req.session.extensionReasons.push(reasonObject)
      switch (req.body.supportingEvidence) {
        case 'yes':
          reasonObject.nextStep = 'evidence-upload'
          if (typeof id !== 'undefined') {
            res.redirect('/evidence-upload?id=' + id)
          } else {
            res.redirect('/evidence-upload')
          }
          break
        case 'no':
          if (req.session.extensionReasons.length > 0) {
            reasonObject.nextStep = 'check-your-answers'
            res.redirect('/check-your-answers')
          } else {
            reasonObject.nextStep = 'add-extension-reason'
            res.redirect('/add-extension-reason')
          }
          break
      }
    }
  })
  router.get('/evidence-upload', function (req, res) {
    var reasonObject = {}
    var id = req.query.id
    var continueLink = ''

    console.log(id)

    if (req.query.id) {
      reasonObject = req.session.extensionReasons[id]
      continueLink = 'check-your-answers'
    } else {
      reasonObject = req.session.extensionReasons.pop()
      req.session.extensionReasons.push(reasonObject)
      if (req.session.extensionReasons.length > 0) {
        continueLink = 'check-your-answers'
      } else {
        continueLink = 'add-extension-reason'
      }
    }

    res.render('evidence-upload', {
      reasonObject: reasonObject,
      id: id,
      continueLink: continueLink
    })
  })
  router.post('/evidence-upload', function (req, res) {
    var reasonObject = {}
    var doc = req.body.fileUpload
    var id = req.body.id
    var fileName = []
    var errorFlag = false
    var Err = {}
    var errorList = []
    var continueLink = ''

    console.log(id)

    if (req.body.continueCheck) {
      if (id !== '') {
        reasonObject = req.session.extensionReasons[id]
      } else {
        reasonObject = req.session.extensionReasons.pop()
        req.session.extensionReasons.push(reasonObject)
      }
      if (reasonObject.documents.length > 0) {
        if (req.session.extensionReasons.length > 0) {
          res.redirect('check-your-answers')
        } else {
          res.redirect('add-extension-reason')
        }
      } else {
        Err.type = 'blank'
        Err.text = 'You must add a document or select "Continue without adding documents"'
        Err.href = '#file-upload-1'
        Err.flag = true
        errorList.push(Err)
        errorFlag = true

        if (errorFlag === true) {
          if (req.body.id) {
            reasonObject = req.session.extensionReasons[id]
            continueLink = 'check-your-answers'
          } else {
            reasonObject = req.session.extensionReasons.pop()
            req.session.extensionReasons.push(reasonObject)
            if (req.session.extensionReasons.length > 0) {
              continueLink = 'check-your-answers'
            } else {
              continueLink = 'add-extension-reason'
            }
          }
          res.render('evidence-upload', {
            errorList: errorList,
            Err: Err,
            reasonObject: reasonObject,
            id: id,
            continueLink: continueLink
          })
        }
      }
    } else {
      fileName = doc.split('.').pop()

      if (fileName === 'html') {
        Err.type = 'unsupported'
        Err.text = 'We do not support files with an extension of \'' + fileName + '\''
        Err.href = '#file-upload'
        Err.flag = true
        errorList.push(Err)
        errorFlag = true
      }
      if (fileName === 'sh') {
        Err.type = 'size'
        Err.text = 'Documents must be smaller than 4MB'
        Err.href = '#file-upload'
        Err.flag = true
        errorList.push(Err)
        errorFlag = true
      }
      if (errorFlag === true) {
        if (req.body.id) {
          reasonObject = req.session.extensionReasons[id]
          continueLink = 'check-your-answers'
        } else {
          reasonObject = req.session.extensionReasons.pop()
          req.session.extensionReasons.push(reasonObject)
          if (req.session.extensionReasons.length > 0) {
            continueLink = 'check-your-answers'
          } else {
            continueLink = 'add-extension-reason'
          }
        }
        res.render('evidence-upload', {
          errorList: errorList,
          Err: Err,
          doc: doc.split('\\'),
          reasonObject: reasonObject,
          id: id,
          continueLink: continueLink
        })
      } else {
        if (req.body.id) {
          reasonObject.nextStep = 'check-your-answers'
          req.session.extensionReasons[id].documents.push(doc)
          res.redirect('/evidence-upload?id=' + id)
        } else {
          reasonObject.nextStep = 'evidence-upload'
          reasonObject = req.session.extensionReasons.pop()
          reasonObject.documents.push(doc)
          req.session.extensionReasons.push(reasonObject)
          res.redirect('/evidence-upload')
        }
      }
    }
  })
  router.get('/remove-document', function (req, res) {
    var documentID = req.query.documentID
    var reasonID = req.query.reasonID
    var reasonObject = {}

    if (reasonID === '') {
      reasonObject = req.session.extensionReasons.pop()
      req.session.extensionReasons.push(reasonObject)
    } else {
      reasonObject = req.session.extensionReasons[reasonID]
    }

    res.render('remove-document', {
      documentID: documentID,
      reasonID: reasonID,
      fileName: reasonObject.documents[documentID]
    })
  })
  router.post('/remove-document', function (req, res) {
    var documentID = req.body.documentID
    var reasonID = req.body.reasonID
    var reasonObject = {}
    var removeDocument = req.body.removeDocument
    var errorFlag = false
    var Err = {}
    var errorList = []

    if (reasonID === '') {
      reasonObject = req.session.extensionReasons.pop()
    } else {
      reasonObject = req.session.extensionReasons[reasonID]
    }

    if (typeof removeDocument === 'undefined') {
      Err.type = 'blank'
      Err.text = 'You must tell us if you want to remove the document'
      Err.href = '#remove-document-1'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      if (reasonID === '') {
        req.session.extensionReasons.push(reasonObject)
      }
      res.render('remove-document', {
        errorList: errorList,
        Err: Err,
        documentID: documentID,
        reasonID: reasonID,
        fileName: reasonObject.documents[documentID]
      })
    } else {
      switch (removeDocument) {
        case 'yes':
          if (reasonID === '') {
            reasonObject.documents.splice(documentID, 1)
            req.session.extensionReasons.push(reasonObject)
          } else {
            reasonObject.documents.splice(documentID, 1)
            req.session.extensionReasons[reasonID] = reasonObject
          }
          break
        case 'no':
          if (reasonID === '') {
            req.session.extensionReasons.push(reasonObject)
          }
          break
      }
      if (reasonID === '') {
        res.redirect('/evidence-upload')
      } else {
        res.redirect('/evidence-upload?id=' + reasonID)
      }
    }
  })
  router.get('/accountsnotdue', function (req, res) {
    res.render('accountsnotdue', {
      scenario: req.session.scenario
    })
  })
  router.post('/accountsnotdue', function (req, res) {
    res.redirect('accountsnotdue')
  })
  router.get('/accountsnotneeded', function (req, res) {
    res.render('accountsnotneeded', {
      scenario: req.session.scenario
    })
  })
  router.post('/accountsnotneeded', function (req, res) {
    res.redirect('accountsnotneeded')
  })
  router.get('/account-reference-date', function (req, res) {
    res.render('account-reference-date', {
      scenario: req.session.scenario
    })
  })
  router.post('/account-reference-date', function (req, res) {
    res.redirect('/choose-reason')
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
    var removeReason = req.body.removeReason
    var errorFlag = false
    var Err = {}
    var errorList = []

    reasonObject = req.session.extensionReasons[id]

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
  router.get('/delete-application', function (req, res) {
    res.render('delete-application', {
      scenario: req.session.scenario
    })
  })
  router.post('/delete-application', function (req, res) {
    var reasonObject = {}
    var deleteApplication = req.body.deleteApplication
    var errorFlag = false
    var Err = {}
    var errorList = []

    if (typeof deleteApplication === 'undefined') {
      Err.type = 'blank'
      Err.text = 'You must tell us if you want to remove this reason'
      Err.href = '#delete-application-1'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('delete-application', {
        errorList: errorList,
        Err: Err,
        reason: reasonObject,
        extensionReasons: req.session.extensionReasons
      })
    } else {
      switch (deleteApplication) {
        case 'yes':
          res.redirect('/start')
          break
        case 'no':
          res.redirect('/check-your-answers')
          break
      }
    }
  })
}
