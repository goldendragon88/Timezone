'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Timezone = mongoose.model('Timezone'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Timezone
 */
exports.create = function(req, res) {
  var timezone = new Timezone(req.body);
  timezone.user = req.user;

  timezone.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(timezone);
    }
  });
};

/**
 * Show the current Timezone
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var timezone = req.timezone ? req.timezone.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  timezone.isCurrentUserOwner = req.user && timezone.user && timezone.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(timezone);
};

/**
 * Update a Timezone
 */
exports.update = function(req, res) {
  var timezone = req.timezone ;

  timezone = _.extend(timezone , req.body);

  timezone.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(timezone);
    }
  });
};

/**
 * Delete an Timezone
 */
exports.delete = function(req, res) {
  var timezone = req.timezone ;

  timezone.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(timezone);
    }
  });
};

/**
 * List of Timezones
 */
exports.list = function(req, res) { 
  var filter = {};
  console.log(req.user.roles);
  if (req.user.roles[0] !== 'admin') {
    console.log('fetch only my timezones');
    filter = {'user': mongoose.Types.ObjectId(req.user._id)};
  } else {
    console.log('fetch all');
  }
  console.log('filter', filter);
  Timezone.find(filter).sort('-created').populate('user', 'displayName').exec(function(err, timezones) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(timezones);
    }
  });
};

/**
 * Timezone middleware
 */
exports.timezoneByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Timezone is invalid'
    });
  }

  Timezone.findById(id).populate('user', 'displayName').exec(function (err, timezone) {
    if (err) {
      return next(err);
    } else if (!timezone) {
      return res.status(404).send({
        message: 'No Timezone with that identifier has been found'
      });
    }
    req.timezone = timezone;
    next();
  });
};
