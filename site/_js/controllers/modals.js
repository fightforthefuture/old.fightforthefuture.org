(function (doc, win) {
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
