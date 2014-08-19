/* Copyright 2011 Fight for the Future. Licensed under the MIT license. http://www.opensource.org/licenses/mit-license.php Source available at http://americancensorship.org/modal/client.js */



function setCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function deleteCookie(name) {
    setCookie(name,"",-1);
}

if (typeof global_displayAmericanCensorshipModal == 'undefined') {
    var global_displayAmericanCensorshipModal = 0;
}

displayAmericanCensorshipModal = function() {
  // Inject CSS
  if (!global_displayAmericanCensorshipModal) {
      global_displayAmericanCensorshipModal = 1;
      var css = '#signupmodal-overlay{display:block;position:absolute;top:0;left:0;width:100%;height:100%;background-color:#444;z-index:1001;-moz-opacity:.8;opacity:.8;filter:alpha(opacity=80);}#signupmodal-lightbox{display:block;position:absolute;left:15%;top:15%;width:862px;height:347px;padding:0;margin:0;background-color:#fff;z-index:1500;overflow:hidden;box-shadow:0px 0px 25px #171717;-webkit-border-radius: 3px;-moz-border-radius: 3px;border-radius: 3px;overflow:hidden;}#signupmodal-lightbox iframe{border:0;width:862px;height:527px;overflow:hidden;}#signupmodal-close{color:white;font-family:"Helvetica","Arial",sans-serif;float:right;vertical-align:10px;z-index:100;position:absolute;margin-left:800px;vertical-align:50px;}';
      var style = document.createElement('style');
      style.type = "text/css";
      style.innerHTML = css;
      document.body.appendChild(style);

      // Inject HTML
      var html = '<a id="signupmodal-overlay" href="javascript:void(0)" onclick="javascript:document.getElementById(\'signupmodal-overlay\').style.display=\'none\';document.getElementById(\'signupmodal-lightbox\').style.display=\'none\';"></a>'
               + '<div id="signupmodal-lightbox">'
               + '<a id="signupmodal-close" href="javascript:void(0)" onclick="javascript:document.getElementById(\'signupmodal-overlay\').style.display=\'none\';document.getElementById(\'signupmodal-lightbox\').style.display=\'none\';">'
               + '<img src="http://americancensorship.org/modal/images/close.png" title="Close"/>'
               + '</a>'
               + '<iframe src="http://killacta.org/embed.html"></iframe>'
               + '</div>';

      var injector = document.createElement('div');
      injector.innerHTML = html;
      document.body.appendChild(injector);
  } else {
      document.getElementById('signupmodal-overlay').style.display='block';
      document.getElementById('signupmodal-lightbox').style.display='block';
  }
}

if (getCookie('acta-letterz')) {
    ;
} else {
    setTimeout("displayAmericanCensorshipModal()", 10);
    setCookie('acta-letterz', 'beenthere', 1);
}
