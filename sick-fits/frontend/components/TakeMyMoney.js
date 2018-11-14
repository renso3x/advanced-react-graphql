import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';

function totalItems(cart) {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
}

class TakeMyMoney extends React.Component {
  onToken = (res) => {
    console.log(res);
  }
  render() {
    return (<User>
      {({ data }, loading) => (
        <StripeCheckout
          stripeKey="pk_test_Y8O6nOLfQUNoKNPz5o4BNxXz"
          amount={calcTotalPrice(data.me.cart)}
          name="Sick Fits"
          description={`Order of ${totalItems(data.me.cart)} items!`}
          image={data.me.cart.length && data.me.cart[0].item.image}
          token={res => this.onToken(res)}
        >
          {this.props.children}
        </StripeCheckout>
      )}
    </User>)
  }
}

export default TakeMyMoney