import React, { Component } from 'react'
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ALL_ITEMS_QUERY } from './Items';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`

export default class DeleteItem extends Component {
  update = (cache, payload) => {
    //manually udpate the cache on the client , so it matches the server
    // Read the cache for the items
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    // filter the item from the deleted
    data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id);
    // Write the udpated from the cache
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  }

  render() {
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}
      >
        {(deleteItem, { error }) => {
          return (
            <button onClick={(e) => {
              if (confirm('Are you sure you want to delete this item?')) {
                deleteItem().catch(err => {
                  alert(err.message);
                });
              }
            }}>
              {this.props.children}
            </button>
          )
        }}
      </Mutation>
    )
  }
}
