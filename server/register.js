'use strict';

module.exports = ({ strapi }) => {
  // register phase
  strapi.customFields.register({
    name: 'advanced-color-picker',
    plugin: 'advanced-color-picker',
    type: 'string',
  });

};
