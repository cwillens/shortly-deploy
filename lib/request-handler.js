var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');

// var db = require('../app/config');
// var User = require('../app/models/user');
// var Link = require('../app/models/link');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');
var shasum = crypto.createHash('sha1');

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

  shasum.update(uri);
  var code = shasum.digest('hex').slice(0, 5);

  var newLink = new db.Url({url: uri, code: code});
  newLink.save(function(error, link) {

  });



  // new Link({ url: uri }).fetch().then(function(found) {
  //   if (found) {
  //     res.status(200).send(found.attributes);
  //   } else {
  //     util.getUrlTitle(uri, function(err, title) {
  //       if (err) {
  //         console.log('Error reading URL heading: ', err);
  //         return res.sendStatus(404);
  //       }
  //       var newLink = new Link({
  //         url: uri,
  //         title: title,
  //         baseUrl: req.headers.origin
  //       });
  //       newLink.save().then(function(newLink) {
  //         Links.add(newLink);
  //         res.status(200).send(newLink);
  //       });
  //     });
  //   }
  // });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  db.User.find({username: username, password: password}).exec(function(error, user) {
    if (user[0]) {
      console.log('USERS ARE ', user[0]);
      util.createSession(req, res, user[0]);
      // res.redirect('/');
    } else {
      console.log('FAILEDDDD to login user');
    }
  });

  //   , function(error, user) {
  //   if (user) {
  //     console.log(user.username);
  //     util.createSession(req, res, user);
  //     res.redirect('/');
  //   } else {
  //     console.log('FAILEDDDD to login user');
  //   }
  // });
  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       res.redirect('/login');
  //     } else {
  //       user.comparePassword(password, function(match) {
  //         if (match) {
  //           util.createSession(req, res, user);
  //         } else {
  //           res.redirect('/login');
  //         }
  //       });
  //     }
  //   });
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
      //res.redirect('/');
    }
  });
  
  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       var newUser = new User({
  //         username: username,
  //         password: password
  //       });
  //       newUser.save()
  //         .then(function(newUser) {
  //           Users.add(newUser);
  //           util.createSession(req, res, newUser);
  //         });
  //     } else {
  //       console.log('Account already exists');
  //       res.redirect('/signup');
  //     }
  //   });
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
  // new Link({ code: req.params[0] }).fetch().then(function(link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });
};