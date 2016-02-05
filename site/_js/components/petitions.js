window.components = window.components || {};
window.components.petitions = function (doc, win) {
  "use strict";

  var
    loadingModal,
    apiHost = doc.forms[0].dataset.host,
    body = doc.getElementsByTagName('body')[0],
    objectIdentifier = false,
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

      progressbar.setAttribute('max', max);
      progressbar.setAttribute('value', value);
      progressbar.setAttribute('title', commafiedNumber + ' signatures');
      doc.getElementById('total-sigs').innerText = commafiedNumber;
      doc.getElementById('sigs-to-go').innerText = numberCommafier(targetGoal - value) + ' needed to reach ' + numberCommafier(targetGoal);
      progressbar.innerHTML = commafiedNumber + ' signatures';
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

  function readMoreButtons() {
    /**
     * Makes content visible!
     * */
    var
      buttons = doc.getElementsByClassName('expand-text'),
      text = doc.getElementsByClassName('expanded-text'),
      i = buttons.length;

    function expandText(e) {
      /**
       * Changes max-height on a given post.
       * @param {event} e - Event passed from listener
       * */
      var
        targetOrder = e.target.dataset.order;

      text[targetOrder].style.maxHeight = 10000 + 'px';
      buttons[targetOrder].setAttribute('class', 'hidden');
    }

    while (i--) {
      buttons[i].dataset.order = i;
      text[i].dataset.order = i;
      buttons[i].addEventListener('click', expandText);
    }
  }

  function requestAPIInfo() {
    /**
     * Builds and sends request to API server
     * */
    var
      title = doc.getElementById('petition-title').innerText,
      anRequest = new XMLHttpRequest();

    anRequest.open('GET', apiHost + '/petition?title=' + title, true);
    anRequest.addEventListener('load', function () {
      if (anRequest.status >= 200 && anRequest.status < 400) {
        var
          apiData = JSON.parse(anRequest.responseText);

        objectIdentifier = apiData.objectID;
        progressBar(apiData.signatures, apiData.goal);
        doc.forms[0].setAttribute('action', apiData.action);
      } else {
        handleProgressBarError();
      }
    });
    anRequest.addEventListener('error', handleProgressBarError);
    anRequest.send();
  }

  function updateZIPPlaceholder(event) {
    /**
     * Updates placeholder on ZIP/Post Code field to be appropriate for country
     * selected
     * @param {event} e - Doesn't do anything atm.
     * */
    var
      ZIPLabel = doc.getElementById('form-zip_code');

    if (countrySelect.value !== 'US') {
      ZIPLabel.setAttribute('placeholder', 'Post Code');
    } else {
      ZIPLabel.setAttribute('placeholder', 'ZIP');
    }
  }

  function toggleCountryField(event) {
    /**
     * Hides the label and shows the select when someone changes their signature
     * country.
     * @param {event} e - Doesn't do anything atm.
     * */

    if (countryInput.getAttribute('name')) {
      countryInput.removeAttribute('name');
      countrySelect.setAttribute('name', 'signature[country]');
      countrySelect.classList.add('hidden');
      countryLabel.classList.remove('hidden');
    } else {
      countrySelect.removeAttribute('name');
      countryInput.setAttribute('name', 'signature[country]');
      countrySelect.classList.remove('hidden');
      countryLabel.classList.add('hidden');
    }
  }

  function handleSigningError(e) {
    /**
     * Figures out what to say at just the right moment
     * @param {event|XMLHttpRequest} e - Might be an event, might be a response
     * from an XMLHttpRequest
     * */

    loadingModal.hide();

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
      loadingContainer = $c('div'),
      loadingCopy = $c('h2'),
      loadingSpinner = $c('div'),
      signatureSubmission = new XMLHttpRequest(),
      petitionSignaturePayload = {
        identifier: objectIdentifier.split(':')[1],
        referrer: win.location.toString(),
        website: win.location.origin,
        ZIP: doc.getElementById('form-zip_code').value,
        country: doc.getElementById('select-country').value,
        email: doc.getElementById('form-email').value,
        tags: JSON.parse(doc.querySelector('[name="subscription[tag_list]"]').value)
      };

    loadingSpinner.classList.add('circle-spinner', 'large');
    loadingCopy.textContent = 'Hang on a tick, reticulating splines…';

    loadingContainer.classList.add('loading');
    loadingContainer.appendChild(loadingCopy);
    loadingContainer.appendChild(loadingSpinner);

    if (doc.getElementById('opt-in').checked === false &&
      doc.getElementById('opt-in').getAttribute('type') === 'checkbox') {
      petitionSignaturePayload.noOptIn = true;
    }

    if (doc.getElementById('form-street_address')) {
      petitionSignaturePayload.address = [doc.getElementById('form-street_address').value];
    }

    if (doc.getElementById('form-first_name')) {
      petitionSignaturePayload.name = doc.getElementById('form-first_name').value;
    }

    if (doc.getElementById('form-city')) {
      petitionSignaturePayload.city = doc.getElementById('form-city').value;
    }

    if (doc.getElementById('form-comments')) {
      petitionSignaturePayload.comments = doc.getElementById('form-comments').value;
    }

    signatureSubmission.open('POST', doc.forms[0].dataset.host + '/signature', true);

    loadingModal = new win.controllers.modals.PlainModalController({
      modal_content: loadingContainer
    });

    signatureSubmission.setRequestHeader('Content-Type', 'application/json');
    signatureSubmission.addEventListener('error', handleSigningError);
    signatureSubmission.addEventListener('load', function (e) {
      if (signatureSubmission.status >= 200 && signatureSubmission.status < 400) {

        var
          modalContent = $c('div');

        modalContent.innerHTML = '<h2>Thanks for signing</h2>\n<p>Now, share this page to spread the word.</p>\n<p><small>…or, <a href="https://donate.fightforthefuture.org/?amount=5&frequency=just-once">chip in $5</a> to help us spread the message.</small></p>';
        modalContent.appendChild(doc.getElementById('share-modal'));

        loadingModal.hide();
        new win.controllers.modals.PlainModalController({
          modal_content: modalContent
        });

      } else {
        handleSigningError(signatureSubmission);
      }
    });
    signatureSubmission.send(JSON.stringify(petitionSignaturePayload));
  }

  function addEventListeners() {
    /**
     * Attaches all the listeners all the places
     * */
    countryLabel.addEventListener('click', toggleCountryField);
    countrySelect.addEventListener('change', updateZIPPlaceholder);
    doc.forms[0].addEventListener('submit', submitForm);
  }

  function init() {
    requestAPIInfo();
    readMoreButtons();
    addEventListeners();
  }

  init();
};
