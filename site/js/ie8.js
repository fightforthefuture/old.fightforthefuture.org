(function() {
    // HTML5 elements.
    var elements = [
        'article',
        'aside',
        'clear',
        'footer',
        'header',
        'main',
        'menu',
        'section'
    ];

    // Initialize elements.
    for (var i in elements) {
        document.createElement(elements[i]);
    }

    // Create CSS.
    var css = '';
    for (var i in elements) {
        css += elements[i] + ' { display: block; }\n';
    }

    // Create new element, `clear`.
    css += 'clear { clear: both; }';
    
    // Inject.
    var head = document.getElementsByTagName('head')[0],
        style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = css
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
})();
