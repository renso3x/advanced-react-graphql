const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, ctx, info) {
    //check if ther e is a current user Id
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user({
      where: { id: ctx.request.userId }
    }, info);
  },
  async users(parents, args, ctx, info) {
    // check if users is logged in
    if (!ctx.request.userId) {
      throw new Error('You should be logged in!');
    }
    // check if user have permission
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

    //return the list of users
    return ctx.db.query.users({}, info);
  }
  // async items(parent, args, ctx, info) {
  //   const allItems = await ctx.db.query.items();
  //   return allItems;
  // }
};

module.exports = Query;
