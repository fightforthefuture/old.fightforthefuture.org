/*
 * Modules
 */



function AdditionalSectionQueue() {
    this.queue = [];
}

AdditionalSectionQueue.prototype.push = function(name, callback) {
    this.queue.push([name, callback]);
};

AdditionalSectionQueue.prototype.next = function() {
    if (this.queue.length === 0) {
        return;
    }

    var item = this.queue.shift();
    var name = item[0];
    var callback = item[1];

    new AdditionalSection(name, callback || function() {
        this.next();
    }.bind(this));
};



function AdditionalSection(name, callback) {
    var container = document.getElementsByClassName('additional-sections')[0];
    var element = document.createElement('div');
    container.appendChild(element);

    var url = 'homepage/sections/' + name + '.html';

    url += '?buster=' + Date.now();

    new AJAX({
        url: url,
        success: function(e) {
            element.className = ' fadeIn ';
            element.innerHTML = e.target.responseText;

            if (callback) {
                callback(element);
            }
        }
    });

    return element;
}

function AJAX(params) {
    this.async = params.async || true;
    this.data = params.data;
    this.error = params.error;
    this.form = params.form;
    this.method = params.method || 'GET';
    this.success = params.success;
    this.url = params.url;

    this.request = new XMLHttpRequest();
    this.request.open(this.method, this.url, this.async);

    if (this.success) {
        this.request.onload = this.success;
    }

    if (this.error) {
        this.request.onerror = this.error;
    }

    if (this.data) {
        var params = '';
        for (var key in this.data) {
            if (params.length !== 0) {
                params += '&';
            }

            params += key + '=' + this.data[key];
        }

        this.request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        this.request.send(params);
    } else if (this.form) {
        var params = this.serializeForm(this.form);

        this.request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        this.request.send(params);
    } else {
        this.request.send();
    }

}

AJAX.prototype.serializeForm = function(form) {
    if (!form || form.nodeName !== "FORM") {
        return;
    }

    var i, j, q = [];
    for (i = form.elements.length - 1; i >= 0; i = i - 1) {
        if (form.elements[i].name === "") {
            continue;
        }
        switch (form.elements[i].nodeName) {
        case 'INPUT':
            switch (form.elements[i].type) {
            case 'email':
            case 'text':
            case 'hidden':
            case 'password':
            case 'button':
            case 'reset':
            case 'submit':
                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                break;
            case 'checkbox':
            case 'radio':
                if (form.elements[i].checked) {
                    q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                }
                break;
            case 'file':
                break;
            }
            break;
        case 'TEXTAREA':
            q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
            break;
        case 'SELECT':
            switch (form.elements[i].type) {
            case 'select-one':
                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                break;
            case 'select-multiple':
                for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
                    if (form.elements[i].options[j].selected) {
                        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].options[j].value));
                    }
                }
                break;
            }
            break;
        case 'BUTTON':
            switch (form.elements[i].type) {
            case 'reset':
            case 'submit':
            case 'button':
                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                break;
            }
            break;
        }
    }

    return q.join("&");
};



/*
 * Sections
 */



// Scroll events on desktop
(function() {
    if (navigator.userAgent.match(/mobile/i)) {
        return;
    } else {
        document.body.className += ' desktop ';
    }

    var headerElement = document.querySelector('header');
    var zoomElement = document.querySelector('.zoom-out-intro');

    var oldOpacity = 1;
    function onScroll() {
        var newOpacity = Math.max(1 - (window.pageYOffset / 320), 0);

        if (newOpacity === oldOpacity) {
            return;
        }

        var newScale = (5 / 6) + (newOpacity / 6);

        headerElement.style.opacity = newOpacity;
        zoomElement.style.opacity = newOpacity;
        zoomElement.style.transition = 'none';
        zoomElement.style.transform = 'scale(' + newScale + ')';
        zoomElement.style.webkitTransform = 'scale(' + newScale + ')';

        oldOpacity = newOpacity;
    }

    window.addEventListener('scroll', onScroll, false);
})();



// Preloading & fading in David background
(function() {
    var url = 'homepage/images/david-by-michelangelo.jpg';
    var image = new Image();
    image.src = url;
    image.onload = function() {
        document.querySelector('.david-by-michelangelo').className += ' loaded ';
    }
})();



// Form
(function() {
    var form = document.getElementById('form-signup');
    var action = form.getAttribute('action');
    var method = form.getAttribute('method');

    var emailInput = document.getElementById('input-email');
    var emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

    var uaInput = document.getElementById('input-ua');
    uaInput.value = navigator.userAgent;

    var button = form.querySelector('button');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        var email = emailInput.value;
        if (!email || !email.match(emailRegex)) {
            return alert('Please enter an email address.');
        }

        button.setAttribute('disabled', 'disabled');

        new AJAX({
            error: onFormSubmitError,
            form: form,
            method: method,
            success: onFormSubmitSuccess,
            url: action,
        });
    }, false);

    function onFormSubmitSuccess(e) {
        location.href = 'https://www.fightforthefuture.org/confirm/';
    }

    function onFormSubmitError(e) {
        alert('Sorry, we are experiencing technical issues. Please try again in five minutes.');
    }
})();



// Mobile navigation
(function() {
    var cheeseburger = document.querySelector('.cheeseburger');
    var lines = document.querySelector('.cheeseburger .lines');
    var navElement = document.querySelector('nav');
    var mobileNavElement = document.querySelector('.mobile-navigation');
    var mobileNavigationIsExpanded = false;

    cheeseburger.addEventListener('click', function(e) {
        if (mobileNavigationIsExpanded) {
            navElement.className = navElement.className.replace(' mobile-navigation-is-expanded ', '');
            mobileNavElement.className = mobileNavElement.className.replace(' mobile-navigation-is-expanded ', '');
        } else {
            navElement.className += ' mobile-navigation-is-expanded ';
            mobileNavElement.className += ' mobile-navigation-is-expanded ';
        }

        mobileNavigationIsExpanded = !mobileNavigationIsExpanded;
    }, false);
})();



// Additional Sections
(function() {
    var container = document.querySelector('.additional-sections');

    var queue = new AdditionalSectionQueue();

    queue.push('Feeds', function(el) {
        /////////////
        // Twitter //
        /////////////
        var twitterWrapper = document.querySelector('.twitter-timeline-wrapper');
        var script = document.createElement('script');
        script.id = 'twitter-wjs';
        script.src = 'https://platform.twitter.com/widgets.js';

        script.onload = function() {
            setTimeout(function() {
                twitterWrapper.style.opacity = 1;
            }, 1500); // This iframe takes a while to load...
        };

        script.onerror = function() {
            document.body.className += " adblock ";
            twitterWrapper.remove();
        };

        document.body.appendChild(script);

        ////////////
        // Tumblr //
        ////////////
        loadJS('https://fftf-cache.herokuapp.com/tumblr');

        // Create templates.
        var templates = {};
        var types = ['link', 'photo', 'regular', 'quote', 'video'];
        var type;
        for (var i = 0; i < types.length; i++) {
            type = types[i];
            var html = document.getElementById('template-tumblr-' + type).innerHTML;
            templates[type] = html;
        }

        window.tumblrUpdateCallback = function(res) {
            // Create container
            var container = document.createElement('div');
            container.className = 'posts';

            // Create elements
            var post;
            for (var i = 0, length = Math.min(res.posts.length, 50); i < length; i++) {
                post = res.posts[i]

                // Skip unsupported types.
                if (!templates[post.type]) {
                    return;
                }

                // Prettify dates
                post.date = post.date.match(/.*\d{4}/)[0];

                // Insert variables
                var html = templates[post.type];
                var regex, value;
                for (var key in post) {
                    value = post[key];
                    regex = new RegExp('{{' + key + '}}', 'g');
                    html = html.replace(regex, value);
                }

                // HTTP -> HTTPS
                html = html.replace(/src\s*=\s*"http:/gi, 'src="\/\/');

                // Append
                var element = document.createElement('div');
                element.innerHTML = html;
                container.appendChild(element);
            }

            var tumblrWrapper = document.querySelector('.tumblr-wrapper');
            tumblrWrapper.appendChild(container);
            tumblrWrapper.className += " filled ";

            queue.next();
        };
    });

    queue.next();
})();
