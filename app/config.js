var path = require('path');
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/data/db');

var Schema = mongoose.Schema;

var urlSchema = new Schema( {
  _id: { type: Schema.ObjectId, auto: true},
  url: String,
  code: String,
  visits: Number
});

var userSchema = new Schema( {
  _id: { type: Schema.ObjectId, auto: true},
  username: String,
  password: String
});

var db = mongoose.connection;



exports.Url = mongoose.model('Url', urlSchema);
exports.User = mongoose.model('User', userSchema);
exports.db = db;

// var troll = new Url({url: 'poop', code: '123213', visits: 0});

// console.log(troll._id);





















//================================== A WHOLE NEW WORLD ================================





// var knex = require('knex')({
//   client: 'sqlite3',
//   connection: {
//     filename: path.join(__dirname, '../db/shortly.sqlite')
//   },
//   useNullAsDefault: true
// });
// var db = require('bookshelf')(knex);

// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('baseUrl', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// module.exports = db;
