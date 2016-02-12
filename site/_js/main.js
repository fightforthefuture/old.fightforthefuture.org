(function (doc, win) {
  "use strict";

  function triggerComponents() {
    win.components = win.components || {};
    var
      i = 0,
      components = doc.getElementsByTagName('body')[0].dataset.components;

    if (components !== undefined) {
      components = components.split(' ');
      i = components.length;
    }

    while (i--) {
      if (components[i] !== '' && win.components[components[i]] !== undefined) {
        win.components[components[i]](doc, win);
      }
    }
  }

  triggerComponents();
})(document, window);
