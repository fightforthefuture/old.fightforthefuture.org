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

})(document, window);
