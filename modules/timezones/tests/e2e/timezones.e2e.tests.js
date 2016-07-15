'use strict';

describe('Timezones E2E Tests:', function () {
  describe('Test Timezones page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/timezones');
      expect(element.all(by.repeater('timezone in timezones')).count()).toEqual(0);
    });
  });
});
