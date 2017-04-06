'use strict';

const Joi = require('joi');

module.exports.patch = {
  body: {
    title: Joi.string()
      .label('Title')
      .required()
      .trim(),

    author: Joi.string()
      .label('Author')
      .required()
      .max(255)
      .trim(),

    genre: Joi.string()
      .label('Genre')
      .required()
      .max(255)
      .trim(),

    description: Joi.string()
      .label('Description')
      .required()
      .trim(),

    coverUrl: Joi.string()
      .label('CoverURL')
      .required()
      .trim()
  }
};
