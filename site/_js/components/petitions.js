window.components = window.components || {};
window.components.petitions = function (doc, win) {
  "use strict";

  var
    body = doc.getElementsByTagName('body')[0],
    countrySelect = doc.getElementById('country'),
    countryLabel = doc.querySelector('[for="country"]');

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

  function handleError() {
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

    anRequest.open('GET', doc.forms[0].dataset.host + '/petition?title=' + title, true);
    anRequest.addEventListener('load', function () {
      if (anRequest.status >= 200 && anRequest.status < 400) {
        var
          apiData = JSON.parse(anRequest.responseText);

        progressBar(apiData.signatures, apiData.goal);
        doc.forms[0].setAttribute('action', apiData.action);
      } else {
        handleError();
      }
    });
    anRequest.addEventListener('error', handleError);
    anRequest.send();
  }

  function updateZIPPlaceholder(e) {
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

  function toggleCountryField(e) {
    /**
     * Hides the label and shows the select when someone changes their signature
     * country.
     * @param {event} e - Doesn't do anything atm.
     * */

    countryLabel.classList.toggle('hidden');
    countrySelect.classList.toggle('visible');
  }

  function addEventListeners() {
    /**
     * Attaches all the listeners all the places
     * */
    countryLabel.addEventListener('click', toggleCountryField);
    countrySelect.addEventListener('change', updateZIPPlaceholder);
  }

  function init() {
    requestAPIInfo();
    readMoreButtons();
    addEventListeners();
  }

  init();
};
