module.exports = function (router) {
  router.get('/computer-problem/reason-computer-problem', function (req, res) {
    var id = 0
    var info = ''
    if (req.query.id) {
      id = req.query.id
      info = req.session.extensionReasons[id].computerProblem
      res.render('computer-problem/reason-computer-problem', {
        id: id,
        info: info
      })
    } else {
      res.render('computer-problem/reason-computer-problem')
    }
  })
  router.post('/computer-problem/reason-computer-problem', function (req, res) {
    var computerProblem = req.body.computerProblem
    var editId = req.body.editId
    var errorFlag = false
    var Err = {}
    var errorList = []

    if (computerProblem === '') {
      Err.type = 'blank'
      Err.text = 'You must give us more information'
      Err.href = '#computerProblem'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('computer-problem/reason-computer-problem', {
        errorList: errorList,
        Err: Err
      })
    } else {
      if (req.body.editId !== '') {
        req.session.extensionReasons[editId].computerProblem = computerProblem
        res.redirect('/check-your-answers')
      } else {
        var reasonObject = req.session.extensionReasons.pop()
        reasonObject.computerProblem = req.body.computerProblem
        req.session.extensionReasons.push(reasonObject)
        res.redirect('/evidence')
      }
    }
  })
}
