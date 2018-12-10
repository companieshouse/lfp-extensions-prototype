module.exports = function (router) {
  router.get('/natural-disaster/reason-natural-disaster', function (req, res) {
    var id = 0
    var info = ''
    if (req.query.id) {
      id = req.query.id
      info = req.session.extensionReasons[id].naturalDisaster
      res.render('natural-disaster/reason-natural-disaster', {
        id: id,
        info: info
      })
    } else {
      res.render('natural-disaster/reason-natural-disaster')
    }
  })
  router.post('/natural-disaster/reason-natural-disaster', function (req, res) {
    var naturalDisaster = req.body.naturalDisaster
    var editId = req.body.editId
    var errorFlag = false
    var Err = {}
    var errorList = []

    if (naturalDisaster === '') {
      Err.type = 'blank'
      Err.text = 'You must give us more information'
      Err.href = '#natural-disaster'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('natural-disaster/reason-natural-disaster', {
        errorList: errorList,
        Err: Err
      })
    } else {
      if (req.body.editId !== '') {
        req.session.extensionReasons[editId].naturalDistaster = naturalDisaster
        res.redirect('/check-your-answers')
      } else {
        var reasonObject = req.session.extensionReasons.pop()
        reasonObject.naturalDisaster = req.body.naturalDisaster
        req.session.extensionReasons.push(reasonObject)
        res.redirect('/evidence')
      }
    }
  })
}
