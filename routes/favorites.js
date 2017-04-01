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

module.exports = router;
