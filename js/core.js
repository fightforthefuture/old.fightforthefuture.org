(function (doc, win) {
  win.views = win.views || {};
  win.views.modals = {
    PlainModalView: function (innerHtml) {
      /**
       * Generates the markup for a good ol modal
       * @param {node} innerHtml - Html to render
       * */
      var
        modal = $c('div'),
        close = $c('button');

      close.classList.add('close');
      close.textContent = '\327';

      modal.classList.add('modal', '_plain_modal');
      modal.appendChild(close);
      modal.appendChild(innerHtml);

      return modal;
    },
    ShareDaisyModalView: function (innerHtml) {
      /**
       * Generates the markup for a good ol modal. Requires an element on-page
       * with id 'share-modal' which contains a data-share-url of `cgi_escape`d
       * page URL as well as a data-tweet with `cgi_escape`d tweet.
       * @param {node} innerHtml - Html to render _above_ share buttons.
       * */
      var
        shareContainer = doc.getElementById('share-modal'),
      // TODO the utm_campaign value throws an error on a non-campaign page probably
        shareLink = shareContainer.dataset.shareUrl + '&utm_source=petitions&utm_medium=web&utm_campaign=' + encodeURIComponent(doc.getElementById('petition-title').textContent),
        tweet = shareContainer.dataset.tweet,
        buttons = $c('div'),
        facebookAnchor = $c('a'),
        gPlusAnchor = $c('a'),
        tweetAnchor = $c('a');

      buttons.classList.add('modal-share-links');

      facebookAnchor.setAttribute('href', 'https://facebook.com/sharer.php?u=' + shareLink);
      facebookAnchor.classList.add('modal-share-link', 'share-this-fb');
      facebookAnchor.textContent = 'Share on Facebook';

      gPlusAnchor.setAttribute('href', 'https://plus.google.com/share?url=' + shareLink);
      gPlusAnchor.classList.add('modal-share-link', 'share-this-gp');
      gPlusAnchor.textContent = 'Share on Google Plus';

      tweetAnchor.setAttribute('href', 'https://twitter.com/share?text=' + tweet + '&url=' + shareLink);
      tweetAnchor.classList.add('modal-share-link', 'share-this-tw');
      tweetAnchor.textContent = 'Tweet this page';

      buttons.appendChild(facebookAnchor);
      buttons.appendChild(gPlusAnchor);
      buttons.appendChild(tweetAnchor);

      shareContainer.innerHTML = innerHtml;
      shareContainer.appendChild(buttons);

      return this.PlainModalView(shareContainer);
    }
  };

}(document, window));

;(function (doc, win) {
  win.controllers = win.controllers || {};
  win.controllers.modals = {
    PlainModalController: BaseModalController.extend({
      /**
       * This is for when we skip "Donate" in the daisy chain and go straight
       * to "Share".
       * @param {string} args.modal_content - Accepts content for the modal in
       * HTML form.
       * */
      modal_content: '<h2>Thanks!</h2>\n<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>',

      init: function () {
        this.render();
        this.show();
      },
      render: function() {
        var overlay = this.base_render();

        overlay.firstChild.appendChild(
          win.views.modals.PlainModalView(this.modal_content)
        );

        this.html(overlay);
      }
    }),
    ShareDaisyModalController: BaseModalController.extend({
      /**
       * This is for when we skip "Donate" in the daisy chain and go straight
       * to "Share".
       * @param {string} args.modal_content - Accepts content for the modal in
       * HTML form.
       * */
      modal_content: '<h2>Thanks!</h2>\n<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>',

      init: function () {
        this.render();
        this.show();
      },
      render: function() {
        var overlay = this.base_render();

        overlay.firstChild.appendChild(
          win.views.modals.ShareDaisyModalView(this.modal_content)
        );

        this.html(overlay);
      }
    })
  };
}(document, window));

;window.components = window.components || {};
window.components.homepage = function (doc, win) {
  var
    headerElement = doc.querySelector('header'),
    zoomElement = doc.querySelector('.zoom-out-intro'),
    oldOpacity = 1,
    cheeseburger = doc.querySelector('.cheeseburger'),
    mobileNavigationIsExpanded = false,
    navElement = doc.querySelector('nav.top'),
    mobileNavElement = doc.querySelector('.mobile-nav');

  function onScroll() {
    var newOpacity = Math.max(1 - (win.pageYOffset / 320), 0);

    if (newOpacity === oldOpacity) {
      return;
    }

    var newScale = (5 / 6) + (newOpacity / 6);

    headerElement.style.opacity = newOpacity;
    zoomElement.style.opacity = newOpacity;
    zoomElement.style.transition = 'none';
    zoomElement.style.transform = 'scale(' + newScale + ')';
    zoomElement.style.webkitTransform = 'scale(' + newScale + ')';

    oldOpacity = newOpacity;
  }

  function loadDavid() {
    // Preloading & fading in David background
    var
      imageUrl = '/img/page/homepage/david-by-michelangelo.jpg',
      image = new Image();

    image.src = imageUrl;
    image.onload = function () {
      doc.querySelector('.david-by-michelangelo').className += ' loaded ';
    }
  }

  function mobileNavigation() {
    // Mobile navigation

    if (mobileNavigationIsExpanded) {
      navElement.className = navElement.className.replace(' expanded ', '');
      mobileNavElement.className = mobileNavElement.className.replace(' expanded ', '');
    } else {
      navElement.className += ' expanded ';
      mobileNavElement.className += ' expanded ';
    }
    mobileNavigationIsExpanded = !mobileNavigationIsExpanded;
  }

  function hideMobileOnResize() {
    if (win.innerWidth >= 768) {
      navElement.className = navElement.className.replace(' expanded ', '');
      mobileNavElement.className = mobileNavElement.className.replace(' expanded ', '');
      mobileNavigationIsExpanded = !mobileNavigationIsExpanded;
    }
  }

  function makeProjectsClickable() {
    // make the projects section clickable
    var dls = doc.querySelectorAll('dl:not(.other)');

    for (var i = 0; i < dls.length; i++)
      dls[i].addEventListener('click', function (e) {
        e.preventDefault();
        win.open(this.querySelector('a').href);
      });
  }

  win.addEventListener('resize', hideMobileOnResize);
  win.addEventListener('scroll', onScroll, false);
  cheeseburger.addEventListener('click', mobileNavigation);

  loadDavid();
  makeProjectsClickable();
};

;window.components = window.components || {};
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

;(function (doc) {
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

;(function (doc, win) {
  "use strict";

  function hashChange() {
    // the hashChange thing only matters for "inner" pages. we shall nudge inline
    // links so the fixed header won't partially obscure them
    if (win.location.hash == '#signup')
      new OrgSignupController();
    else if (win.location.hash != '#' && win.location.hash != '')
      if (doc.getElementById(win.location.hash.substr(1)))
        setTimeout(function () {
          var doc = doc.docElement;
          var top = (win.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
          scrollTo(0, top - 75);
        }, 10);
  }

  function triggerComponents() {
    win.components = win.components || {};
    var
      i = 0,
      components = doc.getElementsByTagName('body')[0].dataset.components;

    if (components !== undefined) {
      components = components.split(' ');
      i = components.length;

      if (components.indexOf('homepage') >= 0) {
        win.onhashchange = hashChange;
        hashChange();
      }

      while (i--) {
        if (components[i] !== '' && win.components[components[i]] !== undefined) {
          win.components[components[i]](doc, win);
        }
      }
    }
  }

  triggerComponents();

  var signups = document.querySelectorAll('form.signup');

  for (var i = 0; i < signups.length; i++) {
    signups[i].addEventListener('submit', function (e) {
      e.preventDefault();

      var page_id = this.id || 'www-signup';
      var email = this.querySelector('input[name="email"]');

      if (!email.value) {
        email.className = 'error';
        alert('Please enter an email address :)');
        return email.focus();
      }

      new OrgReferralController({page_id: page_id}).submit({
        email: email.value
      });

      new ShareModalController({
        headline: 'Thanks for signing up!',
        text: 'We\'re looking forward to sharing our work with you. Together we will make sure the Internet always wins! Please continue exploring this site to learn more about Fight for the Future. You are a wonderful person <3'
      });
    });
  }

})(document, window);

//# sourceMappingURL=core.js.map