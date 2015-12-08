$(function() {
    'strict';

    // Placeholders.
    $('input').placeholder();

    // User agent.
    $("#user_agent").val(navigator.userAgent);

    // AJAX submission.
    $('.signup form').on('submit', function(e) {
        // Shortcut.
        var $form = $(this),
            $email = $('#id_email');

        // Require email.
        if (!$email.val()) {
            return;
        }

        // IE8 & 9.
        if (!$.support.cors) {
            var $input = $('<input type="hidden" name="redirect" />');
            $input.val('https://www.fightforthefuture.org/confirm');
            return $form.append($input);
        }

        // Send POST request.
        $.ajax({
            data: $form.serialize(),
            success: onSuccess,
            type: 'POST',
            url: $form.attr('action')
        });

        // Redirect.

        function onSuccess() {
            location.href = '/confirm';
        }

        e.preventDefault();
    });

    // Check for Twitter feed.
    setTimeout(function() {
        var $feed = $('section.latest-work iframe');
        if ($feed.length === 0) {
            $('section.latest-work').remove();
            $('section.updates').width('100%');
            $('#tumblricon').css('margin-left', 0);
        }
    }, 3000);
});

// Get IP.

function getip(json) {
    $("#ip_address").val(json.ip);
}
$.getScript('//fftf-ips.heroku.com/?callback=getip');