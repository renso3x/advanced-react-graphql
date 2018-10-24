const { forwardTo } = require('prisma-binding');

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db')
  // async items(parent, args, ctx, info) {
  //   const allItems = await ctx.db.query.items();
  //   return allItems;
  // }
};

module.exports = Query;
