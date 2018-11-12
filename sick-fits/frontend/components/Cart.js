import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import SickButton from './styles/SickButton';
import CloseButton from './styles/CloseButton';
import User from './User';
import CartItem from './CartItem';
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';

const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`;
const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`
const Cart = () => (
  <User>
    {({ data }) => {
      if (!data.me) return null;
      return (
        <Mutation mutation={TOGGLE_CART_MUTATION}>
          {(toggleCart) => (
            <Query query={LOCAL_STATE_QUERY}>
              {({ data: { cartOpen } }) => (
                <CartStyles open={cartOpen}>
                  <header>
                    <CloseButton title="close" onClick={toggleCart}>&times;</CloseButton>
                    <Supreme>{data.me.name}'s Cart</Supreme>
                    <p>You have {data.me.cart.length} item{data.me.cart.length === 1 ? '' : 's'} in your cart.</p>
                  </header>
                  {data.me.cart.map((cart) => <CartItem key={cart.id} quantity={cart.quantity} item={cart.item} />)}
                  <footer>
                    <p>{formatMoney(calcTotalPrice(data.me.cart))}</p>
                    <SickButton>Checkout</SickButton>
                  </footer>
                </CartStyles>
              )}
            </Query>
          )}
        </Mutation>
      )
    }}
  </User>
);

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };