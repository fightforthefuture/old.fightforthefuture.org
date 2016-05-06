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

  scheduleDelayedAutoresponder: function(email) {
    var data = new FormData();
    data.append('email', email);
    data.append('url', window.location.href);

    var xhr = new XMLHttpRequest();

    var url = 'https://fftf.io/emails/schedule';
    var url = 'http://localhost:9002/emails/schedule'; // JL DEBUG ~

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4)
        if (xhr.status == 200)
          console.log('Scheduled delayed autoresponder: ', xhr.response);
        else
          console.error('Error posting delayed autoresponder: ', xhr.response);
    };
    xhr.open("post", url, true);
    xhr.send(data);

    console.log('lol');
  }
}
