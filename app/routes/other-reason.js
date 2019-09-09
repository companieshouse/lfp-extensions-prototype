module.exports = function (router) {
  router.get('/other/reason-other', function (req, res) {
    var id = 0
    var otherReason = ''
    var otherInformation = ''
    if (req.query.id) {
      id = req.query.id
      otherReason = req.session.extensionReasons[id].otherReason
      otherInformation = req.session.extensionReasons[id].otherInformation
      res.render('other/reason-other', {
        id: id,
        otherReason: otherReason,
        otherInformation: otherInformation
      })
    } else {
      res.render('other/reason-other')
    }
  })
  router.post('/other/reason-other', function (req, res) {
    var otherInformation = req.body.otherInformation
    var otherReason = req.body.otherReason
    var editId = req.body.editId
    var errorFlag = false
    var Err = {}
    var errorList = []

    if (otherInformation === '') {
      Err.type = 'blank'
      Err.text = 'You must provide more information'
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
        Err: Err,
        id: editId,
        otherReason: otherReason,
        otherInformation: otherInformation
      })
    } else {
      if (editId !== '') {
        req.session.extensionReasons[editId].otherReason = req.body.otherReason
        req.session.extensionReasons[editId].otherInformation = req.body.otherInformation
        res.redirect('/check-your-answers')
      } else {
        var reasonObject = req.session.extensionReasons.pop()
        reasonObject.otherReason = req.body.otherReason
        reasonObject.otherInformation = req.body.otherInformation
        req.session.extensionReasons.push(reasonObject)
        res.redirect('/evidence')
      }
    }
  })
}
