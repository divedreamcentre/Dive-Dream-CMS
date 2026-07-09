import { factories } from '@strapi/strapi';
import { deepPopulate } from '../../../utils/deep-populate';

export default factories.createCoreController('api::about-page.about-page', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = { ...ctx.query, populate: deepPopulate(strapi, 'api::about-page.about-page') };
    return super.find(ctx);
  },
}));
