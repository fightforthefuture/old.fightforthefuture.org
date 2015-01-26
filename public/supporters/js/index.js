function EasyPeasyParallax() {
	scrollPos = $(this).scrollTop();
	$('.header').css({
		'background-position' : '50% ' + (-scrollPos/4)+"px"
	});
	$('.middle').css({
		'margin-top': (scrollPos/4)+"px",
		'opacity': 1-(scrollPos/500)
	});
}
$(document).ready(function(){
	$(window).scroll(function() {
		EasyPeasyParallax();
	});
});