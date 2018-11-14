const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { makeANiceEmail, transport } = require('../mail');
const { hasPermission } = require('../utils');
const stripe = require('../stripe');

const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: Check if they are logged in
    if (!ctx.request.userId) {
      throw new Error('You should be logged in!');
    }

    const item = await ctx.db.mutation.createItem(
      {
        data: {
          //add relationship
          user: {
            connect: {
              id: ctx.request.userId
            }
          },
          ...args,
        },
      },
      info
    );

    console.log(item);

    return item;
  },
  updateItem(parent, args, ctx, info) {
    // first take a copy of the updates
    const updates = { ...args };
    // remove the ID from the updates
    delete updates.id;
    // run the update method
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info
    );
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // 1. find the item
    const item = await ctx.db.query.item({ where }, `{ id title user { id }}`);
    // 2. Check if they own that item, or have the permissions
    const isOwner = item.user.id === ctx.request.userId;
    const hasPermissions = ctx.request.user.permissions.some(permission => {
      ['ADMIN', 'ITEMDELETE'].includes(permission)
    });
    if (!isOwner && !hasPermissions) {
      throw new Error('You are not allowed to delete');
    }
    // 3. Delete it!
    return ctx.db.mutation.deleteItem({ where }, info);
  },
  async signup(parent, args, ctx, info) {
    // lowercase their email
    args.email = args.email.toLowerCase();
    // hash their password
    const password = await bcrypt.hash(args.password, 10);
    // create the user in the database
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] },
        },
      },
      `{ id name email password }`
    );
    // create the JWT token for them
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // We set the jwt as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });
    // Finalllllly we return the user to the browser
    return user;
  },

  async signin(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email } });

    if (!user) {
      throw new Error(`Email ${email} does not exist`);
    }
    //check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid Password!');
    }
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });
    // Finalllllly we return the user to the browser
    return user;
  },

  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return { message: "GoodBye!" };
  },

  async requestReset(parent, args, ctx, info) {
    // 1. Check if this is a real user
    const user = await ctx.db.query.user({ where: { email: args.email } });

    if (!user) {
      throw new Error('User does not exist');
    }
    // 2. Set a reset token and expiry on that user
    const randomBytesPromiseified = promisify(randomBytes);
    const resetToken = (await randomBytesPromiseified(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry },
    });

    const mailRes = await transport.sendMail({
      from: 'romeo.enso93@gmail.com',
      to: user.email,
      subject: 'Your Password Reset Token',
      html: makeANiceEmail(`Your Password Reset Token is here!
      \n\n
      <a href="${process.env
          .FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here to Reset</a>`),
    });

    return { message: 'Thanks!' };
  },

  async resetPassword(parent, args, ctx, info) {
    // 1. check if the passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error('Yo password did not match!');
    }
    // 2. check if its a legit reset token
    // 3. Check if its expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000
      },
    });

    if (!user) {
      throw new Error('This token is either invalid or expired!');
    }
    // 4. Hash their new password
    const password = await bcrypt.hash(args.password, 10);
    // 5. Save the new password to the user and remove old resetToken fields
    const updateUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null
      }
    });
    // 6. Generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });
    // Finalllllly we return the user to the browser
    return user;
  },
  async updatePermissions(parent, args, ctx, info) {
    // check if login
    if (!ctx.request.userId) {
      throw new Error('You must be logged in!');
    }
    //query the current user
    const currentUser = await ctx.db.query.user(
      {
        where: {
          id: ctx.request.userId,
        },
      },
      info
    );

    // check if has user permission
    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);
    // update the user permission
    return ctx.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions,
          },
        },
        where: {
          id: args.userId,
        },
      },
      info
    );
  },

  async addToCart(parent, args, ctx, info) {
    // check if user is logged in
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error("You must be logged in")
    }

    // check if the item exist in the cart
    const [existingItem] = await ctx.db.query.cartItems({
      where: {
        user: {
          id: userId,
        },
        item: {
          id: args.id
        }
      }
    }, info);

    if (existingItem) {
      console.log('Your item already exist');
      // update the cart item
      return ctx.db.mutation.updateCartItem({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + 1 }
      }, info)
    }
    //create a new item in the cart
    return ctx.db.mutation.createCartItem({
      data: {
        user: {
          //relationship
          connect: {
            id: userId
          }
        },
        item: {
          connect: {
            id: args.id
          }
        }
      }
    }, info);
  },
  async removeToCart(parent, args, ctx, info) {
    const cartItem = await ctx.db.query.cartItem({
      where: { id: args.id }
    }, `{ id, user { id } }`);

    if (cartItem.user.id !== ctx.request.userId) {
      throw new Error('You are not allowed to delete an item.');
    }

    return ctx.db.mutation.deleteCartItem({ where: { id: cartItem.id } });
  },

  async createOrder(parent, args, ctx, info) {
    // 1. Query the current user and make sure they are signed in

    const { userId } = ctx.request;

    if (!userId) throw new Error('You must be signed in to complete this order.');

    const user = await ctx.db.query.user(
      { where: { id: userId } }, `{
      id
      name
      email
      cart {
        id
        quantity
        item { 
          title
          price
          id 
          description
          image
          largeImage
        }
      }
    }`);

    // 2. recalculate the total for the price
    const amount = user.cart.reduce((tally, cartItem) =>
      tally + cartItem.item.price * cartItem.quantity
      , 0);

    console.log(`Going to charge for a total of ${amount}`);

    // 3. Create the strip charge 
    const charge = await stripe.charges.create({
      amount,
      currency: 'USD',
      source: args.token // token from the user
    })
  }
};

module.exports = Mutations;
