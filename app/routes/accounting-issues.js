module.exports = function (router) {
  router.get('/accounts/reason-accounts', function (req, res) {
    var id = 0
    var info = ''
    if (req.query.id) {
      id = req.query.id
      info = req.session.extensionReasons[id].accounts
      res.render('accounts/reason-accounts', {
        id: id,
        info: info
      })
    } else {
      res.render('accounts/reason-accounts')
    }
  })
  router.post('/accounts/reason-accounts', function (req, res) {
    var accounts = req.body.accounts
    var editId = req.body.editId
    var errorFlag = false
    var Err = {}
    var errorList = []

    if (accounts === '') {
      Err.type = 'blank'
      Err.text = 'You must give us more information'
      Err.href = '#accounts'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('accounts/reason-accounts', {
        errorList: errorList,
        Err: Err
      })
    } else {
      if (req.body.editId !== '') {
        req.session.extensionReasons[editId].accounts = accounts
        res.redirect('/check-your-answers')
      } else {
        var reasonObject = req.session.extensionReasons.pop()
        reasonObject.accounts = req.body.accounts
        req.session.extensionReasons.push(reasonObject)
        res.redirect('/evidence')
      }
    }
  })
}
