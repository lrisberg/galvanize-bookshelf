'use strict';

const express = require('express');
const knex = require('../knex');
const humps = require('humps');
const router = express.Router();


router.get('/favorites', (req, res, next) => {
  knex('favorites')
    .join('books', 'books.id', '=', 'favorites.book_id')
    .where('favorites.user_id', 1)
    .then(books => {
      res.send(humps.camelizeKeys(books));
    });
});

router.get('/favorites/check', (req, res, next) => {
  let number = req.query.bookId;
  knex('favorites')
    .where('book_id', number)
    .then(favorites => {
      res.send(favorites.length > 0)
    });
});

router.post('/favorites', (req, res, next) => {
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
})

router.delete('/favorites', (req, res, next) => {
  knex('favorites')
    .returning(["book_id", "user_id"])
    .where('book_id', req.body.bookId)
    .del()
    .then(book => {
      res.setHeader("Content-Type", "application/json")
      res.send(humps.camelizeKeys(book[0]));
    })
})




module.exports = router;
