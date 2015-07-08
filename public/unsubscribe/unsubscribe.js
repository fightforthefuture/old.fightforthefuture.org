$(function() {
	'strict';

	// Placeholders.
	$('input').placeholder();



	// Display form.
	$('.signup .form').show().css({ opacity: 0 }).animate({
		opacity: 1
	}, 300);

	// Focus.
	$('#email').focus();

});
