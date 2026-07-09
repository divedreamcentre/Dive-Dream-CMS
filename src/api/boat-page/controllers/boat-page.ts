import { factories } from '@strapi/strapi';
import { deepPopulate } from '../../../utils/deep-populate';

export default factories.createCoreController('api::boat-page.boat-page', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = { ...ctx.query, populate: deepPopulate(strapi, 'api::boat-page.boat-page') };
    return super.find(ctx);
  },
}));
