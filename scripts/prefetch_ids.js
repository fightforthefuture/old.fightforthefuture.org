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
  identifiers = [],
  env = new Habitat('', {
    actionnetwork_url: 'https://actionnetwork.org',
    actionnetwork_apikey: 'fff77784046dc3393ba51097511e011fdeb9f384' // definitely not 90's pop lyrics, nope.
  });

function compilePetitionsConfig(petitions) {
  var
    petitionsConfig = 'petition_identifiers:\n',
    i = petitions.length;

  while (i--) {
    petitionsConfig += '  "' + petitions[i].url + '": "' + petitions[i].identifier + '"\n';
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

function sendPetitionsRequest(page) {

  request({
    url: url.parse(env.get('actionnetwork').url + '/api/v2/petitions/?page=' + page),
    headers: {
      'Content-Type': 'application/json',
      'OSDI-API-Token': env.get('actionnetwork').apikey
    }
  }, function (error, response, body) {
    "use strict";

    if (error || response.statusCode !== 200) {
      console.error('Prefetching petition identifiers failed. The script attempted to connect to\n' +
        env.get('actionnetwork').url + ', but returned an error of ', error);

      if (env.get('travis')) {
        process.exit(1);
      }
      return false;
    }

    var
      data = JSON.parse(body),
      petitionsObject = data._embedded['osdi:petitions'],
      i = petitionsObject.length;

    if (i > 0) {
      while (i--) {
        identifiers.push({
          url: petitionsObject[i].browser_url,
          identifier: petitionsObject[i].identifiers[0].replace('action_network:', '')
        });
      }

      if (data.page < data.total_pages) {
        sendPetitionsRequest(data.page + 1);
      } else {
        compilePetitionsConfig(identifiers);
      }

    } else {
      console.error('Action Network thinks there are zero petitions.');
    }
  });
}

sendPetitionsRequest(1);
