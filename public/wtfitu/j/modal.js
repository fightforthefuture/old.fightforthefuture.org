/* Copyright 2011 Fight for the Future. Licensed under the MIT license. http://www.opensource.org/licenses/mit-license.php Source available at http://americancensorship.org/modal/client.js */


var tweet_text = "Hey internet, just want to get the \"feel of the room.\" Think we should give the #ITU more control of the net? ";
var urlz = "http://www.fightforthefuture.org/wtfitu";
 var tweet_link = "http://twitter.com/share?&source=tweetbutton&original_referer=" + encodeURIComponent(urlz) + "&text=" + encodeURIComponent(tweet_text) + "&hashtags=WCIT";


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
      var css = 'p.historic {color: #000    ; /* text color */font-size: 18px;line-height: 1.3;padding-left: 20px;padding-right: 20px;margin-bottom: 10px;}#logoz {display: block;text-indent: -99999px;width: 303px;height: 40px;background: url(/wtfitu/i/logo.png) no-repeat;margin-top: 20px;margin-bottom: 5px;margin-left: 70px;}#signupmodal-overlay{ display:none;position:fixed;top:20px;left:20px;width:100%;height:100%;z-index:1001;}#signupmodal-lightbox{display:block;position:relative;width:342px;height:300px;padding:0;background-color:#000;z-index:1500;overflow:hidden;box-shadow:0px 0px 25px #171717; border-radius: 5px; overflow:hidden; float: left; margin-top: 95px; margin-left: 70px; display: block;width: 500px;height: 250px; -moz-border-radius: 5px; /* from vector shape */ -webkit-border-radius: 5px; /* from vector shape */ border-radius: 5px; /* from vector shape */ -moz-background-clip: padding; -webkit-background-clip: padding-box; background-clip: padding-box; /* prevents bg color from leaking outside the border */ background-color: #000; /* layer fill content */ -moz-box-shadow: 0 5px 16px rgba(0,0,0,.89); /* drop shadow */ -webkit-box-shadow: 0 5px 16px rgba(0,0,0,.89); /* drop shadow */ box-shadow: 0 5px 16px rgba(0,0,0,.89); /* drop shadow */ /* inner stroke */ border-radius: 5px;border:0;padding:0;overflow:hidden;}#signupmodal-close{color:#000;font-family:"Helvetica","Arial",sans-serif;float:right;vertical-align:10px;position:absolute;margin-left:475px;margin-top: 5px;}#signupmodal-container{position:fixed;top:0;left:0;width:100%;height:100%;}#signupmodal-close-option{background: url(http://fightforthefuture.org/images/history/dismiss.png) right no-repeat; padding-right: 15px; text-decoration: none;font-family:"Helvetica","Arial",sans-serif;float:right;vertical-align:10px;color:#000;position:absolute;margin-left:170px;margin-top: 205px;}#signupmodal-lightbox {padding: 0;font-family: helvetica; /*background: black;*/background: rgba(255,255,255,0.92);}#signupmodal-lightbox button {float: left;margin-left: 10px;border: 0;color: #000; /* text color */text-shadow: 0 1px 0 #05300d; /* drop shadow */font-size: 18px;font-weight: bold;width: 94px;height: 38px;-moz-border-radius: 3px; /* from vector shape */-webkit-border-radius: 3px; /* from vector shape */ border-radius: 3px; /* from vector shape */ -moz-background-clip: padding;-webkit-background-clip: padding-box;background-clip: padding-box; /* prevents bg color from leaking outside the border */background-color: #000; /* layer fill content */-moz-box-shadow: 0 2px 1px rgba(0,0,0,.4); /* drop shadow */-webkit-box-shadow: 0 2px 1px rgba(0,0,0,.4); /* drop shadow */box-shadow: 0 2px 1px rgba(0,0,0,.4); /* drop shadow */ background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDEgMSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PGxpbmVhckdyYWRpZW50IGlkPSJoYXQwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjUwJSIgeTE9IjEwMCUiIHgyPSI1MCUiIHkyPSIwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwZDcyMjIiIHN0b3Atb3BhY2l0eT0iMSIvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxZjkyMjQiIHN0b3Atb3BhY2l0eT0iMSIvPgogICA8L2xpbmVhckdyYWRpZW50PgoKPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0idXJsKCNoYXQwKSIgLz4KPC9zdmc+); /* gradient fill */ background-image: -moz-linear-gradient(90deg, #0d7222 0%, #1f9224 100%); /* gradient fill */background-image: -o-linear-gradient(90deg, #0d7222 0%, #1f9224 100%); /* gradient fill */ background-image: -webkit-linear-gradient(90deg, #0d7222 0%, #1f9224 100%); /* gradient fill */ background-image: linear-gradient(90deg, #0d7222 0%, #1f9224 100%); /* gradient fill */} #signupmodal-lightbox input {margin-left: 20px;float: left;border: 0;text-indent: 5px;width: 196px;height: 38px;font-size: 18px;-moz-border-radius: 3px; /* from vector shape */ -webkit-border-radius: 3px; /* from vector shape */border-radius: 3px; /* from vector shape */-moz-background-clip: padding; -webkit-background-clip: padding-box;background-clip: padding-box; /* prevents bg color from leaking outside the border */background-color: #f0f0f0; /* layer fill content + solid fill */-moz-box-shadow: inset 0 1px 3px rgba(0,0,0,.5); /* inner shadow */-webkit-box-shadow: inset 0 1px 3px rgba(0,0,0,.5); /* inner shadow */box-shadow: inset 0 1px 3px rgba(0,0,0,.5); /* inner shadow */}#signupmodal-lightbox form {margin-bottom: 25px; overflow: auto;}  #signupmodal-lightbox a {color: #000;}body #signupmodal-lightbox .circle a {text-decoration: none;border-radius: 50%;text-align: center; font-size: 14px;font-weight: bold; float: right; margin-right: 20px;width: 20px;height: 20px; color: black; background: #999;padding-top: 2px; color: #fff;}#signupmodal-lightbox a.btn:hover {background: #007542;}#signupmodal-lightbox a.btn{cursor: pointer; display: inline-block; padding-left: 5px; padding-right: 5px; -moz-border-radius: 3px;-webkit-border-radius: 3px;border-radius: 3px;float: left; background: #14a767; -webkit-transition: background 0.5s ease; -moz-transition: background 0.5s ease;  	-o-transition: background 0.5s ease; 	transition: background 0.5s ease;text-shadow: 2px 2px 2px rgba(0,0,0,.35);   	color: #fff;   	font-size: 15px; text-align: center;   	padding-top:13px; text-decoration: none; font-weight: bold; margin-right: 10px; width: 190px; height: 30px;} .linkage {padding-top: 20px; margin-left: 40px;color: white;}p.sidenote {display: block; clear: both; text-align: center; font-size: 13px; padding-top: 15px;}';
      var style = document.createElement('style');
      style.type = "text/css";
      style.innerHTML = css;
      document.body.appendChild(style);

      // Inject HTML
      var html = '<a id="signupmodal-overlay" href="javascript:void(0)" onclick="javascript:document.getElementById(\'signupmodal-overlay\').style.display=\'none\';document.getElementById(\'signupmodal-lightbox\').style.display=\'none\';"></a>'

				+ '<div id="signupmodal-container">'
				+ '<div id="signupmodal-lightbox">'
                // + '<a id="signupmodal-close-option" href="javascript:void(0)" onclick="javascript:document.getElementById(\'signupmodal-overlay\').style.display=\'none\';document.getElementById(\'signupmodal-container\').style.display=\'none\';"document.getElementById(\'signupmodal-lightbox\').style.display=\'none\';">'
                // + 'Don&rsquo;t show this again'
                // + '</a>'
				+ '<p class="historic"><strong>This is just an informal poll.</strong> Who here thinks that this 147-year-old UN agency built for regulating <a href=\"http://whatistheitu.org\" target=\"_new\">telegraphs</a>, run by a majority of countries that <a href=\"http://en.rsf.org/IMG/jpg/carte2012-2.jpg\" target=\"_new\">censor the press</a>, meeting in a country that <a href=\"http://www.equaltimes.org/news/teen-blogger-jailed-in-uae\" target=\"_new\">jails bloggers</a>, should be making decisions about the global Internet?'

                // + '<form action="http://nt.salsalabs.com/save">'
                // + '<input type="hidden" name="email_trigger_KEYS" value="7" />'
                // + '<input type="hidden" name="organization_KEY" value="-501"/>'
                // + '<input type="hidden" name="object" value="supporter"/>'
                // + '<input type="hidden" name="ip" id="signup_ip" />'
                // + '<input type="hidden" name="user_agent" id="user_agent" />'
                // + '<input type="hidden" name="redirect" value="http://fightforthefuture.org/confirm">'
                // + '<input type="hidden" name="Receive_Email" value="10">'
                // + '<input id="id_email" type="email" name="Email" placeholder="Your Email" />'
                // + '<button type="submit">SIGN UP</button>'
                // + '</form>'
                + '<div class=\"linkage\">'
                + '<a href=\"' + tweet_link + '\" class=\"btn\">Great idea!</a>'
                + '<a href=\"' + tweet_link + '\" class=\"btn\">TERRIBLE IDEA</a>'

                + '</div>'
                + '<p class=\"sidenote\">(We&apos;re just trying to get the feel of the room)</p>'
               + '</div>'
               + '</div>';

      var injector = document.createElement('div');
      injector.innerHTML = html;
      document.body.appendChild(injector);
  } else {
      document.getElementById('signupmodal-overlay').style.display='block';
      document.getElementById('signupmodal-lightbox').style.display='block';
  }
}

displayAmericanCensorshipModal();

// if (getCookie('americancensorship')) {
//     ;
// } else {
//     setTimeout("displayAmericanCensorshipModal()", 10);
//     setCookie('americancensorship', 'beenthere', 1);
// }
