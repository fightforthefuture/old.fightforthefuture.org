/**
 *  ----------------------------------------------------------------------------
 *  Generates a Free Progress domain security token!
 *  ----------------------------------------------------------------------------
 *  This is a build script that generates a token to whitelist this site for
 *  Free Progress. It generates a file dist/freeprogress.txt based like so:
 *
 *  freeprogress.txt = SHA256( [FP_DOMAIN_SECURITY_TOKEN] + [CNAME] )
 *
 *  Where FP_DOMAIN_SECURITY_TOKEN is stored in Free Progress environment vars
 *        CNAME is the contents of the CNAME file in the root
 *
 */
var fs    = require('fs'),
    hash  = require('sha.js');
var token = process.env.FP_DOMAIN_SECURITY_TOKEN.trim();

try {
  var cname = fs.readFileSync('CNAME', 'utf8').trim().toLowerCase();
} catch(err) {
  console.log('No CNAME for this project. Nothing to do here.');
  process.exit(0);
}
var fpkey = hash('sha256').update(token + cname, 'utf8').digest('hex');

fs.writeFile('dist/freeprogress.txt', fpkey);

console.log('Wrote Free Progress domain security token to dist! lol');
