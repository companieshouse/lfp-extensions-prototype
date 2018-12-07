module.exports = function (router) {
  router.get('/theft-criminal-damage/reason-damage', function (req, res) {
    var id = 0
    var info = ''
    if (req.query.id) {
      id = req.query.id
      info = req.session.extensionReasons[id].damage
      res.render('theft-criminal-damage/reason-damage', {
        id: id,
        info: info
      })
    } else {
      res.render('theft-criminal-damage/reason-damage')
    }
  })
  router.post('/theft-criminal-damage/reason-damage', function (req, res) {
    var damage = req.body.damage
    var editId = req.body.editId
    var errorFlag = false
    var Err = {}
    var errorList = []

    if (damage === '') {
      Err.type = 'blank'
      Err.text = 'You must give us more information'
      Err.href = '#damage'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('theft-criminal-damage/reason-damage', {
        errorList: errorList,
        Err: Err
      })
    } else {
      if (req.body.editId !== '') {
        req.session.extensionReasons[editId].damage = damage
        res.redirect('/check-your-answers')
      } else {
        var reasonObject = req.session.extensionReasons.pop()
        reasonObject.damage = req.body.damage
        req.session.extensionReasons.push(reasonObject)
        res.redirect('/evidence')
      }
    }
  })
}
