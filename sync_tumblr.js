if (!process.env.TUMBLR_API_KEY) {
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
  console.log('You don\'t have a TUMBLR_API_KEY environment variable set. That means');
  console.log('your build isn\'t syncing posts from Tumblr API. Check out example.env');
  console.log('for instructions on what to do!')
  console.log('');
  console.log('-----------------------------------------------------------------------');
  process.exit();
}

var fs      = require('fs');
var request = require('request');
var path    = 'site/_blog_posts/'

var getPosts = function(offset) {

  console.log('Asking Tumblr API for 20 posts, offset: '+ offset + '...')

  var url = 'https://api.tumblr.com/v2/blog/fight4future.tumblr.com/posts/text?api_key='+process.env.TUMBLR_API_KEY.trim()+'&offset='+offset;

  request(url, function(err, httpResponse, body) {
    if (err || httpResponse.statusCode != 200) {
      console.log('TUMBLR API ERROR:', body);
      process.exit();
    }
    var data = JSON.parse(body);
    var posts = data.response.posts;

    console.log('Parsing results...');

    for (var i = 0; i < posts.length; i++) {

      if (posts[i].state != 'published')
        continue;

      var date = posts[i].date.substr(0, posts[i].date.indexOf(' '));
      var slug = posts[i].slug;
      var file = date + '-' + slug + '.html';

      console.log("• " + date + ': ' + posts[i].title);

      try {
        fs.accessSync(path + file);
        console.log('  - POST ALREADY EXISTS: ' + path + file);
        console.log('  - nothing else to do lol');
        return;
      } catch (err) {
        console.log('  - Post does not exist. Writing:' + path + file);
        fs.writeFile(path+file, posts[i].body, function(err) {
            if(err) {
                console.log('FILE SAVE FAILURE: ', console.log(err));
                process.exit();
            }
        });
      }
      console.log(' ');
    }
    if (posts.length == 20) getPosts(offset + 20);
  });
}
console.log('Syncing Tumblr posts to this project.');
getPosts(0);


