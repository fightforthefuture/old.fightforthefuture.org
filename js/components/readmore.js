(function (doc) {
  "use strict";
  function readMoreButtons() {
    /**
     * Makes content visible!
     * */
    var
      buttons = doc.getElementsByClassName('expand-text'),
      i = buttons.length;

    function expandText(e) {
      /**
       * Changes max-height on a given post.
       * @param {event} e - Event passed from listener
       * */
      var
        buttonClicked = e.target,
        text = buttonClicked.parentNode.nextElementSibling;

      text.classList.add('expanded');
      buttonClicked.parentNode.remove();
      text.parentNode.classList.add('text-expanded');
    }

    while (i--) {
      buttons[i].addEventListener('click', expandText);
    }
  }

  readMoreButtons();

})(document);
