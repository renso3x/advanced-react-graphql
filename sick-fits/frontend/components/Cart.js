import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { adopt } from 'react-adopt';
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
`;

const Consumer = adopt({
  data: ({ render }) => <User>{render}</User>,
  toggleCart: ({ render }) => <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>,
  localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>
});

const Cart = () => (
  <Consumer>
    {({ data, toggleCart, localState }) => {
      const { me } = data.data;
      if (!me) return null;
      return (
        <CartStyles open={localState.data.cartOpen}>
          <header>
            <CloseButton title="close" onClick={toggleCart}>&times;</CloseButton>
            <Supreme>{me.name}'s Cart</Supreme>
            <p>You have {me.cart.length} item{me.cart.length === 1 ? '' : 's'} in your cart.</p>
          </header>
          {me.cart.map((cart) => <CartItem key={cart.id} quantity={cart.quantity} cartId={cart.id} item={cart.item} />)}
          <footer>
            <p>{formatMoney(calcTotalPrice(me.cart))}</p>
            <SickButton>Checkout</SickButton>
          </footer>
        </CartStyles>
      )
    }}
  </Consumer>
);

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };