var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local');
//var TwitterStrategy = require('passport-twitter');

var User = require('../lib/user');





router.get('/login', function (req, res) {
  res.render('login', { title: 'Express' });
});

router.post('/login',
  passport.authenticate('local',
    { successRedirect: '/', failureRedirect: '/' }
/*
    function (req, res) {
      res.redirect('/');
    });
*/
  ));

/*

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
  },
  function (token, tokenSecret, profile, done) {
    User.findOrCreate({ twitterId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

router.get('/twitter', function (req, res) {
  passport.authenticate('twitter');
});

router.get('/twitter/callback', function (req, res) {
  passport.authenticate('twitter', { failureRedirect: '/login' });
  /*
   function(req, res) {
   // Successful authentication, redirect home.
   res.redirect('/');
   });

});

*/

module.exports = router;
