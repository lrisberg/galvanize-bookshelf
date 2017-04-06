'use strict';

const express = require('express');
const knex = require('../knex');
const humps = require('humps');
const router = express.Router();
var jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
  if (req.cookies.token) {
    jwt.verify(req.cookies.token, 'shhhh', function(err, decoded) {
      if (err) {
        res.setHeader("Content-Type", "text/plain");
        res.status(401);
        res.send('Unauthorized');
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.setHeader("Content-Type", "text/plain");
    res.status(401);
    res.send('Unauthorized');
  }
}

router.get('/favorites', checkAuth, (req, res, next) => {
  knex('favorites')
    .join('books', 'books.id', '=', 'favorites.book_id')
    .where('favorites.user_id', req.user.userId)
    .then(books => {
      res.send(humps.camelizeKeys(books));
    });
});



router.get('/favorites/check', checkAuth, (req, res, next) => {
  let number = req.query.bookId;
  knex('favorites')
    .where('book_id', number)
    .where('user_id', req.user.userId)
    .then(favorites => {
      res.send(favorites.length > 0)
    });
});

router.post('/favorites', checkAuth, (req, res, next) => {
  let body = req.body;
  knex('favorites')
    .returning(['id', 'book_id', 'user_id'])
    .insert({
      book_id: body.bookId,
      user_id: req.user.userId
    })
    .then(book => {
      res.setHeader("Content-Type", "application/json")
      res.send(humps.camelizeKeys(book[0]))
    })
})

router.delete('/favorites', checkAuth, (req, res, next) => {
  knex('favorites')
    .returning(["book_id", "user_id"])
    .where('book_id', req.body.bookId)
    .where('user_id', req.user.userId)
    .del()
    .then(book => {
      res.setHeader("Content-Type", "application/json")
      res.send(humps.camelizeKeys(book[0]));
    })
})

module.exports = router;
