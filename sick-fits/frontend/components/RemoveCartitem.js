import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';

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

  render() {
    return (
      <Mutation
        mutation={REMOVE_ITEM_MUTATION}
        variables={{ id: this.props.id }}
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