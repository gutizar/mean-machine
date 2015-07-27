/**
 * hobiles.filters Module
 *
 * Description
 */
var filters = angular.module('hobiles.filters', []);

filters.filter('timeAgo', function () {
  return function (input) {
    var res = '',
        day = 24 * 60 * 60 * 1000,
        hour = 60 * 60 * 1000,
        minute = 60 * 1000,
        second = 1000,
        difference = new Date() - new Date(input);

    if (difference > day) {
      res = Math.floor(difference / day);
      res = res + ' ' + (res > 1 ? 'days' : 'day');
    } else if (difference > hour) {
      res = Math.floor(difference / hour);
      res = res + ' ' + (res > 1 ? 'hours' : 'hour');
    } else if (difference > minute) {
      res = Math.floor(difference / minute);
      res = res + ' ' + (res > 1 ? 'minutes' : 'minute');
    } else {
      res = Math.floor(difference / second);
      res = res + ' ' + (res > 1 ? 'seconds' : 'second');
    }
    return res + ' ago';
  };
});
