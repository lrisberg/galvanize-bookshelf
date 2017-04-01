'use strict';

const express = require('express');
const knex = require('../knex');
const humps = require('humps');
const router = express.Router();


router.post('/token', (req, res, next) => {
  let credentials = req.body;
  res.cookie('Authorization', '1')
  res.end();
})

module.exports = router;
