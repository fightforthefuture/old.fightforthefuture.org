var express = require('express');
var app = express();
var path = require('path');
var Habitat = require('habitat');

Habitat.load('.env');

var
  env = new Habitat('', {
    port: 4040
  });

app.use(express.static(path.join(__dirname, '../public')));
app.listen(env.get('port'));
