/**
 * Sends a request to the Action Network middleman to fetch petition IDs.
 *
 * @param {string} apiUrl - fftf action network middleman api url
 * */

var url = require('url');
var Habitat = require('habitat');
var fs = require('fs');
var request = require('request');

Habitat.load('.env');

var
  env = new Habitat('', {
    petitions_api: 'http://0.0.0.0:9104'
  }),
  location = url.parse(env.get('petitions').api + '/petition/list');

if (location.hostname === '0.0.0.0') {
  console.info('Either your petitions api url isn’t set, or you thought ahead and set it to a local instance.')
}

function compilePetitionsConfig(responseData) {
  var
    petitions = JSON.parse(responseData),
    petitionsConfig = 'petition_identifiers:\n',
    i = petitions.length;

  while (i--) {
    petitionsConfig += '  "' + petitions[i].title + '": "' + petitions[i].identifier + '"\n';
  }

  fs.writeFile('_config_petition_ids.yml', petitionsConfig, 'utf-8', function (error) {
    if (error) {
      console.error('Writing the petition ids to a config file didn’t work.\n' +
        'The error message was ', error);
      return false;
    }

    console.info('Success! ' + petitions.length + ' petitions found & written to ./_config_petition_ids.yml');
  });
}

request({
  url: location,
  headers: {'Content-Type': 'application/json'}
}, function (error, response, body) {
  "use strict";

  if (error || response.statusCode !== 200) {
    console.error('Prefetching petition identifiers failed. The script attempted to connect to\n' +
      location.host + ', but returned an error of', error);

    if (env.get('travis')) {
      process.exit(1);
    }
    return false;
  }

  compilePetitionsConfig(body);
});
