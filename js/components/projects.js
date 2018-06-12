window.components = window.components || {};
window.components.projects = function (doc, win) {
  function makeProjectsClickable() {
    // make the projects section clickable
    var dls = doc.querySelectorAll('dl:not(.other)');

    for (var i = 0; i < dls.length; i++)
      dls[i].addEventListener('click', function (e) {
        e.preventDefault();
        win.open(this.querySelector('a').href);
      });
  }

  makeProjectsClickable();
};
