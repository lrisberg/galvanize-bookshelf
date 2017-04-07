'use strict';

const Joi = require('joi');

module.exports.patch = {
  body: {
    title: Joi.string()
      .label('Title')
      .trim(),

    author: Joi.string()
      .label('Author')
      .max(255)
      .trim(),

    genre: Joi.string()
      .label('Genre')
      .max(255)
      .trim(),

    description: Joi.string()
      .label('Description')
      .trim(),

    coverUrl: Joi.string()
      .label('CoverURL')
      .trim()
  }
};
