module.exports = function (env) {
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  var filters = {}

  /* ------------------------------------------------------------------
    add your methods to the filters obj below this comment block:
    @example:

    filters.sayHi = function(name) {
        return 'Hi ' + name + '!'
    }

    Which in your templates would be used as:

    {{ 'Paul' | sayHi }} => 'Hi Paul'

    Notice the first argument of your filters method is whatever
    gets 'piped' via '|' to the filter.

    Filters can take additional arguments, for example:

    filters.sayHi = function(name,tone) {
      return (tone == 'formal' ? 'Greetings' : 'Hi') + ' ' + name + '!'
    }

    Which would be used like this:

    {{ 'Joel' | sayHi('formal') }} => 'Greetings Joel!'
    {{ 'Gemma' | sayHi }} => 'Hi Gemma!'

    For more on filters and how to write them see the Nunjucks
    documentation.

  ------------------------------------------------------------------ */

  filters.displayMonth = function (month) {
    switch (parseInt(month, 10)) {
      case 1:
        return 'January'
        break
      case 2:
        return 'February'
        break
      case 3:
        return 'March'
        break
      case 4:
        return 'April'
        break
      case 5:
        return 'May'
        break
      case 6:
        return 'June'
        break
      case 7:
        return 'July'
        break
      case 8:
        return 'August'
        break
      case 9:
        return 'September'
        break
      case 10:
        return 'October'
        break
      case 11:
        return 'November'
        break
      case 12:
        return 'December'
        break
    }
  }

  /* ------------------------------------------------------------------
    keep the following line to return your filters to the app
  ------------------------------------------------------------------ */
  return filters
}
