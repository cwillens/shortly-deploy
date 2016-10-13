var db = require('../config');

db.Url.addListener('created', function(link) {
  var shasum = crypto.createHash('sha1');
  shasum.update(link.url);
  var code = shasum.digest('hex').slice(0, 5);
  link.code = code;
});

module.exports = db.Url;
