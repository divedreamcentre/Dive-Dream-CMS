import { factories } from '@strapi/strapi';
import { deepPopulate } from '../../../utils/deep-populate';

export default factories.createCoreController('api::homepage.homepage', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = { ...ctx.query, populate: deepPopulate(strapi, 'api::homepage.homepage') };
    return super.find(ctx);
  },
}));
