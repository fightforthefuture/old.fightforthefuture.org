(function (doc, win) {
  "use strict";

  function hashChange() {
    // the hashChange thing only matters for "inner" pages. we shall nudge inline
    // links so the fixed header won't partially obscure them
    if (win.location.hash == '#signup')
      new OrgSignupController();
    else if (win.location.hash != '#' && win.location.hash != '')
      if (doc.getElementById(win.location.hash.substr(1)))
        setTimeout(function () {
          var doc = doc.docElement;
          var top = (win.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
          scrollTo(0, top - 75);
        }, 10);
  }

  function triggerComponents() {
    win.components = win.components || {};
    var
      i = 0,
      components = doc.getElementsByTagName('body')[0].dataset.components;

    if (components !== undefined) {
      components = components.split(' ');
      i = components.length;

      if (components.indexOf('homepage') >= 0) {
        win.onhashchange = hashChange;
        hashChange();
      }

      while (i--) {
        if (components[i] !== '' && win.components[components[i]] !== undefined) {
          win.components[components[i]](doc, win);
        }
      }
    }
  }

  triggerComponents();

  var signups = document.querySelectorAll('form.signup');

  for (var i = 0; i < signups.length; i++) {
    signups[i].addEventListener('submit', function (e) {
      e.preventDefault();

      var page_id = this.id || 'www-signup';
      var email = this.querySelector('input[name="email"]');

      if (!email.value) {
        email.className = 'error';
        alert('Please enter an email address :)');
        return email.focus();
      }

      new OrgReferralController({page_id: page_id}).submit({
        email: email.value
      });

      new ShareModalController({
        headline: 'Thanks for signing up!',
        text: 'We\'re looking forward to sharing our work with you. Together we will make sure the Internet always wins! Please continue exploring this site to learn more about Fight for the Future. You are a wonderful person <3'
      });
    });
  }

  var logo = document.querySelector('.logo-large');
  if (logo)
    if (logo.complete)
      logo.style.opacity = 1;
    else
      logo.onload = function() {
        logo.style.opacity = 1;
      };

})(document, window);
