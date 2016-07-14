window.components = window.components || {};
window.components.petitions = function (doc, win) {
  /**
   * Retrieves petition data from Action Network API, then submits signature
   * @param {object} doc - Document object
   * @param {object} win - Window object
   * */
  "use strict";

  var
    body = doc.getElementsByTagName('body')[0],
    petitionSignatureForm = doc.getElementById('petition-form'),
    apiHost = petitionSignatureForm.dataset.host,
    objectIdentifier = petitionSignatureForm.dataset.petitionId,
    submitButton = body.querySelector('[type="submit"]'),
    countryInput = doc.getElementById('hidden-country'),
    countrySelect = doc.getElementById('select-country'),
    countryLabel = doc.querySelector('[for="select-country"]'),
    queryString = win.util.parseQueryString();

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
      step = (guardedTargetVal / 1500) * 30; // 1500 ms total, 30ms minimum
                                             // interval

    if (!progressbar)
      return false;

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
    progressBar(1519, 2500);
  }

  function requestAPIInfo() {
    /**
     * Builds and sends request to API server
     * */
    var
      apiData,
      anRequest = new XMLHttpRequest();

    anRequest.open('GET', apiHost + '/petition?identifier=' + objectIdentifier, true);
    anRequest.addEventListener('load', function () {
      if (anRequest.status >= 200 && anRequest.status < 400) {

          apiData = JSON.parse(anRequest.responseText);

        progressBar(apiData.signatures, apiData.goal);
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

    win.callbacks.petitions.preSubmit();

    function compilePayload() {
      /**
       * Compiles the form data into a JSON payload for Ajax submission
       * @return {object} petitionFormData - just the info the API needs
       * */
      var tags = JSON.parse(doc.querySelector('[name="subscription[tag_list]"]').value);
      if (util.getReferrerTag())
        tags.push(util.getReferrerTag());

      var formData = new FormData();
      formData.append('guard', '');
      formData.append('hp_enabled', true);
      formData.append('org', 'fftf');
      formData.append('an_tags', JSON.stringify(tags));
      formData.append('an_url', win.location.href);
      formData.append('an_petition', petitionSignatureForm.action.replace('/signatures', ''));
      formData.append('member[first_name]', doc.getElementById('form-first_name').value);
      formData.append('member[email]', doc.getElementById('form-email').value);
      formData.append('member[postcode]', doc.getElementById('form-zip_code').value);
      formData.append('member[country]', countrySelect.value);

      if (doc.getElementById('opt-in') && doc.getElementById('opt-in').getAttribute('type') === 'checkbox' && doc.getElementById('opt-in').checked === false) {
        formData.append('opt_out', true);
      }

      if (doc.getElementById('form-street_address')) {
        formData.append('member[street_address]', doc.getElementById('form-street_address').value);
      }

      if (doc.getElementById('form-phone_number')) {
        formData.append('member[phone_number]', doc.getElementById('form-phone_number').value);
      }

      if (doc.getElementById('form-comments')) {
        formData.append('action_comment', doc.getElementById('form-comments').value);
      }

      if (queryString.source) {
        formData.append('subscription[source]', queryString.source);
      }

      var autoresponderHours = document.querySelector('meta[name="autoresponder_hours"]');
      formData.append('autoresponder_hours', autoresponderHours ? autoresponderHours.content : 72);

      var mothershipTag = document.querySelector('input[name="_mothership_tag"]');
      if (mothershipTag && mothershipTag.value)
        formData.append('tag', mothershipTag.value);
      else
        formData.append('tag', window.location.pathname);

      return formData;
    }

    signatureSubmission.open('POST', 'https://queue.fightforthefuture.org/action', true);
    // signatureSubmission.open('POST', 'http://localhost:9001/action', true); // JL DEBUG ~
    signatureSubmission.addEventListener('error', win.callbacks.petitions.handleSigningError);
    signatureSubmission.addEventListener('load',  win.callbacks.petitions.loadSignatureResponse);
    signatureSubmission.send(compilePayload());

    if (typeof FreeProgress !== "undefined")
      FreeProgress.convert();
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
