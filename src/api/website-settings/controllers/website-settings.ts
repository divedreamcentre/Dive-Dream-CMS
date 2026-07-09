import { factories } from '@strapi/strapi';
import { deepPopulate } from '../../../utils/deep-populate';

export default factories.createCoreController('api::website-settings.website-settings', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = { ...ctx.query, populate: deepPopulate(strapi, 'api::website-settings.website-settings') };
    return super.find(ctx);
  },
}));
