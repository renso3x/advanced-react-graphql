import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import formatMoney from '../lib/formatMoney';
import RemoveCartitem from './RemoveCartitem';

const CartItemStyles = styled.li`
 padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.lightgrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 10px;
  }
  h3,
  p {
    margin: 0;
  }
`;

const CartItem = (cart) => {
  const { quantity, item, cartId } = cart
  return (
    <CartItemStyles>
      <img src={item.image} style={{ height: '100px' }} />
      <div className="cart-item-details">
        <h3>{item.title}</h3>
        <p>{formatMoney(item.price * quantity)}
          {' - '}
          <em>
            {quantity} &times; {formatMoney(item.price)} each
        </em>
        </p>
      </div>
      <RemoveCartitem id={cartId} />
    </CartItemStyles>
  );
}

CartItem.propTypes = {
  cart: PropTypes.shape({
    quantity: PropTypes.number.isRequired,
    item: PropTypes.shape({
      image: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired
    })
  })
};

export default CartItem;