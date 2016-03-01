window.components = window.components || {};
window.components.petitions = function (doc, win) {
  /**
   * Retrieves petition data from Action Network API, then submits signature
   * @param {object} doc - Document object
   * @param {object} win - Window object
   * */
  "use strict";

  var
    loadingScreen,
    objectIdentifier = false,
    apiHost = doc.forms[0].dataset.host,
    body = doc.getElementsByTagName('body')[0],
    petitionSignatureForm = doc.forms[0],
    submitButton = body.querySelector('[type="submit"]'),
    countryInput = doc.getElementById('hidden-country'),
    countrySelect = doc.getElementById('select-country'),
    countryLabel = doc.querySelector('[for="select-country"]');

  function numberCommafier(number) {
    /**
     * Returns a string representing a number with commas
     * @param {int} number - the number to transform
     * */

    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function progressBar(targetValue, targetGoal) {
    /**
     * Animates the value of a progress bar
     * @param {int} targetValue - the target value attribute of the progress bar
     * @param {int} targetGoal - the target max attribute of the progress bar
     * */

    var
      guardedTargetVal = targetValue.isNaN ? 0 : targetValue,
      animate,
      value = 0,
      progressbar = doc.getElementById('signatures-progress-bar'),
      max = parseInt(targetGoal),
      step = (guardedTargetVal / 1500) * 30; // 1500 ms total, 30ms minimum interval

    function loading() {
      value += step;
      value = Math.ceil(value);
      if (value >= guardedTargetVal || value >= max) {
        value = guardedTargetVal;
        clearInterval(animate);
      }

      var
        commafiedNumber = numberCommafier(value);

      progressbar.setAttribute('max', max.toString(10));
      progressbar.setAttribute('value', value.toString(10));
      progressbar.setAttribute('title', commafiedNumber + ' signatures');
      doc.getElementById('total-sigs').textContent = commafiedNumber;
      doc.getElementById('sigs-to-go').textContent = numberCommafier(targetGoal - value) + ' needed to reach ' + numberCommafier(targetGoal);
      progressbar.textContent = commafiedNumber + ' signatures';
    }

    animate = setInterval(function () {
      loading();
    }, 30);
  }

  function handleProgressBarError() {
    /**
     * Sets values for the progress bar even if there's a server or XHR error
     * */
    progressBar(972, 1600);
  }

  function requestAPIInfo() {
    /**
     * Builds and sends request to API server
     * */
    var
      title = doc.getElementById('petition-title').textContent,
      anRequest = new XMLHttpRequest();

    anRequest.open('GET', apiHost + '/petition?title=' + title, true);
    anRequest.addEventListener('load', function () {
      if (anRequest.status >= 200 && anRequest.status < 400) {
        var
          apiData = JSON.parse(anRequest.responseText);

        objectIdentifier = apiData.objectID;
        progressBar(apiData.signatures, apiData.goal);
        petitionSignatureForm.setAttribute('action', apiData.action);
      } else {
        handleProgressBarError();
      }
    });
    anRequest.addEventListener('error', handleProgressBarError);
    anRequest.send();
  }

  function updateZIPPlaceholder() {
    /**
     * Updates placeholder on ZIP/Post Code field to be appropriate for country
     * selected
     * */
    var
      ZIPLabel = doc.getElementById('form-zip_code');

    if (countrySelect.value !== 'US') {
      ZIPLabel.setAttribute('placeholder', 'Post Code');
    } else {
      ZIPLabel.setAttribute('placeholder', 'ZIP');
    }
  }

  function toggleCountryField() {
    /**
     * Hides the label and shows the select when someone changes their signature
     * country.
     * */

    countryInput.parentNode.removeChild(countryInput);
    countrySelect.setAttribute('name', 'signature[country]');
    countrySelect.classList.add('visible');
    countryLabel.classList.add('hidden');
  }

  function handleSigningError(e) {
    /**
     * Figures out what to say at just the right moment
     * @param {event|XMLHttpRequest} e - Might be an event, might be a response
     * from an XMLHttpRequest
     * */

    loadingScreen.hide();

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
    new win.controllers.modals.PlainModalController({
      modal_content: errorMessageContainer
    });

    petitionSignatureForm.classList.remove('submitted');
    submitButton.removeAttribute('disabled');
  }

  function preSubmit() {
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
    petitionSignatureForm.classList.add('submitted');
    submitButton.setAttribute('disabled', true);

    return new win.controllers.modals.PlainModalController({
      modal_content: loadingContainer
    });
  }

  function submitForm(event) {
    /**
     * Submits the form to ActionNetwork. If the script doesn’t, by now, know
     * the action_network identifier, default isn’t prevented on the event and
     * form submission proceeds as normal.
     * @param {event} event - Form submission event
     * */

    if (objectIdentifier) {
      event.preventDefault();
    }

    var
      signatureSubmission = new XMLHttpRequest();

    loadingScreen = preSubmit();

    function compilePayload() {
      /**
       * Compiles the form data into a JSON payload for Ajax submission
       * @return {object} petitionFormData - just the info the API needs
       * */

      var
        petitionFormData = {
          identifier: objectIdentifier,
          website: win.location.origin,
          ZIP: doc.getElementById('form-zip_code').value,
          country: countrySelect.value,
          email: doc.getElementById('form-email').value,
          tags: JSON.parse(doc.querySelector('[name="subscription[tag_list]"]').value)
        };

      if (doc.getElementById('opt-in').checked === false &&
        doc.getElementById('opt-in').getAttribute('type') === 'checkbox') {
        petitionFormData.noOptIn = true;
      }

      if (doc.getElementById('form-street_address')) {
        petitionFormData.address = [doc.getElementById('form-street_address').value];
      }

      if (doc.getElementById('form-first_name')) {
        petitionFormData.name = doc.getElementById('form-first_name').value;
      }

      if (doc.getElementById('form-city')) {
        petitionFormData.city = doc.getElementById('form-city').value;
      }

      if (doc.getElementById('form-comments')) {
        petitionFormData.comments = doc.getElementById('form-comments').value;
      }

      return JSON.stringify(petitionFormData);
    }

    function loadSignatureResponse() {
      /**
       * Does the thing after we get a response from the API server
       * */

      if (signatureSubmission.status >= 200 && signatureSubmission.status < 400) {

        var
          shareOverlay = $c('div'),
          shareContent = $c('div'),
          shareThis = $c('div'),
          shareCopy = $c('p'),
          donateCopy = $c('p');

        loadingScreen.hide();

        shareCopy.textContent = 'Now, share this page to spread the word.';
        donateCopy.innerHTML = '<small>…or, <a href="https://donate.fightforthefuture.org/?amount=5&frequency=just-once">chip in $5</a> to help us spread the message.</small>';

        shareOverlay.classList.add('after-action-overlay');

        shareContent.setAttribute('id', 'after-action');
        shareContent.innerHTML = '<h1>Thanks for signing</h1>';
        shareContent.appendChild(shareThis);
        shareContent.appendChild(donateCopy);

        shareThis.classList.add('share-this-button-links');
        shareThis.appendChild(doc.getElementsByClassName('share-this-fb')[0]);
        shareThis.appendChild(doc.getElementsByClassName('share-this-tw')[0]);

        body.appendChild(shareOverlay);
        body.appendChild(shareContent);

      } else {
        handleSigningError(signatureSubmission);
      }
    }

    signatureSubmission.open('POST', petitionSignatureForm.dataset.host + '/signature', true);
    signatureSubmission.setRequestHeader('Content-Type', 'application/json');
    signatureSubmission.addEventListener('error', handleSigningError);
    signatureSubmission.addEventListener('load', loadSignatureResponse);
    signatureSubmission.send(compilePayload());
  }

  function addEventListeners() {
    /**
     * Attaches all the listeners all the places
     * */
    countryLabel.addEventListener('click', toggleCountryField);
    countrySelect.addEventListener('change', updateZIPPlaceholder);
    petitionSignatureForm.addEventListener('submit', submitForm);
  }

  function init() {
    requestAPIInfo();
    addEventListeners();
  }

  init();
};
