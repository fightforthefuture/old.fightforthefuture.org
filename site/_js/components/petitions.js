window.components = window.components || {};
window.components.petitions = function (doc, win) {
  "use strict";

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

  var
    title = doc.getElementById('petition-title').innerText,
    anRequest = new XMLHttpRequest();

  function handleError() {
    /**
     * Sets values for the progress bar even if there's a server or XHR error
     * */
    progressBar(972, 1600);
  }

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
};
