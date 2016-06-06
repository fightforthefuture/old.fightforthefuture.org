(function (doc, win) {
  "use strict";

  win.callbacks = win.callbacks || {};
  win.callbacks.petitions = {
     preSubmit: function() {
      /**
       * Fires up the loading modal and disables the form
       * @return {object} - modal with spinner
       * */

      var
        loadingContainer = $c('div'),
        loadingCopy = $c('h2'),
        loadingSpinner = $c('div');

      loadingSpinner.classList.add('circle-spinner', 'large');
      loadingCopy.textContent = 'Hang on a tick, reticulating splines…';

      loadingContainer.classList.add('loading');
      loadingContainer.appendChild(loadingCopy);
      loadingContainer.appendChild(loadingSpinner);

      win.modals.generateModal({contents: loadingContainer, disableOverlayClick: true});

      doc.getElementById('petition-form').classList.add('submitted');
      doc.querySelector('[type="submit"]').setAttribute('disabled', true); // JL DEBUG ~ disable for testing
    },

    loadSignatureResponse: function(e) {
      /**
       * Does the thing after we get a response from the API server
       * */

      var xhr = e.target;

      if (xhr.status >= 200 && xhr.status < 400) {

        var
          shareContent = $c('div'),
          shareHeadline = $c('h3'),
          shareCopy = $c('p'),
          shareThis = $c('div'),
          donateCopy = $c('p');

        win.modals.dismissModal();

        shareHeadline.textContent = 'Thanks for signing';
        shareCopy.textContent = 'Now, share this page to spread the word.';

        shareThis.classList.add('share-this-button-links');
        shareThis.appendChild(doc.getElementsByClassName('share-this-fb')[0]);
        shareThis.appendChild(doc.getElementsByClassName('share-this-tw')[0]);

        donateCopy.innerHTML = '&hellip;or, <a href="https://donate.fightforthefuture.org/?amount=5&frequency=just-once">chip in $5</a> to help us spread the message.';

        shareContent.appendChild(shareHeadline);
        shareContent.appendChild(shareCopy);
        shareContent.appendChild(shareThis);
        shareContent.appendChild(donateCopy);

        win.modals.generateModal({contents: shareContent});

      } else {
        win.callbacks.petitions.handleSigningError(xhr);
      }
    },

    handleSigningError: function(e) {
      /**
       * Figures out what to say at just the right moment
       * @param {event|XMLHttpRequest} e - Might be an event, might be a response
       * from an XMLHttpRequest
       * */

      win.modals.dismissModal();

      var
        errorMessageContainer = $c('div'),
        errorMessage = $c('h2'),
        errorMessageInfo = $c('p');

      errorMessage.textContent = 'Something went wrong';
      if (e.type) {
        errorMessageInfo.textContent = 'There seems to be a problem somewhere in between your computer and our server. Might not be a bad idea to give it another try.';
      } else if (e.status) {
        errorMessageInfo.textContent = '(the nerdy info is that the server returned a status of "' + e.status + '" and said "' + e.statusText + '".)'
      } else {
        errorMessageInfo.textContent = 'this seems to be a weird error. the nerds have been alerted.';
      }

      errorMessageContainer.appendChild(errorMessage);
      errorMessageContainer.appendChild(errorMessageInfo);

      doc.getElementById('petition-form').classList.remove('submitted');
      doc.querySelector('[type="submit"]').removeAttribute('disabled');

      win.modals.generateModal({contents: errorMessageContainer});
    }
  }

})(document, window);
