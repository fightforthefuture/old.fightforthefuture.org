var queryString = util.parseQueryString();

console.log('queryString: ', queryString);

var url = 'https://www.hello.vote/iframe/';
var iframeUrl = '/iframe/';

if (queryString.partner) {
  url = 'https://www.hello.vote/' + queryString.partner + '/iframe/';
  iframeUrl = '/' + queryString.partner + '/iframe/'
}

var code = document.querySelectorAll('code');
var iframe = document.querySelectorAll('iframe');

code[0].textContent = '<iframe src="'+url+'" allowtransparency="1" frameborder="0"></iframe>';
code[3].textContent = '<iframe src="'+url+'?disclosureColor=ff8800&hueShift=120" allowtransparency="1" frameborder="0"></iframe>';

iframe[0].src = iframeUrl+'?disclosureColor=ffffff';
iframe[1].src = iframeUrl+'?disclosureColor=ffffff';
iframe[2].src = iframeUrl+'?disclosureColor=ff8800&hueShift=120';

