function open_staff(){
	$('.data').slideToggle();
	$('li.staff').toggleClass("active");
}

$(".staff").click(function (event) {
	event.preventDefault();
	open_staff();
	// For browsers that will take it, give them the URL
	history.pushState(null, null, '#staff');
});

if(window.location.hash == "#staff") {
open_staff();
} 



$("form.donateask button").click(function(event) {
	event.preventDefault();

	var amount = $("form.donateask input").val() || 40,
		url = 'https://donate.fightforthefuture.org/?amount=' + amount;

	window.location = url;
});

$("form.donateask input").keyup(function(event){
if(event.keyCode == 13){
$("form.donateask button").click();
}
});
