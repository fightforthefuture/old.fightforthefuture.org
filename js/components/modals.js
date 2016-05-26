(function (doc, win) {
  "use strict";

  win.modals = win.modals || {};

  function dismissModal() {
    /**
     * Removes modal from DOM
     * */

    var
      modal = doc.getElementsByClassName('overlay')[0];

    modal.classList.remove('visible');

    win.setTimeout(function () {
      while (modal.firstChild) {
        modal.removeChild(modal.firstChild);
      }
      modal.remove();
    }, 420);
  }

  function generateModal(options) {
    /**
     * Triggers a modal
     *
     * @param {node} options.contents - any HTML to be used as modal content
     * (also accepts array of nodes)
     * @param {boolean} options.disableOverlayClick - if false (or absent),
     * function adds event listener to allow dismissal of modal by clicking on
     * overlay.
     * */

    var
      i,
      contents = options.contents,
      body     = doc.getElementsByTagName('body')[0],
      overlay  = doc.createElement('div'),
      modal    = doc.createElement('div'),
      closeModal;

    if (typeof contents === 'object') {
      if (contents.length === undefined) {
        contents = [contents];
      }
    } else {
      return false;
    }

    overlay.classList.add('overlay');
    modal.classList.add('modal-content');

    if (!options.disableOverlayClick) {
      closeModal = doc.createElement('button');
      closeModal.classList.add('close-modal');
      closeModal.textContent = '\u00D7';
      modal.appendChild(closeModal);
      closeModal.addEventListener('click', dismissModal);
      overlay.addEventListener('click', dismissModal);
    }

    for (i = 0; i < contents.length; i++) {
      modal.appendChild(contents[i]);
    }

    overlay.appendChild(modal);
    body.appendChild(overlay);

    win.setTimeout(function () {
      overlay.classList.add('visible');
    }, 50);
  }

  win.modals.dismissModal = dismissModal;
  win.modals.generateModal = generateModal;

}(document, window));
