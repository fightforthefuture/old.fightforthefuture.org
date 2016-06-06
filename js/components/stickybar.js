window.components = window.components || {};
window.components.stickybar = function (doc, win) {
  /**
   * Retrieves petition data from Action Network API, then submits signature
   * @param {object} doc - Document object
   * @param {object} win - Window object
   * */
  "use strict";

  var
    petitionBox = doc.querySelector('.petition-box'),
    petitionBottom = petitionBox.offsetTop + petitionBox.clientHeight;


  function slideInStickyBar() {
    /**
     * Does what it says on the tin.
     * */
    doc.querySelector('.stickybar').style.top = '0';
  }

  function slideOutStickyBar() {
    /**
     * Does what it says on the tin.
     * */
    doc.querySelector('.stickybar').style.top = '-5rem';
  }

  function manageStickyBar() {
    /**
     * Checks where the page is scrolled to, decides whether or not to slide the
     * StickyBar back in.
     * */

    if (petitionBottom < win.scrollY) {
      slideInStickyBar();
    } else {
      slideOutStickyBar();
    }
  }

  function scrollToForm(e) {
    e.preventDefault();

    win.smoothScroll(petitionBox);
  }

  function addEventListeners() {
    /**
     * Attaches all the listeners all the places
     * */
    win.addEventListener('load', manageStickyBar);
    win.addEventListener('scroll', manageStickyBar);
    win.addEventListener('resize', manageStickyBar);
    doc.querySelector('.stickybar-take-action').addEventListener('click', scrollToForm);
    var share = function(e) {
      e.preventDefault();
      FreeProgress.share();
    };
    var tweet = function(e) {
      e.preventDefault();
      FreeProgress.tweet();
    };
    doc.querySelector('.stickybar-facebook-share').addEventListener('click', share);
    doc.querySelector('.stickybar-twitter-share').addEventListener('click', tweet);
    doc.querySelector('.share-this-fb').addEventListener('click', share);
    doc.querySelector('.share-this-tw').addEventListener('click', tweet);
  }

  function init() {
    addEventListeners();
  }

  init();
};
