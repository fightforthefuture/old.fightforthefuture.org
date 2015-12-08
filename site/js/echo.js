(function() {
    'use strict';

    // Display the container, since it's hidden for development.
    $('.echo-chamber-container').show();

    // Create templates.
    var templates = {};
    var types = ['link', 'photo', 'regular', 'quote', 'video'];
    _.each(types, function(type) {
        var html = $('#template-tumblr-' + type).html();
        templates[type] = _.template(html);
    });

    // Get Tumblr updates.
    $.getScript('//fftf-cache.herokuapp.com/tumblr');
    window.tumblrUpdateCallback = function(res) {
        // Create container.
        var $elements = $('<div>');

        // Create elements.
        _.each(res.posts, function(post) {
            // Skip unsupported types.
            if (!templates[post.type]) {
                return;
            }

            // Clean the date.
            post.date = post.date.match(/.*\d{4}/)[0];

            // Create HTML.
            var html = templates[post.type]({
                post: post
            });

            // Prevent HTTPS errors, somewhat harshly.
            html = html.replace(/src\s*=\s*"http:/gi, 'src="\/\/');

            // Append.
            var $html = $(html);
            $elements.append($html);
        });

        // Insert HTML.
        var blog = res.tumblelog.name;
        $('.tumblr.updates .stories').html($elements);
    };

})();