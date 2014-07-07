var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
  var message = [];
  var sess = req.session;
  if (sess.views) {
    message.push('<p>views: ' + sess.views + '</p>');
    message.push('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>');
    sess.views++;
  } else {
    message.push('<p>welcome to the session demo. refresh!</p>');
    sess.views = 1;
  }
  if (req.isAuthenticated()) {
    message.push('<p>Authenticated!!</p>');
  } else {
    message.push('<p>Not Authenticated.</p>');
  }
  message.push('<p>respond with a resource</p>');

  message.push('<p><a href="/auth/logout" >Logout</a></p>');
  /*
   res.setHeader('Content-Type', 'text/html');
   res.write(message.join('\n'));
   res.end();
   */
  res.render('users', { title: 'Users', session: req.session, req: req });

});

var passport = require('passport');


router.get('/oauth_list', function (req, res) {
  // search tweets.
  var chiwawa = req.session.passport.user.chiwawa;
//  passport._strategies.oauth2._oauth2.useAuthorizationHeaderforGET(true);
  passport._strategies.oauth2._oauth2.get(
    process.env.CHIWAWA_URI + '/users',
    chiwawa.accessToken,
    function (err, data, response) {
      if (err) {
        res.send(err, 500);
        return;
      }
      res.send(data);
    });
});

module.exports = router;
