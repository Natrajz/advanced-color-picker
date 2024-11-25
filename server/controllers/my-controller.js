'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('advanced-color-picker')
      .service('myService')
      .getWelcomeMessage();
  },
});
