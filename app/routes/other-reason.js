module.exports = function (router) {
  router.get('/other/reason-other', function (req, res) {
    var id = 0
    var info = ''
    if (req.query.id) {
      id = req.query.id
      info = req.session.extensionReasons[id].otherInformation
      res.render('other/reason-other', {
        id: id,
        info: info
      })
    } else {
      res.render('other/reason-other')
    }
  })
  router.post('/other/reason-other', function (req, res) {
    var otherInformation = req.body.otherInformation
    var editId = req.body.editId
    var errorFlag = false
    var Err = {}
    var errorList = []

    if (otherInformation === '') {
      Err.type = 'blank'
      Err.text = 'You must give us more information'
      Err.href = '#other-information'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('other/reason-other', {
        errorList: errorList,
        Err: Err
      })
    } else {
      if (req.body.editId !== '') {
        req.session.extensionReasons[editId].otherInformation = otherInformation
        res.redirect('/check-your-answers')
      } else {
        var reasonObject = req.session.extensionReasons.pop()
        reasonObject.otherInformation = req.body.otherInformation
        reasonObject.nextStep = 'evidence'
        req.session.extensionReasons.push(reasonObject)
        res.redirect('/evidence')
      }
    }
  })
}
