/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  window.GOVUKFrontend.initAll()

  $('.govuk-file-upload').change(function () {
    var documentPathArray = []

    console.log($(this).val())
    documentPathArray = $(this).val().split('\\')
    console.log(documentPathArray)
    $('.upload-status__title').html(documentPathArray[2])
    $('.upload-status').show()
    $('.upload-status-heading').show()
    $('.file-upload').hide()
    $('.indicator').animate({
      width: ['100%', 'easeInOutCirc']
    }, {
      duration: 5000,
      step: function (now, fx) {
        $('.upload-status__value').html(Math.ceil(now))
      },
      complete: function () {
        $('#file-upload-form').submit()
      }
    })
  })

  $('.upload-status__link').click(function () {
    $('.indicator').stop()
    $('.upload-status').hide()
    $('.indicator').width('0')
    $('.upload-status__value').html('0')
    $('.upload-status-heading').hide()
    $('.file-upload').show()
    $('.govuk-file-upload').val('')
    return false
  })

  $('a[href="/sign-out"]').click(function () {
    var application = ''

    $.get('/get-session').done(function (data) {
      application = JSON.parse(data, null, '\t')
      console.log(application)
      localStorage.setItem('application' + application.scenario.company.number, data)
      window.location.replace('/sign-out')
    })
    return false
  })

  $('.session-check').click(function () {
    var companyNumber = ''
    var application = ''

    if ($('.govuk-input--company-number').val() !== '') {
      companyNumber = $('.govuk-input--company-number').val()
      if (localStorage.getItem('application' + companyNumber) !== null) {
        application = localStorage.getItem('application' + companyNumber)
        $.get('/set-session', {application: application}).done(function (data) {
          // console.log(application)
          window.location = '/resume-application'
          return false
        })
      } else {
        $('#companyForm').submit()
        return false
      }
    }
  })

  $('#illness-information').on('input', function (e) {
    if ($('#illness-information').val() === 'lorem') {
      $('#illness-information').val('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \n\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.')
    }
  })
})
