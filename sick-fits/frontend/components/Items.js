import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Item from './Item';

const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY {
    items {
      id
      title
      description
      image
      largeImage
      price
    }
  }
`;
const Center = styled.div`
  text-align: center;
`;

const ItemAlign = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-grap: 60px;
  max-width: {props => props.theme.maxWidth};
  margin: 0 auto;
`;

class Items extends Component {
  render() {
    return (
      <Center>
        <Query query={ALL_ITEMS_QUERY}>
          {({ data, error, loading }) => {
            if (loading) <p>Loading...</p>
            if (error) <p>Error: {error}</p>
            return <ItemAlign>
              {data.items.map(item => <Item key={item.id} item={item} />)}
            </ItemAlign>
          }}
        </Query>
      </Center>
    )
  }
}

export default Items;
export { ALL_ITEMS_QUERY };