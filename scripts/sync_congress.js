var fs          = require('fs');
var request     = require('request');
var yaml        = require('js-yaml');
var url         = 'https://spreadsheets.google.com/feeds/list/1rTzEY0sEEHvHjZebIogoKO1qfTez2T6xNj0AScO6t24/default/public/values?alt=json';

request(url, function(err, httpResponse, body) {
  if (err || httpResponse.statusCode != 200) {
    console.log('GOOGLE SHEETS API ERROR:', body);
    process.exit(1);
  }

  var congress = [];
  var data = JSON.parse(body);
  var entries = data.feed.entry;

  for (var i = 0; i < entries.length; i++) {

    var entry = {};

    for (var key in entries[i]) {

      if (entries[i].hasOwnProperty(key)) {
        if (key.indexOf('gsx$') == 0) {
          entry[key.substr(4)] = entries[i][key]['$t'];
        }
      }
    }

    congress.push(entry)
  }

  var dump = yaml.safeDump(congress);

  fs.writeFile('site/_data/congress.yml', dump, function(err) {
      if(err) {
          console.log('FILE SAVE FAILURE: ', console.log(err));
          process.exit(1);
      }
  });

  console.log('Synced Congress scoreboard data to ./site/_data/congress.yml');
});
