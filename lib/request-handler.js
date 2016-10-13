var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  db.Url.find().exec(function(err, data) {
    res.status(200).send(data);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  db.Url.find({url: uri}).exec(function(error, link) {
    if (link[0]) {
      res.status(200).send(link[0]);
    } else {
      var shasum = crypto.createHash('sha1');
      shasum.update(uri);
      var code = shasum.digest('hex').slice(0, 5);

      var newLink = new db.Url({url: uri, code: code});
      newLink.save(function(error, link) {
        res.status(200).send(link);
      });
    }
  });

};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  db.User.find({username: username, password: password}).exec(function(error, user) {
    if (user[0]) {
      util.createSession(req, res, user[0]);
    } else {
      res.redirect('/login');
    }
  });

};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var newUser = new db.User({username: username, password: password});
  newUser.save(function(error, user) {
    if (error) {
      console.log(error);
    } else {
      console.log('success!');
      util.createSession(req, res, newUser);
    }
  });
  
};

exports.navToLink = function(req, res) {
  db.Url.find({code: req.params[0]}).exec(function(err, data) {
    var link = data[0];
    if (link) {
      res.redirect(link.url);
    } else {
      res.redirect('/');
    }
  });
};