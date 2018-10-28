const { forwardTo } = require('prisma-binding');

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
  }
  // async items(parent, args, ctx, info) {
  //   const allItems = await ctx.db.query.items();
  //   return allItems;
  // }
};

module.exports = Query;
