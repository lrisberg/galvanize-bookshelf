'use strict';

const express = require('express');
const knex = require('../knex');
const humps = require('humps');
const router = express.Router();

function checkAuth(req, res) {
  let cookies = req.cookies;
  if (!cookies.Authorization) {
    res.setHeader("Content-Type", "text/plain");
    res.status(401);
    res.send('Unauthorized');
    return false;
  } else {
    return true;
  }
}

router.get('/favorites', (req, res, next) => {
  if (checkAuth(req, res)) {
    knex('favorites')
      .join('books', 'books.id', '=', 'favorites.book_id')
      .where('favorites.user_id', 1)
      .then(books => {
        res.send(humps.camelizeKeys(books));
      });
  }
});


router.get('/favorites/check', (req, res, next) => {
  if (checkAuth(req, res)) {
    let number = req.query.bookId;
    knex('favorites')
      .where('book_id', number)
      .then(favorites => {
        res.send(favorites.length > 0)
      });
  }
});

router.post('/favorites', (req, res, next) => {
  if (checkAuth(req, res)) {
    let body = req.body;
    knex('favorites')
      .returning(['id', 'book_id', 'user_id'])
      .insert({
        book_id: body.bookId,
        user_id: 1
      })
      .then(book => {
        res.setHeader("Content-Type", "application/json")
        res.send(humps.camelizeKeys(book[0]))
      })
  }
})

router.delete('/favorites', (req, res, next) => {
  if (checkAuth(req, res)) {
    knex('favorites')
      .returning(["book_id", "user_id"])
      .where('book_id', req.body.bookId)
      .del()
      .then(book => {
        res.setHeader("Content-Type", "application/json")
        res.send(humps.camelizeKeys(book[0]));
      })
  }
})




module.exports = router;
