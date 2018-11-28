import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
    }
  }
`;


const AddCart = ({ id }) => (
  <Mutation
    mutation={ADD_TO_CART_MUTATION}
    variables={{ id }}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {(addtoCart, { error, loading }) => (
      <button
        onClick={addtoCart}
        disabled={loading}
      >Add{loading ? 'ing' : ''} To Cart &nbsp; 🛒</button>
    )}
  </Mutation>
);

export default AddCart;
export { ADD_TO_CART_MUTATION };