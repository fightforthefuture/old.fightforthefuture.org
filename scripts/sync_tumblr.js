var Habitat = require('habitat');

Habitat.load();

var
  env = new Habitat('', {}),
  tumblrKeys = env.get('tumblr') || {},
  awsKeys = env.get('aws') || {};

if (
  !tumblrKeys.api_key
  ||
  !awsKeys.access_key
  ||
  !awsKeys.secret_key
  ||
  !awsKeys.s3_bucket
  ||
  !awsKeys.s3_folder
  ) {
  console.log('-----------------------------------------------------------------------');
  console.log('-----------------------------------------------------------------------');
  console.log('-----------------------------------------------------------------------');
  console.log('HHHHHHHHH     HHHHHHHHHEEEEEEEEEEEEEEEEEEEEEEYYYYYYY       YYYYYYY !!! ');
  console.log('H:::::::H     H:::::::HE::::::::::::::::::::EY:::::Y       Y:::::Y!!:!!');
  console.log('H:::::::H     H:::::::HE::::::::::::::::::::EY:::::Y       Y:::::Y!:::!');
  console.log('HH::::::H     H::::::HHEE::::::EEEEEEEEE::::EY::::::Y     Y::::::Y!:::!');
  console.log('  H:::::H     H:::::H    E:::::E       EEEEEEYYY:::::Y   Y:::::YYY!:::!');
  console.log('  H:::::H     H:::::H    E:::::E                Y:::::Y Y:::::Y   !:::!');
  console.log('  H::::::HHHHH::::::H    E::::::EEEEEEEEEE       Y:::::Y:::::Y    !:::!');
  console.log('  H:::::::::::::::::H    E:::::::::::::::E        Y:::::::::Y     !:::!');
  console.log('  H:::::::::::::::::H    E:::::::::::::::E         Y:::::::Y      !:::!');
  console.log('  H::::::HHHHH::::::H    E::::::EEEEEEEEEE          Y:::::Y       !:::!');
  console.log('  H:::::H     H:::::H    E:::::E                    Y:::::Y       !!:!!');
  console.log('  H:::::H     H:::::H    E:::::E       EEEEEE       Y:::::Y        !!! ');
  console.log('HH::::::H     H::::::HHEE::::::EEEEEEEE:::::E       Y:::::Y            ');
  console.log('H:::::::H     H:::::::HE::::::::::::::::::::E    YYYY:::::YYYY     !!! ');
  console.log('H:::::::H     H:::::::HE::::::::::::::::::::E    Y:::::::::::Y    !!:!!');
  console.log('HHHHHHHHH     HHHHHHHHHEEEEEEEEEEEEEEEEEEEEEE    YYYYYYYYYYYYY     !!! ');
  console.log('-----------------------------------------------------------------------');
  console.log('-----------------------------------------------------------------------');
  console.log('-----------------------------------------------------------------------');
  console.log('');
  console.log('You are missing some environment variables. That means your build isn\'t');
  console.log('syncing posts from Tumblr API. Check out .env.sample for instructions.');
  console.log('');
  console.log('-----------------------------------------------------------------------');
  process.exit();
}

var fs          = require('fs');
var request     = require('request');
var postPath    = 'site/_posts_full/'
var summaryPath = 'site/_posts/'

var AWS         = require('aws-sdk');

AWS.config.update({
    accessKeyId: awsKeys.access_key.trim(),
    secretAccessKey: awsKeys.secret_key.trim()
});

var getPosts = function(offset) {

  console.log('Asking Tumblr API for 20 posts, offset: '+ offset + '...')

  var url = 'https://api.tumblr.com/v2/blog/fight4future.tumblr.com/posts/text?api_key='+tumblrKeys.api_key.trim()+'&offset='+offset;

  request(url, function(err, httpResponse, body) {
    if (err || httpResponse.statusCode != 200) {
      console.log('TUMBLR API ERROR:', body);

      if (env.get('environment').toLowerCase() === 'review') {
        console.log('Tumblr API key not set, skipping sync because this is a review app.');
        process.exit(0);
      }

      process.exit(1);
    }
    var data = JSON.parse(body);
    var posts = data.response.posts;

    console.log('Parsing results...');

    for (var i = 0; i < posts.length; i++) {

      if (posts[i].state != 'published')
        continue;

      var date  = posts[i].date.substr(0, posts[i].date.indexOf(' '));
      var slug  = posts[i].slug;
      var file  = date + '-' + slug + '.html';
      var front = '---\n'

      front += 'layout: blog-post\n';
      front += 'header: true\n';

      if (posts[i].title) {
        front += 'title: \''+safeQuote(posts[i].title)+'\'\n';
        front += 'twittertext: \''+safeQuote(posts[i].title)+'\'\n';
      }

      front += 'date: '+posts[i].date+'\n';
      front += '---\n';

      console.log("• " + date + ': ' + posts[i].title);

      if (fs.existsSync(postPath + file)) {
        console.log('  - POST ALREADY EXISTS: ' + postPath + file);
        console.log('  - nothing else to do lol');
        return;
      } else {

        // oh tumblr is cranky about hotlinking images, so we have to re-host
        var regexp  = /<img[^>]+src="?([^"\s]+)"?\s*\/>/g;

        // copy all tumblr images to S3 and then re-write our <img> src URLs
        while (m = regexp.exec(posts[i].body)) {
          var url      = m[1];
          var filename = url.substring(url.lastIndexOf('/')+1);
          var path     = awsKeys.s3_folder.trim()+'/'+filename;
          var newUrl   = 'https://'+awsKeys.s3_bucket.trim()+'/'+path;

          console.log('  - Rehosting image: ' + url + ' => ' + newUrl);
          copyImageToS3(url, path);

          posts[i].body = posts[i].body.replace(url, newUrl);

          if (posts[i].body_abstract)
            posts[i].body_abstract = posts[i].body_abstract.replace(url, newUrl);
        }

        console.log('  - Post does not exist. Writing: ' + postPath + file);

        fs.writeFile(postPath+file, front + posts[i].body, function(err) {
            if(err) {
                console.log('FILE SAVE FAILURE: ', console.log(err));
                process.exit(1);
            }
        });
        var abstract = posts[i].body_abstract ? posts[i].body_abstract : posts[i].body;
        fs.writeFile(summaryPath+file, front + abstract, function(err) {
            if(err) {
                console.log('FILE SAVE FAILURE: ', console.log(err));
                process.exit(1);
            }
        });
      }
      console.log(' ');
    }
    if (posts.length == 20) getPosts(offset + 20);
  });
}

var copyImageToS3 = function(fromUrl, toPath) {

  var request2 = require('request').defaults({ encoding: null });

  request2.get(fromUrl, function (err, res, buffer) {

    var s3   = new AWS.S3();

    params   = {
      Bucket: awsKeys.s3_bucket.trim(),
      Key: toPath,
      ACL: 'public-read',
      Body: buffer,
      ContentType: res.headers['content-type']
    }

    s3.upload(params, function(err, data) {
        if (err) {
            console.log('AMAZON S3 UPLOAD FAILED: ', toPath);
            return console.log(err);
        }
    });
  });
}

var safeQuote = function(str) {
  return str.replace(/\'/g, '\'\'')
}

console.log('Syncing Tumblr posts to this project.');
getPosts(0);


