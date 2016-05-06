/**
 *  util : random grab bag functions
 */

var $c  = document.createElement.bind(document);
var $el = document.getElementById.bind(document);

util = {
  getReferrerTag: function() {
    var ref = document.referrer;
    if (ref.indexOf('facebook.com') !== -1)
      return 'from-facebook';
    else if (ref.indexOf('twitter.com') !== -1 || ref.indexOf('t.co') !== -1)
      return 'from-twitter';
    else if (ref.indexOf('reddit.com') !== -1)
      return 'from-reddit';
    else if (window.location.href.indexOf('_src=ga') !== -1)
      return 'from-google-adwords';
    else if (ref.indexOf('google.com') !== -1)
      return 'from-google';
  },
  parseQueryString: function () {
    var
      i,
      pairs,
      queryObject = {},
      queryString = window.location.search;

    if (queryString[0] === '?') {
      queryString = queryString.substr(1);
    }

    pairs = queryString.split('&');
    i = pairs.length;

    while (i--) {
      queryObject[pairs[i].split('=')[0]] = pairs[i].split('=')[1];
    }

    return queryObject;
  }
};
