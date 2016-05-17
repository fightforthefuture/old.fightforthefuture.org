/**
 *
 * @source: https://github.com/fightforthefuture/fightforthefuture.github.io
 *
 * @licstart  The following is the entire license notice for the
 *  JavaScript code in this page.
 *
 * Copyright (C) Fight for the Future
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
 */

var notify = function(msg, radio, error) {
  document.getElementById('status').textContent = msg;
  document.getElementById('status').style.display = 'block';
  if (error)
    document.getElementById('status').className = 'error';
  document.getElementById(radio).checked = true;
}
if (window.location.href.indexOf('subscribed') !== -1)
  notify('Awesome! You\'re subscribed!', 'subscribed');
else if (window.location.href.indexOf('less-emails') !== -1)
  notify('Thank you! We\'ll send you less emails from now on.', 'less-emails');
else if (window.location.href.indexOf('unsubscribe') !== -1)
  notify('You have been unsubscribed. We\'re sorry to see you go!', 'unsubscribe');
else if (window.location.href.indexOf('error') !== -1)
  notify('An error has occurred while processing your request. Please contact team@fightforthefuture.org for assistance. Sorry about that!', 'subscribed', true);
