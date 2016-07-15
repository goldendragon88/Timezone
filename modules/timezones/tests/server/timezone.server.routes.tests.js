'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Timezone = mongoose.model('Timezone'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, timezone;

/**
 * Timezone routes tests
 */
describe('Timezone CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Timezone
    user.save(function () {
      timezone = {
        name: 'Timezone name'
      };

      done();
    });
  });

  it('should be able to save a Timezone if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Timezone
        agent.post('/api/timezones')
          .send(timezone)
          .expect(200)
          .end(function (timezoneSaveErr, timezoneSaveRes) {
            // Handle Timezone save error
            if (timezoneSaveErr) {
              return done(timezoneSaveErr);
            }

            // Get a list of Timezones
            agent.get('/api/timezones')
              .end(function (timezonesGetErr, timezonesGetRes) {
                // Handle Timezone save error
                if (timezonesGetErr) {
                  return done(timezonesGetErr);
                }

                // Get Timezones list
                var timezones = timezonesGetRes.body;

                // Set assertions
                (timezones[0].user._id).should.equal(userId);
                (timezones[0].name).should.match('Timezone name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Timezone if not logged in', function (done) {
    agent.post('/api/timezones')
      .send(timezone)
      .expect(403)
      .end(function (timezoneSaveErr, timezoneSaveRes) {
        // Call the assertion callback
        done(timezoneSaveErr);
      });
  });

  it('should not be able to save an Timezone if no name is provided', function (done) {
    // Invalidate name field
    timezone.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Timezone
        agent.post('/api/timezones')
          .send(timezone)
          .expect(400)
          .end(function (timezoneSaveErr, timezoneSaveRes) {
            // Set message assertion
            (timezoneSaveRes.body.message).should.match('Please fill Timezone name');

            // Handle Timezone save error
            done(timezoneSaveErr);
          });
      });
  });

  it('should be able to update an Timezone if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Timezone
        agent.post('/api/timezones')
          .send(timezone)
          .expect(200)
          .end(function (timezoneSaveErr, timezoneSaveRes) {
            // Handle Timezone save error
            if (timezoneSaveErr) {
              return done(timezoneSaveErr);
            }

            // Update Timezone name
            timezone.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Timezone
            agent.put('/api/timezones/' + timezoneSaveRes.body._id)
              .send(timezone)
              .expect(200)
              .end(function (timezoneUpdateErr, timezoneUpdateRes) {
                // Handle Timezone update error
                if (timezoneUpdateErr) {
                  return done(timezoneUpdateErr);
                }

                // Set assertions
                (timezoneUpdateRes.body._id).should.equal(timezoneSaveRes.body._id);
                (timezoneUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Timezones if not signed in', function (done) {
    // Create new Timezone model instance
    var timezoneObj = new Timezone(timezone);

    // Save the timezone
    timezoneObj.save(function () {
      // Request Timezones
      request(app).get('/api/timezones')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Timezone if not signed in', function (done) {
    // Create new Timezone model instance
    var timezoneObj = new Timezone(timezone);

    // Save the Timezone
    timezoneObj.save(function () {
      request(app).get('/api/timezones/' + timezoneObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', timezone.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Timezone with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/timezones/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Timezone is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Timezone which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Timezone
    request(app).get('/api/timezones/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Timezone with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Timezone if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Timezone
        agent.post('/api/timezones')
          .send(timezone)
          .expect(200)
          .end(function (timezoneSaveErr, timezoneSaveRes) {
            // Handle Timezone save error
            if (timezoneSaveErr) {
              return done(timezoneSaveErr);
            }

            // Delete an existing Timezone
            agent.delete('/api/timezones/' + timezoneSaveRes.body._id)
              .send(timezone)
              .expect(200)
              .end(function (timezoneDeleteErr, timezoneDeleteRes) {
                // Handle timezone error error
                if (timezoneDeleteErr) {
                  return done(timezoneDeleteErr);
                }

                // Set assertions
                (timezoneDeleteRes.body._id).should.equal(timezoneSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Timezone if not signed in', function (done) {
    // Set Timezone user
    timezone.user = user;

    // Create new Timezone model instance
    var timezoneObj = new Timezone(timezone);

    // Save the Timezone
    timezoneObj.save(function () {
      // Try deleting Timezone
      request(app).delete('/api/timezones/' + timezoneObj._id)
        .expect(403)
        .end(function (timezoneDeleteErr, timezoneDeleteRes) {
          // Set message assertion
          (timezoneDeleteRes.body.message).should.match('User is not authorized');

          // Handle Timezone error error
          done(timezoneDeleteErr);
        });

    });
  });

  it('should be able to get a single Timezone that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Timezone
          agent.post('/api/timezones')
            .send(timezone)
            .expect(200)
            .end(function (timezoneSaveErr, timezoneSaveRes) {
              // Handle Timezone save error
              if (timezoneSaveErr) {
                return done(timezoneSaveErr);
              }

              // Set assertions on new Timezone
              (timezoneSaveRes.body.name).should.equal(timezone.name);
              should.exist(timezoneSaveRes.body.user);
              should.equal(timezoneSaveRes.body.user._id, orphanId);

              // force the Timezone to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Timezone
                    agent.get('/api/timezones/' + timezoneSaveRes.body._id)
                      .expect(200)
                      .end(function (timezoneInfoErr, timezoneInfoRes) {
                        // Handle Timezone error
                        if (timezoneInfoErr) {
                          return done(timezoneInfoErr);
                        }

                        // Set assertions
                        (timezoneInfoRes.body._id).should.equal(timezoneSaveRes.body._id);
                        (timezoneInfoRes.body.name).should.equal(timezone.name);
                        should.equal(timezoneInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Timezone.remove().exec(done);
    });
  });
});
