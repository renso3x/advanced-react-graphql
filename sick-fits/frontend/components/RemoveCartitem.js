import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { CURRENT_USER_QUERY } from './User';

const REMOVE_ITEM_MUTATION = gql`
    mutation REMOVE_ITEM_MUTATION ($id: ID!) {
    removeToCart(id: $id) {
      id
    } 
  }
`;

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`;

class RemoveCartitem extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  };

  update = (cache, payload) => {
    //fetch the user query
    const data = cache.readQuery({ query: CURRENT_USER_QUERY });
    //get the payload id
    const cartItemId = payload.data.removeToCart.id;
    // remove the cart
    data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId);
    // update the cache
    cache.writeData({ query: CURRENT_USER_QUERY, data });
  }

  render() {
    return (
      <Mutation
        mutation={REMOVE_ITEM_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}
        optimisticResponse={{
          __typename: 'Mutation',
          removeToCart: {
            __typename: 'CartItem', // type schema
            id: this.props.id
          }
        }}
      >
        {(removeToCart, { error, loading }) => (
          <BigButton
            title="Delete Item"
            onClick={() => removeToCart().catch(err => alert(err))}>
            &times;
          </BigButton>
        )}
      </Mutation>
    );
  }
}


export default RemoveCartitem;