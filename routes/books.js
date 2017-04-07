'use strict';

const express = require('express');
const knex = require('../knex');
const humps = require('humps');
const router = express.Router();

//validations
const ev = require('express-validation');
const validations = require('../validations/books');

router.get('/books', (req, res, next) => {
  knex('books')
    .orderBy('title')
    .then(books => {
      res.send(humps.camelizeKeys(books));
    });
});

function notFound(res) {
  res.setHeader("Content-Type", "text/plain");
  res.status(404);
  res.send('Not Found');
}

function notBlank(thing) {
  //   if (!body[thing]) {
  //     res.setHeader("Content-Type", "text/plain");
  //     res.status(400);
  //     res.send(`${thing} must not be blank`);
  //     return;
  //   }
}

router.get('/books/:id', (req, res, next) => {
  let id = req.params.id;
  if (isNaN(parseInt(id))) {
    notFound(res);
  } else {
    knex('books')
      .where('id', id)
      .then(books => {
        if (books.length === 0) {
          notFound(res);
        } else {
          res.send(humps.camelizeKeys(books[0]));
        }
      });
  }
});

router.post('/books', (req, res, next) => {
  let body = req.body;

  if (!body.title) {
    res.setHeader("Content-Type", "text/plain");
    res.status(400);
    res.send('Title must not be blank');
    return;
  }

  if (!body.author) {
    res.setHeader("Content-Type", "text/plain");
    res.status(400);
    res.send('Author must not be blank');
    return;
  }

  if (!body.genre) {
    res.setHeader("Content-Type", "text/plain");
    res.status(400);
    res.send('Genre must not be blank');
    return;
  }

  if (!body.description) {
    res.setHeader("Content-Type", "text/plain");
    res.status(400);
    res.send('Description must not be blank');
    return;
  }

  if (!body.coverUrl) {
    res.setHeader("Content-Type", "text/plain");
    res.status(400);
    res.send('Cover URL must not be blank');
    return;
  }

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

router.patch('/books/:id', ev(validations.patch), (req, res, next) => {
  let id = req.params.id
  let body = req.body;

  if (isNaN(parseInt(id))) {
    notFound(res);
    return;
  }

  knex('books')
    .where('id', id)
    .then((books) => {
      if (books.length === 0) {
        notFound(res);
      } else {
        knex('books')
          .returning(['id', 'title', 'author', 'genre', 'description', 'cover_url'])
          .where('id', id)
          .update({
            title: body.title,
            author: body.author,
            genre: body.genre,
            description: body.description,
            cover_url: body.coverUrl
          })
          .then(books => {
            res.send(humps.camelizeKeys(books[0]))
          })
      }
    })
})

router.delete('/books/:id', (req, res, next) => {
  let id = req.params.id;

  if (isNaN(parseInt(id))) {
    notFound(res);
    return;
  }

  knex('books')
    .returning(["title", "author", "genre", "description", "cover_url"])
    .where('id', req.params.id)
    .del()
    .then(books => {
      if (books.length === 0) {
        notFound(res);
      }
      else {
        res.send(humps.camelizeKeys(books[0]));
      }
    })
})

module.exports = router;
