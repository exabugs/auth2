/**
 *
 * @see
 * http://www.machu.jp/diary/20110722.html#p01
 *
 * @type {_|exports}
 * @private
 */

var _ = require('underscore');
var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local');
var TwitterStrategy = require('passport-twitter');
//var GoogleStrategy = require('passport-google').Strategy;
//var GoogleStrategy = require('passport-google-oauth').OAuthStrategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var FacebookStrategy = require('passport-facebook');

var OAuth2Strategy = require('passport-oauth2');

var User = require('../lib/user');

var redirect = { successRedirect: '/users', failureRedirect: '/login' }

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});


passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (!user.verifyPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  }
));


router.get('/login', function (req, res) {
  res.render('login', { title: 'Express' });
});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

router.post('/login',
  passport.authenticate('local', redirect)
);


/**
 *
 * Chiwawa
 *
 */

passport.use(new OAuth2Strategy({
    authorizationURL: process.env.CHIWAWA_URI + '/oauth2/authorize',
    tokenURL: process.env.CHIWAWA_URI + '/oauth2/token',
    clientID: 'abc123',
    clientSecret: 'ssh-secret',
    callbackURL: "/auth/chiwawa/callback"
  },
  function (accessToken, refreshToken, profile, done) {
    profile.chiwawa = profile.chiwawa || {};
    profile.chiwawa.accessToken = accessToken;
    profile.chiwawa.refreshToken = refreshToken;

    process.nextTick(function () {
      return done(null, profile);
    });
/*
    User.findOrCreate({ exampleId: profile.id }, function (err, user) {
      return done(err, user);
    });
*/
  }
));

router.get('/chiwawa',
  passport.authenticate('oauth2'));

router.get('/chiwawa/callback',
  passport.authenticate('oauth2', redirect));

/**
 *
 * Twitter
 *
 */

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "/auth/twitter/callback"
  },
  function (token, tokenSecret, profile, done) {
    User.findOrCreate({ twitterId: profile.id }, function (err, user) {
      var prop = ['displayName', 'id', 'provider', 'username'];
      user = _.extend(user, _.pick(profile, prop));
      return done(err, user);
    });
  }
));

router.get('/twitter',
  passport.authenticate('twitter'));

router.get('/twitter/callback',
  passport.authenticate('twitter', redirect));

/**
 *
 * Google
 *
 */
/*
 passport.use(new GoogleStrategy({
 returnURL: '/auth/google/return',
 realm: '/'
 },
 function(identifier, done) {
 User.findByOpenID({ openId: identifier }, function (err, user) {
 return done(err, user);
 });
 }
 ));

 router.get('/google', passport.authenticate('google'));

 router.get('/google/return',
 passport.authenticate('google', redirect)
 );
 */

/**
 *
 * Google OAuth
 *
 *
 */

/*
 passport.use(new GoogleStrategy({
 consumerKey: process.env.GOOGLE_CONSUMER_KEY,
 consumerSecret: process.env.GOOGLE_CONSUMER_SECRET,
 callbackURL: "/auth/google/callback"
 },
 function(token, tokenSecret, profile, done) {
 User.findOrCreate({ googleId: profile.id }, function (err, user) {
 return done(err, user);
 });
 }
 ));

 router.get('/google',
 passport.authenticate('google', { scope: 'https://www.google.com/m8/feeds' }));

 router.get('/google/callback',
 passport.authenticate('google', redirect)
 );
 */

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function (accessToken, refreshToken, profile, done) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      var prop = ['displayName', 'id', 'provider', 'username', 'name', 'emails'];
      user = _.extend(user, _.pick(profile, prop));
      return done(err, user);
    });
  }
));


var google_scope = [
  'https://www.google.com/m8/feeds',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

router.get('/google',
  passport.authenticate('google', { scope: google_scope.join(' ') }));

router.get('/google/callback',
  passport.authenticate('google', redirect));


/**
 *
 * Facebook
 *
 *
 */

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    enableProof: false
  },
  function (accessToken, refreshToken, profile, done) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      var prop = ['displayName', 'id', 'provider', 'username', 'name', 'gender', 'profileUrl'];
      user = _.extend(user, _.pick(profile, prop));
      return done(err, user);
    });
  }
));

router.get('/facebook',
  passport.authenticate('facebook'));

router.get('/facebook/callback',
  passport.authenticate('facebook', redirect));

module.exports = router;
