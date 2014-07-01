$(function() {
	'strict';

	// Placeholders.
	$('input').placeholder();

	// Animate "Goodbye" message.
	function onSuccess(res) {
		window.scrollTo(0, 0);

		var $signup = $('.signup');
		$signup.animate({
			opacity: 0
		}, 300, function() {
			$signup.children().hide();
			$signup.find('.goodbye').show();
			$signup.animate({
				opacity: 1
			}, 300);
		});
	}

	// Animate "Error" message.
	function onError(res) {
		window.scrollTo(0, 0);

		var $signup = $('.signup');
		$signup.animate({
			opacity: 0
		}, 300, function() {
			$signup.children().hide();
			$signup.find('.purpose-error').show();
			$signup.animate({
				opacity: 1
			}, 300);
		});
	}

	// Form AJAX submission.
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
		    $input.val('https://www.fightforthefuture.org');
		    return $form.append($input);
		}

		// Send POST request.
		$.ajax({
			data: $form.serialize(),
			error: onError,
			success: onSuccess,
			type: 'POST',
			url: $form.attr('action')
		});

		e.preventDefault();
	});

	// Trigger automatic AJAX submission, if `t` variable is present.
	var t = location.href.match(/t=([a-zA-Z0-9+\/]+={0,2})/);
	if (t) {
		// Send request.
		var $form = $('.signup form'),
			target = $form.attr('action');

		// IE8 & 9.
		if (!$.support.cors) {
		    var $input = $('<input type="hidden" name="redirect" />');
		    $input.val('https://www.fightforthefuture.org');
		    $form.append($input);

		    $input = $('<input type="hidden" name="t" />');
		    $input.val(t[1]);
		    $form.append($input);

		    return $form.submit();
		}

		$.ajax({
			data: {t: t[1]},
			error: onError,
			success: onSuccess,
			type: 'POST',
			url: target
		});

		// Display loading text.
		$('.signup .loading').show().css({ opacity: 0 }).animate({
			opacity: 1
		}, 300);
	} else {
		// Display form.
		$('.signup .form').show().css({ opacity: 0 }).animate({
			opacity: 1
		}, 300);

		// Focus.
		$('#id_email').focus();
	}
});
