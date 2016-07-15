(function () {
  'use strict';

  angular
    .module('timezones')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Timezones',
      state: 'timezones',
      type: 'dropdown',
      roles: ['user', 'manager', 'admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'timezones', {
      title: 'List Timezones',
      state: 'timezones.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'timezones', {
      title: 'Create Timezone',
      state: 'timezones.create',
      roles: ['user', 'manager', 'admin']
    });
  }
})();
