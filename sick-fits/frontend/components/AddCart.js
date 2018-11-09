import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
    }
  }
`;


const AddCart = ({ id }) => (
  <Mutation mutation={ADD_TO_CART_MUTATION} variables={{ id }}>
    {(addtoCart) => (
      <button onClick={addtoCart}>Add To Cart &nbsp; 🛒</button>
    )}
  </Mutation>
);

export default AddCart;