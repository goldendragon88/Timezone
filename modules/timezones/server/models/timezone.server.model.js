'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Timezone Schema
 */
var TimezoneSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Timezone name',
    trim: true
  },
  city: {
    type: String,
    default: ''
  },
  difference: {
    type: Number,
    default: 0
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Timezone', TimezoneSchema);
