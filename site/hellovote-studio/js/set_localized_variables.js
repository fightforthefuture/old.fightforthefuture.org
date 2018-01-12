/**
 *
 * @source: https://github.com/fightforthefuture/eunetneutrality
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

var language  = (window.navigator.userLanguage || window.navigator.language).toLowerCase(),
    iso       = language.substr(0, 2);

window.l10n || (window.l10n = {});

var fullPageTranslations = [
  
];

var overrideLocaleIndex = fullPageTranslations.indexOf(window.location.pathname.replace(/\//g, ''));
if (overrideLocaleIndex !== -1)
    iso = fullPageTranslations[overrideLocaleIndex];

switch (iso) {
  
    case 'en':
    default:
      window.l10n['CODE'] = 'en';
      window.l10n['LANG'] = 'English';
      window.l10n['ENTER_PHONE'] = 'Enter phone number';
      window.l10n['TEXT_ME'] = 'Text me';
      window.l10n['DISCLOSURE'] = '<a target="_blank" href="https://www.fightforthefuture.org/">Fight for the Future</a> & its <a target="_blank" href="https://fftfef.org/">Education Fund</a> will contact you.';
      window.l10n['DISCLOSURE_PARTNER'] = '<a target="_blank" href="https://www.fightforthefuture.org/">Fight for the Future</a>, its <a target="_blank" href="https://fftfef.org/">Education Fund</a> and <a class=partner>PARTNER</a> will contact you.';
      window.l10n['LEARN_MORE'] = 'Learn more';
      window.l10n['SHARE'] = 'Share';
      window.l10n['TWEET'] = 'Tweet';
      window.l10n['DONATE'] = 'Donate';
      window.l10n['POWERED_BY'] = 'powered by';
      break;
  
    case 'es':
      window.l10n['CODE'] = 'es';
      window.l10n['LANG'] = 'Spanish';
      window.l10n['PAGE_TRANSLATION'] = 'false';
      window.l10n['ENTER_PHONE'] = 'Entre su numero móvil';
      window.l10n['TEXT_ME'] = 'Iniciar';
      window.l10n['DISCLOSURE'] = '<a target="_blank" href="https://www.fightforthefuture.org/">Fight for the Future</a> y su <a target="_blank" href="https://fftfef.org/">Fondo de Educación</a> le enviará mensajes.';
      window.l10n['DISCLOSURE_LINK'] = 'Leer mas';
      window.l10n['SHARE'] = 'Compartir';
      window.l10n['TWEET'] = 'Tweet';
      window.l10n['DONATE'] = 'Donar';
      window.l10n['POWERED_BY'] = 'impulsado por';
      break;
      
}
