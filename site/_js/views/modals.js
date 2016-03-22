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
