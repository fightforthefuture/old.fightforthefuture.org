(function (doc, win) {
  "use strict";

  /*
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
  */

  function triggerComponents() {
    win.components = win.components || {};
    var
      i = 0,
      components = doc.getElementsByTagName('body')[0].dataset.components;

    if (components !== undefined) {
      components = components.split(' ');
      i = components.length;

      /*
      if (components.indexOf('homepage') >= 0) {
        win.onhashchange = hashChange;
        hashChange();
      }
      */

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

      var formData = new FormData();
      formData.append('guard', '');
      formData.append('hp_enabled', true);
      formData.append('member[email]', email.value);
      formData.append('org', 'fftf');
      formData.append('tag', page_id);

      var url = 'https://queue.fightforthefuture.org/action';

      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          console.log('response:', xhr.response);
        }
      }.bind(this);
      xhr.open("post", url, true);
      xhr.send(formData);

      var
        thanksContainer = $c('div'),
        thanksHeadline  = $c('h2'),
        thanksMessage   = $c('p'),
        shareContainer  = $c('div'),
        tweet           = $c('button'),
        share           = $c('button'),
        donate          = $c('button');

      thanksHeadline.textContent  = 'Thanks for signing up!';
      thanksMessage.textContent   = 'We\'re looking forward to sharing our work with you. Together we will make sure the Internet always wins! Please continue exploring this site to learn more about Fight for the Future. You are a wonderful person <3';

      tweet.textContent = 'Tweet';
      tweet.className   = 'social twitter';

      share.textContent = 'Share';
      share.className   = 'social facebook';

      donate.textContent = 'Donate';
      donate.className   = 'social donate';

      tweet.addEventListener('click', function() { FreeProgress.tweet(); });
      share.addEventListener('click', function() { FreeProgress.share(); });
      donate.addEventListener('click', function() {
        window.open('https://donate.fightforthefuture.org?tag='+page_id);
      });

      shareContainer.appendChild(share);
      shareContainer.appendChild(tweet);
      shareContainer.appendChild(donate);

      thanksContainer.appendChild(thanksHeadline);
      thanksContainer.appendChild(thanksMessage);
      thanksContainer.appendChild(shareContainer);
      new win.modals.generateModal({contents: thanksContainer});
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
