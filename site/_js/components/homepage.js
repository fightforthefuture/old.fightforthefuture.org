window.components = win.components || {};
window.components.homepage = function (doc, win) {
  (function () {

    var
      headerElement = doc.querySelector('header'),
      zoomElement = doc.querySelector('.zoom-out-intro'),
      oldOpacity = 1;

    function onScroll() {
      var newOpacity = Math.max(1 - (win.pageYOffset / 320), 0);

      if (newOpacity === oldOpacity)
        return;

      var newScale = (5 / 6) + (newOpacity / 6);

      headerElement.style.opacity = newOpacity;
      zoomElement.style.opacity = newOpacity;
      zoomElement.style.transition = 'none';
      zoomElement.style.transform = 'scale(' + newScale + ')';
      zoomElement.style.webkitTransform = 'scale(' + newScale + ')';

      oldOpacity = newOpacity;
    }

    win.addEventListener('scroll', onScroll, false);
  })();


  (function () {
    // Preloading & fading in David background
    var
      url = 'homepage/images/david-by-michelangelo.jpg',
      image = new Image();

    image.src = url;
    image.onload = function () {
      doc.querySelector('.david-by-michelangelo').className += ' loaded ';
    }
  }());

  (function () {
  // Mobile navigation
    var
      cheeseburger = doc.querySelector('.cheeseburger'),
      navElement = doc.querySelector('nav.top'),
      mobileNavElement = doc.querySelector('.mobile-nav'),
      mobileNavigationIsExpanded = false;

    cheeseburger.addEventListener('click', function (e) {
      if (mobileNavigationIsExpanded) {
        navElement.className = navElement.className.replace(' expanded ', '');
        mobileNavElement.className = mobileNavElement.className.replace(' expanded ', '');
      } else {
        navElement.className += ' expanded ';
        mobileNavElement.className += ' expanded ';
      }
      mobileNavigationIsExpanded = !mobileNavigationIsExpanded;
    }, false);
  }());
};
