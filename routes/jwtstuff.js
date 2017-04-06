const express = require('express');
const app = express();

var cookieSession = require('cookie-session');
var jwt = require('jsonwebtoken');

app.use(cookieSession({
  name: 'session',
  keys: ['Gotham','Batman'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.get('/login',(req,res,next) => {
  // Normally check req.body and verify username/password in DB.

  var token = jwt.sign ({ loggedIn: true, isAdmin:true }, 'shhhh');

  req.session.jwt = token;

  res.send();
});

app.get('/secret',loggedIn,isAdmin,(req,res,next) => {
  res.send('You should be logged in to see this.')
});

app.get('/secret',(req,res,next) => {
  res.send('You suck and are not authenticated.')
});

function loggedIn(req,res,next) {
  if (req.session.jwt) {
    jwt.verify(req.session.jwt, 'shhhh', function(err, decoded) {
      if (err) {
        res.sendStatus(403);
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.sendStatus(403);
  }
}

function isAdmin(req,res,next) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    next('route');
  }
}

app.listen('3000',() => {
  console.log('Listening on port 3000');
})
