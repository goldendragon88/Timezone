'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Timezones Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin', 'manager'],
    allows: [{
      resources: '/api/timezones',
      permissions: '*'
    }, {
      resources: '/api/timezones/:timezoneId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/timezones',
      permissions: ['get', 'post']
    }, {
      resources: '/api/timezones/:timezoneId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/timezones',
      permissions: ['get']
    }, {
      resources: '/api/timezones/:timezoneId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Timezones Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Timezone is being processed and the current user created it then allow any manipulation
  if (req.timezone && req.user && req.timezone.user && req.timezone.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
