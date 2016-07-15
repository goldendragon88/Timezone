'use strict';

/**
 * Module dependencies
 */
var timezonesPolicy = require('../policies/timezones.server.policy'),
  timezones = require('../controllers/timezones.server.controller');

module.exports = function(app) {
  // Timezones Routes
  app.route('/api/timezones').all(timezonesPolicy.isAllowed)
    .get(timezones.list)
    .post(timezones.create);

  app.route('/api/timezones/:timezoneId').all(timezonesPolicy.isAllowed)
    .get(timezones.read)
    .put(timezones.update)
    .delete(timezones.delete);

  // Finish by binding the Timezone middleware
  app.param('timezoneId', timezones.timezoneByID);
};
