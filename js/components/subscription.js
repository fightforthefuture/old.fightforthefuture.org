window.components = window.components || {};
window.components.subscription = function (doc, win) {
  var formElement = doc.getElementById('js-subscription-form'),
      formNoticeElement = doc.getElementById('js-form-notice');

  function listOptionsSelected(inputName) {
    var optionsList = formElement.querySelectorAll("input[name='"+inputName+"']"),
        options = [];

    for (var i = 0, length = optionsList.length; i < length; i++) {
      if (optionsList[i].checked) {
        options.push(optionsList[i].value);
      }
    }
    return options;
  }

  function submitForm(ev) {
    ev.preventDefault();

    var email = formElement.querySelector('#email').value,
        status = listOptionsSelected('subscription')[0],
        tags = listOptionsSelected('subscription-selections').join(','),
        xhr = new XMLHttpRequest();

    // Reset form notice
    formNoticeElement.innerText = '';
    formNoticeElement.className = '';

    // Send form to API endpoint
    xhr.open("post", formElement.action);
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status == 200) {
        formNoticeElement.innerText = 'Your email preferences have been updated.';
        formNoticeElement.classList.add('text-success', 'text-notice');
      } else {
        formNoticeElement.innerText = 'Sorry, something went wrong.';
        formNoticeElement.classList.add('text-error', 'text-notice');
      }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      email: email,
      tags: tags,
      status: status
    }));
  }

  var init = function() {
    formElement.addEventListener('submit', submitForm);
  }

  init();
};
