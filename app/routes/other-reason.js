module.exports = function (router) {
  router.get('/other/reason-other', function (req, res) {
    res.render('other/reason-other')
  })
  router.post('/other/reason-other', function (req, res) {
    var otherInformation = req.body.otherInformation
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
      var reasonObject = req.session.extensionReasons.pop()
      reasonObject.otherInformation = req.body.otherInformation
      req.session.extensionReasons.push(reasonObject)
      res.redirect('/evidence')
    }
  })
}
