var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
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

  res.setHeader('Content-Type', 'text/html');
  res.write(message.join('\n'));
  res.end();
});

module.exports = router;
