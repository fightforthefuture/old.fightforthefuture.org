window.components = win.components || {};
window.components.homepage = function (doc, win) {
  var
    headerElement = doc.querySelector('header'),
    zoomElement = doc.querySelector('.zoom-out-intro'),
    oldOpacity = 1,
    cheeseburger = doc.querySelector('.cheeseburger'),
    mobileNavigationIsExpanded = false;

  function onScroll() {
    var newOpacity = Math.max(1 - (win.pageYOffset / 320), 0);

    if (newOpacity === oldOpacity) {
      return;
    }

    var newScale = (5 / 6) + (newOpacity / 6);

    headerElement.style.opacity = newOpacity;
    zoomElement.style.opacity = newOpacity;
    zoomElement.style.transition = 'none';
    zoomElement.style.transform = 'scale(' + newScale + ')';
    zoomElement.style.webkitTransform = 'scale(' + newScale + ')';

    oldOpacity = newOpacity;
  }

  function loadDavid() {
    // Preloading & fading in David background
    var
      imageUrl = '/images/homepage/david-by-michelangelo.jpg',
      image = new Image();

    image.src = imageUrl;
    image.onload = function () {
      doc.querySelector('.david-by-michelangelo').className += ' loaded ';
    }
  }

  function mobileNavigation() {
    // Mobile navigation
    var navElement = doc.querySelector('nav.top');
    var mobileNavElement = doc.querySelector('.mobile-nav');

    if (mobileNavigationIsExpanded) {
      navElement.className = navElement.className.replace(' expanded ', '');
      mobileNavElement.className = mobileNavElement.className.replace(' expanded ', '');
    } else {
      navElement.className += ' expanded ';
      mobileNavElement.className += ' expanded ';
    }
    mobileNavigationIsExpanded = !mobileNavigationIsExpanded;
  }

  function makeProjectsClickable() {
    // make the projects section clickable
    var dls = doc.querySelectorAll('dl:not(.other)');

    for (var i = 0; i < dls.length; i++)
      dls[i].addEventListener('click', function (e) {
        e.preventDefault();
        win.open(this.querySelector('a').href);
      });

  }

  win.addEventListener('scroll', onScroll, false);
  cheeseburger.addEventListener('click', mobileNavigation);

  loadDavid();
  makeProjectsClickable();
};
