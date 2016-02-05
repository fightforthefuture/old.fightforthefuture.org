(function (doc, win) {
  win.views = win.views || {};
  win.views.modals = {
    ShareDaisyModalView: function (innerHtml) {
      /**
       * Generates the markup for a good ol modal
       * */
      var
        modal = $c('div'),
        close = $c('button'),
        shareContainer = doc.getElementById('share-modal'),
        // TODO the utm_campaign value throws an error on a non-campaign page probably
        shareLink = shareContainer.dataset.shareUrl + 'utm_source=petitions&utm_medium=web&utm_campaign=' + encodeURIComponent(doc.getElementById('petition-title').textContent),
        tweet = shareContainer.dataset.tweet,
        facebookAnchor = $c('a'),
        gPlusAnchor = $c('a'),
        tweetAnchor = $c('a');

      facebookAnchor.setAttribute('href', 'https://facebook.com/sharer.php?u=' + shareLink);
      facebookAnchor.classList.add('share-this-fb');
      facebookAnchor.textContent = 'Share on Facebook';

      gPlusAnchor.setAttribute('href', 'https://plus.google.com/share?url=' + shareLink);
      gPlusAnchor.classList.add('share-this-gp');
      gPlusAnchor.textContent = 'Share on Google Plus';

      tweetAnchor.setAttribute('href', 'https://twitter.com/share?text=' + tweet + '&url=' + shareLink);
      tweetAnchor.classList.add('share-this-tw');
      tweetAnchor.textContent = 'Tweet this page';


      close.classList.add('close');
      close.textContent = '\327';

      shareContainer.innerHTML = innerHtml;
      shareContainer.appendChild(facebookAnchor);
      shareContainer.appendChild(gPlusAnchor);
      shareContainer.appendChild(tweetAnchor);

      modal.classList.add('modal', '_share_modal');
      modal.appendChild(close);
      modal.appendChild(shareContainer);

      return modal;
    }
  };

}(document, window));
