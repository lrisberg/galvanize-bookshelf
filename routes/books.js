'use strict';

const express = require('express');
const knex = require('../knex');
const humps = require('humps');
const router = express.Router();

router.get('/books', (req, res, next) => {
  knex('books')
    .orderBy('title')
    .then(books => {
      res.send(humps.camelizeKeys(books));
    });
});

router.get('/books/:id', (req, res, next) => {
  let id = req.params.id;
  knex('books')
    .where('id', id)
    .then(books => {
      res.send(humps.camelizeKeys(books[0]));
    });
});

router.post('/books', (req, res, next) => {
  let body = req.body;
  knex('books')
    .returning(['id', 'title', 'author', 'genre', 'description', 'cover_url'])
    .insert({
      title: body.title,
      author: body.author,
      genre: body.genre,
      description: body.description,
      cover_url: body.coverUrl
    })
    .then(book => {
      res.send(humps.camelizeKeys(book[0]))
    })
})

router.patch('/books/:id', (req, res, next) => {
  let id = req.params.id
  let body = req.body;
  knex('books')
    .where('id', id)
    .returning(['id', 'title', 'author', 'genre', 'description', 'cover_url'])
    .update({
      title: body.title,
      author: body.author,
      genre: body.genre,
      description: body.description,
      cover_url: body.coverUrl
    })
    .then(book => {
      res.send(humps.camelizeKeys(book[0]))
    })

})

router.delete('/books/:id', (req, res, next) => {
  knex('books')
    .returning(["title", "author", "genre", "description", "cover_url"])
    .where('id', req.params.id)
    .del()
    .then(book => {
      res.send(humps.camelizeKeys(book[0]));
    })
})

module.exports = router;
