$(function() {
    var $form = $('#donate');

    // Placeholder for IE8.
    $form.find('input').placeholder();

    $form.on('submit', function(e) {
        // Values.
        var amount = $form.find('input.amount').val(),
            email = $form.find('input.email').val(),
            name = $form.find('input.name').val();

        // Require.
        if (!amount || !email || !name) {
            return e.preventDefault();
        }

        // IE8 & 9.
        if (!$.support.cors) {
            var $input = $('<input type="hidden" name="redirect" />');
            $input.val('https://donate.fightforthefuture.org/?amount=' + amount);
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
            location.href = 'https://donate.fightforthefuture.org/?amount=' + amount;
        }

        e.preventDefault();
    });

    // Scroll.
    var onScrollTimeout;
    $(window).on('scroll', function() {
        clearTimeout(onScrollTimeout);
        onScrollTimeout = setTimeout(function() {
            var scrolledPast230 = $(window).scrollTop() > 230;
            $('body').toggleClass('scrolled-past-230', scrolledPast230);
        }, 20);
    });

    // Navigation.
    var $navigationButtons = $('nav a'),
        currentYear = 2013;
    $navigationButtons.on('click', function(e) {
        var year = $(this).data('year');
        displayYearWithAnimation(year);
        currentYear = year;

        $navigationButtons.removeClass('selected');
        $(this).addClass('selected');

        e.preventDefault();
    });
    function displayYearWithAnimation(year) {
        // Bail if animation would be redundant.
        if(currentYear === year) {
            return;
        }

        var $allYears = $('.wrap.year');

        $allYears.stop(true).animate({
            opacity: 0
        }, 'fast', function() {
            $allYears.css({
                display: 'none'
            });

            $('#year-of-' + year).css({
                display: 'block',
                opacity: 0
            }).animate({
                opacity: 1
            });
        });
    }
});