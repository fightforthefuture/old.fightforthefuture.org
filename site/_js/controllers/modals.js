(function (doc, win) {
  win.controllers = win.controllers || {};
  win.controllers.modals = {
    ShareDaisyModalController: BaseModalController.extend({
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
