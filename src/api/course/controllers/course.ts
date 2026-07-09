import { factories } from '@strapi/strapi';
import { deepPopulate } from '../../../utils/deep-populate';

export default factories.createCoreController('api::course.course', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = { ...ctx.query, populate: deepPopulate(strapi, 'api::course.course') };
    return super.find(ctx);
  },
  async findOne(ctx) {
    ctx.query = { ...ctx.query, populate: deepPopulate(strapi, 'api::course.course') };
    return super.findOne(ctx);
  },
}));
